# scripts/ — Notion → JSON sync

`fetch_notion.py` queries the Notion API and emits JSON files into `src/data/`. Those files are consumed at Astro build time by the publications/research/awards pages, and by the Academic-CV repo's GitHub Action for the CV PDF build.

## Local use

```bash
export NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxx
python3 scripts/fetch_notion.py --pretty
```

The script uses only the Python standard library — no `pip install` needed.

## Output files

Written to `src/data/` by default (override with `--output-dir`):

- `publications.json` — entries with `Show on website` ticked
- `publications-cv.json` — entries with `Show on CV` ticked
- `awards.json` / `awards-cv.json` — same split, from the Awards DB
- `projects.json` / `projects-cv.json` — same split, from Projects DB
- `people.json` — full People DB (used for coauthor lookups; not consumed directly by pages)
- `news.json` — derived view: Award entries of type Milestone/Recognition/Award with `Show on website` ticked, sorted by date desc
- `_meta.json` — fetch timestamp, schema version, and counts

## Notion API token

The token is a personal Notion **Internal Integration** secret. Steps to create one:

1. Go to <https://www.notion.com/profile/integrations>.
2. Click **New integration** → name it "Personal Site Sync" → workspace = your workspace.
3. Capabilities tab: only **Read content** is needed.
4. Copy the **Internal Integration Secret** — starts with `secret_` or `ntn_`.
5. In Notion, open each of the five databases (Projects, My Publications, Awards, People, Inbox), click `...` → **Connections** → add your new integration.
6. In your GitHub repos (website + CV), Settings → **Secrets and variables** → Actions → New repository secret. Name: `NOTION_TOKEN`. Value: paste the secret.

The script reads it from the `NOTION_TOKEN` environment variable.

## CI

The `notion-sync.yml` workflow runs daily (06:00 UTC) and on manual dispatch. It:

1. Checks out the repo
2. Runs `python3 scripts/fetch_notion.py --pretty`
3. Commits any changes under `src/data/` with message `chore: sync Notion data [skip ci]`
4. Pushes, which triggers the existing `deploy.yml` build

The Academic-CV repo's `build-cv.yml` workflow checks out this repo (`ajarmusch.github.io`), runs the same script, then templates + compiles the CV PDF.
