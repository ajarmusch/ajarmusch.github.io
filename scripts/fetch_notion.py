#!/usr/bin/env python3
"""
Fetch data from Notion databases and emit JSON files for website + CV builds.

Usage:
    NOTION_TOKEN=secret_xxx python3 fetch_notion.py [--output-dir DIR] [--pretty]

Emits, into <output-dir> (default src/data/):
    publications.json   — entries from My Publications with showOnWebsite=true
    publications-cv.json — entries with showOnCV=true (superset usually)
    awards.json         — entries from Awards with showOnWebsite=true
    awards-cv.json      — entries with showOnCV=true
    projects.json       — entries from Projects with showOnWebsite=true
    projects-cv.json    — entries with showOnCV=true
    people.json         — full People DB (for relation lookups)
    news.json           — milestone-type awards on website, sorted by date desc
    _meta.json          — fetch timestamp, schema version, counts

The script uses only the Python standard library (no third-party deps).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Optional

NOTION_API = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"
SCHEMA_VERSION = 1

# Database IDs — these were assigned during Phase 0
DBS = {
    "publications": "29771ba156664d948c5564cd7b01b29b",
    "awards":       "1e3756b3dcf34b238bb9a57cd66e0a98",
    "people":       "fe9927738dea4d378ed5ca3fe9ceddc5",
    "projects":     "2650b9aba05081cdba80de14f859d630",
}

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------


def notion_request(method: str, path: str, body: Optional[dict], token: str) -> dict:
    """Issue a Notion API request with simple retry on 429/5xx."""
    url = f"{NOTION_API}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
    }
    for attempt in range(5):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 500, 502, 503, 504) and attempt < 4:
                sleep = 2 ** attempt
                print(f"  HTTP {e.code}, retrying in {sleep}s", file=sys.stderr)
                time.sleep(sleep)
                continue
            sys.exit(f"Notion API error {e.code} on {method} {path}:\n{body_text}")
        except urllib.error.URLError as e:
            sys.exit(f"Notion API network error: {e}")
    sys.exit("Notion API: exhausted retries")


def query_database(db_id: str, token: str, filter_: Optional[dict] = None) -> list[dict]:
    """Query a database, paginating through all results."""
    results: list[dict] = []
    body: dict[str, Any] = {"page_size": 100}
    if filter_:
        body["filter"] = filter_
    while True:
        data = notion_request("POST", f"/databases/{db_id}/query", body, token)
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        body["start_cursor"] = data["next_cursor"]
    return results


# ---------------------------------------------------------------------------
# Property extraction
# ---------------------------------------------------------------------------


def _plain(rich: list[dict]) -> str:
    return "".join(rt.get("plain_text", "") for rt in rich)


def prop_value(prop: Optional[dict]) -> Any:
    """Normalize any Notion property to a plain Python value."""
    if not prop:
        return None
    t = prop.get("type")
    if t == "title":
        return _plain(prop.get("title", []))
    if t == "rich_text":
        return _plain(prop.get("rich_text", []))
    if t == "url":
        return prop.get("url") or ""
    if t == "email":
        return prop.get("email") or ""
    if t == "phone_number":
        return prop.get("phone_number") or ""
    if t == "number":
        return prop.get("number")
    if t == "checkbox":
        return bool(prop.get("checkbox"))
    if t == "select":
        sel = prop.get("select") or {}
        return sel.get("name", "") or ""
    if t == "status":
        sel = prop.get("status") or {}
        return sel.get("name", "") or ""
    if t == "multi_select":
        return [opt["name"] for opt in prop.get("multi_select", [])]
    if t == "date":
        d = prop.get("date") or {}
        return {"start": d.get("start"), "end": d.get("end")}
    if t == "relation":
        return [r["id"] for r in prop.get("relation", [])]
    if t == "people":
        return [u.get("id") for u in prop.get("people", [])]
    if t == "created_time":
        return prop.get("created_time")
    if t == "last_edited_time":
        return prop.get("last_edited_time")
    return None


def page_props(page: dict) -> dict[str, Any]:
    """Flatten a page's properties into a plain dict."""
    return {name: prop_value(prop) for name, prop in page.get("properties", {}).items()}


# ---------------------------------------------------------------------------
# Transforms — Notion shape → Astro/CV shape
# ---------------------------------------------------------------------------


