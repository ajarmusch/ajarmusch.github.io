// src/data/publications.ts

export interface Publication {
  // Basic Information
  title: string;
  shortTitle: string; // For display purposes
  authors: string[];
  year: number;
  month?: string;
  
  // Publication Details
  venue: string;
  venueShort: string; // Abbreviated venue name
  type: "conference" | "journal" | "preprint" | "workshop" | "poster" | "techreport";
  status: "published" | "accepted" | "under-review" | "preprint";
  
  // Identifiers & Links
  doi?: string;
  arxivId?: string;
  url: string;
  pdfUrl?: string;
  codeUrl?: string;
  dataUrl?: string;
  
  // Publication Versions - prioritize print over preprint for display
  printPublication?: {
    venue: string;
    year: number;
    month?: string;
    doi?: string;
    url?: string;
    pdfUrl?: string;
    pages?: string;
    volume?: string;
    number?: string;
  };
  preprintPublication?: {
    venue: string;
    arxivId?: string;
    doi?: string;
    url?: string;
    pdfUrl?: string;
  };
  
  // Citation Information
  volume?: string;
  number?: string;
  pages?: string;
  publisher?: string;
  
  // Additional Metadata
  abstract: string;
  keywords: string[];
  bibtexKey: string;
  
  // Research Project Tags - Connect to research.ts projects
  researchTags: string[]; // Maps to ResearchProject.id values
  primaryProject?: string; // Main project this publication belongs to
  
  // Display Options
  featured?: boolean;
  award?: string;
}