def transform_person(page: dict) -> dict:
    p = page_props(page)
    return {
        "id": page["id"],
        "name": p.get("Name") or "",
        "role": p.get("Role") or "",
        "affiliation": p.get("Affiliation") or "",
        "email": p.get("Email") or "",
        "orcid": p.get("ORCID") or "",
        "github": p.get("GitHub") or "",
        "website": p.get("Website") or "",
        "active": bool(p.get("Active")),
        "notes": p.get("Notes") or "",
        "url": page.get("url"),
    }


_PUB_TYPE_MAP = {
    "Paper": "conference",
    "Preprint": "preprint",
    "Journal": "journal",
    "Workshop": "workshop",
    "Talk": "talk",
    "Poster": "poster",
    "Blog": "blog",
    "Software": "software",
    "Technical Report": "techreport",
}

_PUB_STATUS_MAP = {
    "In prep": "in-prep",
    "Submitted": "submitted",
    "Under review": "under-review",
    "Accepted": "accepted",
    "Published": "published",
    "Withdrawn": "withdrawn",
}


def _slugify(s: str) -> str:
    import re

    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.lower()).strip("-")
    return s[:60] or "untitled"


def transform_publication(page: dict, people_by_id: dict[str, dict]) -> dict:
    p = page_props(page)
    title = p.get("Title") or ""
    notion_type = p.get("Type") or ""
    status = p.get("Status") or ""
    arxiv_id = (p.get("ArXiv ID") or "").strip()
    arxiv_url = (p.get("ArXiv URL") or "").strip()
    pdf_url = (p.get("PDF URL") or "").strip()
    doi = (p.get("DOI") or "").strip()
    venue = p.get("Venue") or ""
    year = p.get("Year")
    date = p.get("Date") or {}
    authors_text = p.get("Authors") or ""
    authors_list = [a.strip() for a in authors_text.split(",") if a.strip()]
    coauthor_ids = p.get("People (coauthors)") or []
    coauthor_names = [
        people_by_id[i]["name"]
        for i in coauthor_ids
        if i in people_by_id
    ]
    # Prefer the canonical Authors text since it preserves order; fall back to relation names.
    if not authors_list and coauthor_names:
        authors_list = ["Aaron Jarmusch", *coauthor_names]

    primary_url = pdf_url or arxiv_url or (
        f"https://doi.org/{doi}" if doi else ""
    )
    preprint = None
    if arxiv_id or arxiv_url:
        preprint = {
            "venue": "arXiv preprint",
            "arxivId": arxiv_id or None,
            "url": arxiv_url or (f"https://arxiv.org/abs/{arxiv_id}" if arxiv_id else None),
            "pdfUrl": pdf_url or (f"https://arxiv.org/pdf/{arxiv_id}" if arxiv_id else None),
            "doi": f"10.48550/arXiv.{arxiv_id}" if arxiv_id else None,
        }

    return {
        "id": page["id"],
        "title": title,
        "shortTitle": _short_title(title),
        "authors": authors_list,
        "year": int(year) if year is not None else None,
        "month": _month_from_date(date),
        "date": date.get("start") if date else None,
        "venue": venue,
        "venueShort": _venue_short(venue),
        "type": _PUB_TYPE_MAP.get(notion_type, "preprint"),
        "status": _PUB_STATUS_MAP.get(status, "preprint"),
        "doi": doi or None,
        "arxivId": arxiv_id or None,
        "url": primary_url,
        "pdfUrl": pdf_url or None,
        "arxivUrl": arxiv_url or None,
        "codeUrl": (p.get("Code repo") or "").strip() or None,
        "paperRepoUrl": (p.get("Paper repo") or "").strip() or None,
        "artifactRepoUrl": (p.get("Artifact repo") or "").strip() or None,
        "overleafUrl": (p.get("Overleaf URL") or "").strip() or None,
        "preprintPublication": preprint,
        "topics": p.get("Topics") or [],
        "keywords": p.get("Topics") or [],
        "cvCode": p.get("CV code") or None,
        "myPosition": int(p["My position"]) if p.get("My position") is not None else None,
        "showOnCV": bool(p.get("Show on CV")),
        "showOnWebsite": bool(p.get("Show on website")),
        "coauthorIds": coauthor_ids,
        "bibtexKey": f"jarmusch{year or ''}-{_slugify(title)[:30]}",
        "notionUrl": page.get("url"),
    }


def _short_title(title: str) -> str:
    # First 60 chars or up to the first colon/dash
    for sep in (":", " — ", " - "):
        if sep in title:
            return title.split(sep, 1)[0].strip()[:60]
    return title[:60]


def _venue_short(venue: str) -> str:
    # Heuristic: take text before first space-em-dash, or first uppercase abbreviation.
    if " — " in venue:
        return venue.split(" — ", 1)[0].strip()
    if " - " in venue:
        return venue.split(" - ", 1)[0].strip()
    return venue


_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def _month_from_date(date_field: Optional[dict]) -> Optional[str]:
    if not date_field or not date_field.get("start"):
        return None
    try:
        d = dt.date.fromisoformat(date_field["start"][:10])
        return _MONTH_NAMES[d.month - 1]
    except Exception:
        return None


def transform_award(page: dict) -> dict:
    p = page_props(page)
    return {
        "id": page["id"],
        "name": p.get("Name") or "",
        "type": p.get("Type") or "",
        "grantingOrg": p.get("Granting org") or "",
        "year": int(p["Year"]) if p.get("Year") is not None else None,
        "date": (p.get("Date") or {}).get("start"),
        "amount": p.get("Amount"),
        "description": p.get("Description") or "",
        "url": p.get("userDefined:URL") or p.get("URL") or "",
        "showOnCV": bool(p.get("Show on CV")),
        "showOnWebsite": bool(p.get("Show on website")),
        "publicationIds": p.get("Publications") or [],
        "projectIds": p.get("Project") or [],
        "peopleIds": p.get("People") or [],
        "notionUrl": page.get("url"),
    }


_PROJECT_STATUS_MAP = {
    "Backlog": "Active Development",
    "Planning": "Research Phase",
    "In Progress": "Active Development",
    "Paused": "Research Phase",
    "Done": "Completed",
    "Canceled": "Completed",
}

_PROJECT_TYPE_TO_CATEGORY = {
    "Research": "GPU Computing",
    "Engineering": "HPC Systems",
    "Writing": "GPU Computing",
    "Teaching": "Compiler Validation",
    "Side project": "AI-Driven Testing",
    "Service": "HPC Systems",
    "Other": "GPU Computing",
}


def transform_project(page: dict) -> dict:
    p = page_props(page)
    name = p.get("Project name") or ""
    notion_status = p.get("Status") or ""
    display_status = (
        p.get("Website status label") or _PROJECT_STATUS_MAP.get(notion_status, "Active Development")
    )
    github = (p.get("GitHub URL") or "").strip()
    website = (p.get("Website URL") or "").strip()
    overleaf = (p.get("Overleaf URL") or "").strip()
    drive = (p.get("Drive URL") or "").strip()
    type_ = p.get("Type") or ""
    tags = p.get("Tags") or []

    links: list[dict] = []
    if github:
        links.append({"type": "github", "url": github, "label": "GitHub Repository"})
    if website:
        links.append({"type": "website", "url": website, "label": "Project Website"})
    if overleaf:
        links.append({"type": "paper", "url": overleaf, "label": "Overleaf"})
    if drive:
        links.append({"type": "website", "url": drive, "label": "Drive"})

    return {
        "id": _slugify(name),
        "notionId": page["id"],
        "title": name,
        "description": p.get("Summary") or "",
        "status": display_status,
        "websiteStatusLabel": p.get("Website status label") or None,
        "notionStatus": notion_status,
        "type": type_,
        "category": _PROJECT_TYPE_TO_CATEGORY.get(type_, "GPU Computing"),
        "technologies": tags,
        "tags": tags,
        "githubUrl": github or None,
        "websiteUrl": website or None,
        "overleafUrl": overleaf or None,
        "driveUrl": drive or None,
        "links": links,
        "priority": p.get("Priority") or None,
        "showOnCV": bool(p.get("Show on CV")),
        "showOnWebsite": bool(p.get("Show on website")),
        "publicationIds": p.get("Publications") or [],
        "awardIds": p.get("Awards") or [],
        "notionUrl": page.get("url"),
    }