export const publicationsTech: Publication[] = [
  {
    title: "Dissecting the NVIDIA Blackwell Architecture with Microbenchmarks",
    shortTitle: "Blackwell Architecture Analysis",
    authors: ["Aaron Jarmusch", "Nathan Graddon", "Sunita Chandrasekaran"],
    year: 2025,
    month: "July",
    venue: "arXiv preprint",
    venueShort: "arXiv",
    type: "preprint",
    status: "preprint",
    doi: "10.48550/arXiv.2507.10789",
    arxivId: "2507.10789",
    url: "https://doi.org/10.48550/arXiv.2507.10789",
    pdfUrl: "https://arxiv.org/pdf/2507.10789",
    preprintPublication: {
      venue: "arXiv preprint",
      arxivId: "2507.10789",
      doi: "10.48550/arXiv.2507.10789",
      url: "https://doi.org/10.48550/arXiv.2507.10789",
      pdfUrl: "https://arxiv.org/pdf/2507.10789"
    },
    abstract: "This paper presents a microarchitectural analysis of the modern NVIDIA Blackwell architecture by studying GPU performance features with thought through microbenchmarks. We unveil key subsystems, including the memory hierarchy, SM execution pipelines, and the SM sub-core units, including the 5th generation tensor cores supporting FP4 and FP6 precisions. We compare the Blackwell architecture with the previous Hopper architecture using the GeForce RTX 5080 and H100 PCIe, respectively, presenting both generational improvements and performance regressions.",
    keywords: ["GPU Architecture", "NVIDIA Blackwell", "Microbenchmarks", "Performance Analysis", "Tensor Cores", "GPU Computing"],
    bibtexKey: "jarmusch2025blackwell",
    researchTags: ["gpu-architecture", "performance-analysis"],
    primaryProject: "gpu-architecture",
    featured: true
  },
  {
    title: "CI/CD Efforts for Validation, Verification and Benchmarking OpenMP Implementations",
    shortTitle: "OpenMP Offloading CI/CD",
    authors: ["Aaron Jarmusch", "Felipe Cabarcas", "Swaroop Pophale", "Andrew Kallai", "Johannes Doerfert", "Luke Peyralans", "Sunita Chandrasekaran"],
    year: 2024,
    month: "September",
    venue: "Advancing OpenMP for Future Accelerators: 20th International Workshop on OpenMP, IWOMP 2024",
    venueShort: "IWOMP 2024",
    type: "conference",
    status: "published",
    doi: "10.1007/978-3-031-72567-8_8",
    url: "https://dl.acm.org/doi/10.1007/978-3-031-72567-8_8",
    pages: "111-125",
    publisher: "Springer-Verlag",
    printPublication: {
      venue: "Advancing OpenMP for Future Accelerators: 20th International Workshop on OpenMP, IWOMP 2024",
      year: 2024,
      month: "September",
      doi: "10.1007/978-3-031-72567-8_8",
      url: "https://dl.acm.org/doi/10.1007/978-3-031-72567-8_8",
      pages: "111-125"
    },
    preprintPublication: {
      venue: "arXiv preprint",
      arxivId: "2408.11777",
      doi: "10.48550/arXiv.2408.11777",
      url: "https://doi.org/10.48550/arXiv.2408.11777",
      pdfUrl: "https://arxiv.org/pdf/2408.11777"
    },
    abstract: "This paper presents comprehensive CI/CD efforts for validation, verification, and benchmarking of OpenMP implementations, focusing on GPU offloading capabilities across diverse hardware architectures including NVIDIA H100, GH200, and AMD MI300A systems.",
    keywords: ["OpenMP", "CI/CD", "GPU Computing", "Validation", "Benchmarking", "HPC"],
    bibtexKey: "jarmusch2024openmp-cicd",
    researchTags: ["s4pst", "openmp-cicd", "gpu-validation-framework"],
    primaryProject: "s4pst",
    featured: true
  },
  {
    title: "Exploring LLM-as-a-Judge for Validation and Verification Testsuites",
    shortTitle: "LLM4VV Judge",
    authors: ["Zachariah Sollenberger", "Jay Patel", "Christian Munley", "Aaron Jarmusch", "Sunita Chandrasekaran"],
    year: 2024,
    month: "November",
    venue: "SC24-W: Workshops of the International Conference for High Performance Computing, Networking, Storage and Analysis",
    venueShort: "SC24-W",
    type: "workshop",
    status: "published",
    doi: "10.1109/SCW63240.2024.00238",
    url: "https://www.computer.org/csdl/proceedings-article/sc-workshops/2024/555400b885/23l2Cr4vgKQ",
    pages: "1885-1893",
    publisher: "IEEE Computer Society",
    printPublication: {
      venue: "SC24-W: Workshops of the International Conference for High Performance Computing, Networking, Storage and Analysis",
      year: 2024,
      month: "November",
      doi: "10.1109/SCW63240.2024.00238",
      url: "https://www.computer.org/csdl/proceedings-article/sc-workshops/2024/555400b885/23l2Cr4vgKQ",
      pages: "1885-1893"
    },
    preprintPublication: {
      venue: "arXiv preprint",
      arxivId: "2408.11729",
      doi: "10.48550/arXiv.2408.11729",
      url: "https://doi.org/10.48550/arXiv.2408.11729",
      pdfUrl: "https://arxiv.org/pdf/2408.11729"
    },
    abstract: "We explore the application of Large Language Models as automated judges for validation and verification testsuites in compiler development, demonstrating novel approaches to improve testing efficiency and coverage in HPC software systems.",
    keywords: ["LLM", "Compiler Validation", "Automated Testing", "AI", "Software Verification"],
    bibtexKey: "sollenberger2024llm-judge",
    researchTags: ["llm4vv", "openacc-vv"],
    primaryProject: "llm4vv",
    featured: true
  },
  {
    title: "LLM4VV: Developing LLM-Driven Testsuite for Compiler Validation",
    shortTitle: "LLM4VV",
    authors: ["Christian Munley", "Aaron Jarmusch", "Sunita Chandrasekaran"],
    year: 2024,
    month: "November",
    venue: "Future Generation Computer Systems",
    venueShort: "FGCS",
    type: "journal",
    status: "published",
    doi: "10.1016/j.future.2024.05.034",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0167739X24002449",
    volume: "160",
    pages: "1-13",
    publisher: "Elsevier",
    printPublication: {
      venue: "Future Generation Computer Systems",
      year: 2024,
      month: "November",
      doi: "10.1016/j.future.2024.05.034",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0167739X24002449",
      pages: "1-13",
      volume: "160"
    },
    preprintPublication: {
      venue: "arXiv preprint",
      arxivId: "2310.04963",
      doi: "10.48550/arXiv.2310.04963",
      url: "https://doi.org/10.48550/arXiv.2310.04963",
      pdfUrl: "https://arxiv.org/pdf/2310.04963"
    },
    abstract: "This work introduces LLM4VV, a novel framework that leverages Large Language Models for automated test generation in compiler validation workflows, addressing the growing complexity of modern HPC compiler ecosystems.",
    keywords: ["LLM", "Compiler Testing", "Automated Test Generation", "Validation", "HPC"],
    bibtexKey: "munley2024llm4vv",
    researchTags: ["llm4vv"],
    primaryProject: "llm4vv",
    featured: true
  },
  {
    title: "Analysis of Validating and Verifying OpenACC Compilers 3.0 and Above",
    shortTitle: "OpenACC V&V",
    authors: ["Aaron Jarmusch", "Aaron Liu", "Christian Munley", "Daniel Horta", "Vaidhyanathan Ravichandran", "Joel Denny", "Kyle Friedline", "Sunita Chandrasekaran"],
    year: 2022,
    month: "November",
    venue: "2022 Workshop on Accelerator Programming Using Directives (WACCPD)",
    venueShort: "WACCPD 2022",
    type: "workshop",
    status: "published",
    doi: "10.1109/WACCPD56842.2022.00006",
    url: "https://ieeexplore.ieee.org/document/10029456",
    pages: "1-10",
    publisher: "IEEE",
    printPublication: {
      venue: "2022 Workshop on Accelerator Programming Using Directives (WACCPD)",
      year: 2022,
      month: "November",
      doi: "10.1109/WACCPD56842.2022.00006",
      url: "https://ieeexplore.ieee.org/document/10029456",
      pages: "1-10"
    },
    preprintPublication: {
      venue: "arXiv preprint",
      arxivId: "2208.13071",
      doi: "10.48550/arXiv.2208.13071",
      url: "https://doi.org/10.48550/arXiv.2208.13071",
      pdfUrl: "https://arxiv.org/abs/2208.13071"
    },
    abstract: "We present a comprehensive analysis of validation and verification methodologies for OpenACC compilers version 3.0 and above, providing essential frameworks for ensuring compiler compliance across diverse GPU architectures.",
    keywords: ["OpenACC", "Compiler Validation", "GPU Computing", "Parallel Programming", "Verification"],
    bibtexKey: "jarmusch2022openacc-vv",
    researchTags: ["openacc-vv"],
    primaryProject: "openacc-vv",
    featured: true
  }
];