# ---------------------------------------------------------------------------
# News: derive from Awards filtered to Milestone-type + showOnWebsite
# ---------------------------------------------------------------------------


def build_news(awards: list[dict]) -> list[dict]:
    news = [
        a for a in awards
        if a.get("showOnWebsite")
        and a.get("type") in ("Milestone", "Recognition", "Award")
    ]
    # Sort by date desc (use year + month if no explicit date)
    def sortkey(a):
        return a.get("date") or f"{a.get('year') or 0}-12-31"
    news.sort(key=sortkey, reverse=True)
    return news


# ---------------------------------------------------------------------------
# Output writing
# ---------------------------------------------------------------------------


def write_json(path: Path, data: Any, pretty: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    indent = 2 if pretty else None
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False, sort_keys=False)
        f.write("\n")
    print(f"  wrote {path} ({len(data) if isinstance(data, list) else 'meta'})")


def main():
    parser = argparse.ArgumentParser(description="Fetch Notion data into JSON files.")
    parser.add_argument(
        "--output-dir",
        default="src/data",
        help="Where to write JSON files (default: src/data)",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")
    args = parser.parse_args()

    token = os.environ.get("NOTION_TOKEN")
    if not token:
        sys.exit("Error: NOTION_TOKEN environment variable not set")

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Fetching from Notion → {out_dir.resolve()}")

    # 1. People (no filter; small DB)
    print("• People")
    raw_people = query_database(DBS["people"], token)
    people = [transform_person(p) for p in raw_people]
    people_by_id = {p["id"]: p for p in people}
    write_json(out_dir / "people.json", people, args.pretty)

    # 2. Publications
    print("• Publications")
    raw_pubs = query_database(DBS["publications"], token)
    pubs = [transform_publication(p, people_by_id) for p in raw_pubs]
    # Sort by year desc, then My position asc
    pubs.sort(key=lambda p: (-(p.get("year") or 0), p.get("myPosition") or 99))
    write_json(out_dir / "publications.json",
               [p for p in pubs if p.get("showOnWebsite")], args.pretty)
    write_json(out_dir / "publications-cv.json",
               [p for p in pubs if p.get("showOnCV")], args.pretty)

    # 3. Awards
    print("• Awards")
    raw_awards = query_database(DBS["awards"], token)
    awards = [transform_award(a) for a in raw_awards]
    awards.sort(key=lambda a: -(a.get("year") or 0))
    write_json(out_dir / "awards.json",
               [a for a in awards if a.get("showOnWebsite")], args.pretty)
    write_json(out_dir / "awards-cv.json",
               [a for a in awards if a.get("showOnCV")], args.pretty)

    # 4. Projects
    print("• Projects")
    raw_projects = query_database(DBS["projects"], token)
    projects = [transform_project(p) for p in raw_projects]
    write_json(out_dir / "projects.json",
               [p for p in projects if p.get("showOnWebsite")], args.pretty)
    write_json(out_dir / "projects-cv.json",
               [p for p in projects if p.get("showOnCV")], args.pretty)

    # 5. News (derived view)
    print("• News (derived)")
    news = build_news([a for a in awards if a.get("showOnWebsite")])
    write_json(out_dir / "news.json", news, args.pretty)

    # 6. Meta
    meta = {
        "schemaVersion": SCHEMA_VERSION,
        "fetchedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "counts": {
            "people": len(people),
            "publications": len(pubs),
            "publicationsWebsite": sum(1 for p in pubs if p.get("showOnWebsite")),
            "publicationsCV": sum(1 for p in pubs if p.get("showOnCV")),
            "awards": len(awards),
            "awardsWebsite": sum(1 for a in awards if a.get("showOnWebsite")),
            "awardsCV": sum(1 for a in awards if a.get("showOnCV")),
            "projects": len(projects),
            "news": len(news),
        },
    }
    write_json(out_dir / "_meta.json", meta, pretty=True)

    print("\nDone.")
    print(f"  pubs (web): {meta['counts']['publicationsWebsite']}")
    print(f"  awards (web): {meta['counts']['awardsWebsite']}")
    print(f"  projects (web): {sum(1 for p in projects if p.get('showOnWebsite'))}")


if __name__ == "__main__":
    main()