// Legacy export for backward compatibility
export const publicationsLegacy: { desc: string; href: string; title: string }[] = 
  publicationsTech.map(pub => ({
    desc: pub.title,
    href: pub.url,
    title: pub.shortTitle
  }));

// Helper functions for citation formatting
export function formatAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
}

export function formatCitation(pub: Publication): string {
  const authors = formatAuthors(pub.authors);
  const year = pub.year;
  const title = pub.title;
  const venue = pub.venue;
  
  if (pub.type === "preprint") {
    return `${authors}. ${year}. ${title}. ${venue}. ${pub.doi ? `doi: ${pub.doi}` : ''}`;
  }
  
  return `${authors}. ${year}. ${title}. In ${venue}${pub.pages ? `, pages ${pub.pages}` : ''}.`;
}

export function generateBibtex(pub: Publication): string {
  const type = pub.type === "preprint" ? "misc" : 
               pub.type === "conference" ? "inproceedings" : 
               pub.type === "journal" ? "article" : "misc";
  
  let bibtex = `@${type}{${pub.bibtexKey},\n`;
  bibtex += `  title={${pub.title}},\n`;
  bibtex += `  author={${pub.authors.join(' and ')}},\n`;
  bibtex += `  year={${pub.year}},\n`;
  
  if (pub.month) bibtex += `  month={${pub.month}},\n`;
  if (pub.venue) bibtex += `  ${pub.type === "journal" ? "journal" : "booktitle"}={${pub.venue}},\n`;
  if (pub.volume) bibtex += `  volume={${pub.volume}},\n`;
  if (pub.number) bibtex += `  number={${pub.number}},\n`;
  if (pub.pages) bibtex += `  pages={${pub.pages}},\n`;
  if (pub.publisher) bibtex += `  publisher={${pub.publisher}},\n`;
  if (pub.doi) bibtex += `  doi={${pub.doi}},\n`;
  if (pub.url) bibtex += `  url={${pub.url}},\n`;
  
  bibtex += '}';
  return bibtex;
}

// Helper functions for research project connections
export function getPublicationsByProject(projectId: string): Publication[] {
  return publicationsTech.filter(pub => 
    pub.researchTags.includes(projectId) || pub.primaryProject === projectId
  );
}

export function getRelatedPublications(projectIds: string[]): Publication[] {
  return publicationsTech.filter(pub => 
    pub.researchTags.some(tag => projectIds.includes(tag))
  );
}

export function getProjectsForPublication(publication: Publication): string[] {
  return publication.researchTags;
}

export function getPrimaryProjectForPublication(publication: Publication): string | undefined {
  return publication.primaryProject;
}

// Helper functions for publication display - prioritize print over preprint
export function getDisplayPublication(pub: Publication) {
  // Return print publication info if available, otherwise preprint
  if (pub.printPublication) {
    return {
      venue: pub.printPublication.venue,
      year: pub.printPublication.year || pub.year,
      month: pub.printPublication.month || pub.month,
      doi: pub.printPublication.doi,
      url: pub.printPublication.url || pub.url,
      pdfUrl: pub.printPublication.pdfUrl || pub.pdfUrl,
      pages: pub.printPublication.pages,
      type: 'published' as const
    };
  } else if (pub.preprintPublication) {
    return {
      venue: pub.preprintPublication.venue,
      year: pub.year,
      month: pub.month,
      doi: pub.preprintPublication.doi,
      url: pub.preprintPublication.url || pub.url,
      pdfUrl: pub.preprintPublication.pdfUrl || pub.pdfUrl,
      type: 'preprint' as const
    };
  } else {
    // Fallback to main publication info
    return {
      venue: pub.venue,
      year: pub.year,
      month: pub.month,
      doi: pub.doi,
      url: pub.url,
      pdfUrl: pub.pdfUrl,
      type: pub.type === 'preprint' ? 'preprint' as const : 'published' as const
    };
  }
}

export function hasPublishedVersion(pub: Publication): boolean {
  return !!pub.printPublication;
}

export function hasPreprintVersion(pub: Publication): boolean {
  return !!pub.preprintPublication;
}