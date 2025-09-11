// src/data/research.ts

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "Active Development" | "Production" | "Research Phase" | "Completed";
  technologies: string[];
  links: {
    type: "github" | "gitlab" | "website" | "paper";
    url: string;
    label: string;
  }[];
  logo?: string;
  category: "GPU Computing" | "HPC Systems" | "AI-Driven Testing" | "Compiler Validation";
}

export const researchProjects: ResearchProject[] = [
  {
    id: "openacc-vv",
    title: "OpenACC Validation and Verification (V&V) Testsuite",
    description: "Leading the development of a comprehensive validation and verification testsuite for the OpenACC Programming Model. This project ensures compiler compliance and reliability across diverse GPU architectures, supporting the broader HPC community.",
    status: "Active Development",
    technologies: ["OpenACC", "CUDA", "GPU Computing", "Compiler Testing", "C/C++"],
    links: [
      {
        type: "github",
        url: "https://github.com/OpenACCUserGroup/OpenACCV-V",
        label: "GitHub Repository"
      },
      {
        type: "website",
        url: "https://crpl.cis.udel.edu/oaccvv/",
        label: "Project Website"
      }
    ],
    logo: "/OpenACC-logo-color.png",
    category: "GPU Computing"
  },
  {
    id: "s4pst",
    title: "Stewardship for Programming Systems and Tools (S4PST)",
    description: "Contributing to a predictive ecosystem for HPC software sustainability. Our CI/CD pipeline for LLVM Clang and new-Flang's OpenMP Offloading implementation runs comprehensive test suites and benchmarks on cutting-edge GPU hardware including NVIDIA H100, GH200, and AMD MI210/MI300A.",
    status: "Production",
    technologies: ["OpenMP", "LLVM", "CI/CD", "Docker", "GitLab", "HPC", "GPU Benchmarking"],
    links: [
      {
        type: "gitlab",
        url: "https://gitlab.e4s.io/uo-public/llvm-openmp-offloading-v2/-/pipelines",
        label: "CI/CD Pipeline"
      },
      {
        type: "website",
        url: "https://s4pst.org",
        label: "S4PST Website"
      }
    ],
    logo: "/OpenMP_logo.png",
    category: "HPC Systems"
  },
  {
    id: "llm4vv",
    title: "LLM4VV: AI-Driven Compiler Testing",
    description: "Developing novel approaches to leverage Large Language Models for automated test generation and validation in compiler verification workflows. This research explores the intersection of AI and systems software to improve testing efficiency and coverage.",
    status: "Research Phase",
    technologies: ["LLMs", "GPT Models", "Automated Testing", "Compiler Validation", "Python", "AI/ML"],
    links: [
      {
        type: "paper",
        url: "https://doi.org/10.48550/arXiv.2310.04963",
        label: "arXiv Paper"
      },
      {
        type: "paper",
        url: "https://doi.org/10.48550/arXiv.2408.11729",
        label: "LLM-as-a-Judge Paper"
      }
    ],
    category: "AI-Driven Testing"
  },
  {
    id: "openmp-cicd",
    title: "OpenMP Offloading CI/CD Framework",
    description: "Comprehensive continuous integration and deployment framework for validating OpenMP GPU offloading implementations. Focuses on automated testing, performance benchmarking, and cross-platform compatibility across diverse GPU architectures.",
    status: "Active Development",
    technologies: ["OpenMP", "CI/CD", "GPU Offloading", "Performance Testing", "LLVM", "Clang"],
    links: [
      {
        type: "paper",
        url: "https://doi.org/10.48550/arXiv.2408.11777",
        label: "Research Paper"
      }
    ],
    category: "Compiler Validation"
  },
  {
    id: "gpu-validation-framework",
    title: "Multi-Architecture GPU Validation Framework",
    description: "Developing unified testing methodologies for GPU computing across NVIDIA (H100, GH200) and AMD (MI300A) architectures. Ensures consistent performance and reliability for HPC applications across diverse hardware platforms.",
    status: "Active Development",
    technologies: ["CUDA", "HIP", "ROCm", "GPU Computing", "Performance Analysis", "Cross-Platform Testing"],
    links: [],
    category: "GPU Computing"
  }
];

export const researchAreas = [
  {
    id: "gpu-computing",
    title: "GPU Computing & Compiler Validation",
    description: "Developing comprehensive validation and verification frameworks for OpenACC and OpenMP GPU offloading. My work ensures reliable performance across cutting-edge architectures including NVIDIA H100, GH200, and AMD MI300A systems.",
    technologies: ["OpenACC", "OpenMP", "CUDA", "HIP", "LLVM", "Clang"],
    color: "blue"
  },
  {
    id: "hpc-systems",
    title: "Building CI/CD pipeline for LLVM-based compilers",
    description: "Advancing HPC software sustainability through automated CI/CD pipelines for LLVM-based compilers. Focus on performance optimization, cross-platform compatibility, and systematic benchmarking across diverse computing architectures.",
    technologies: ["LLVM", "GitLab CI/CD", "Docker", "Singularity", "SLURM"],
    color: "green"
  }
];

export const futureDirections = [
  {
    title: "Exascale Computing Validation",
    description: "Extending validation frameworks to support exascale computing systems and emerging architectures including quantum-classical hybrid systems.",
    color: "orange"
  },
  {
    title: "AI-Native Programming Models",
    description: "Exploring how AI can be integrated directly into programming models and runtime systems to optimize performance and reliability automatically.",
    color: "red"
  },
  {
    title: "Cross-Platform Portability",
    description: "Developing unified testing and validation approaches that work seamlessly across diverse hardware architectures and vendor ecosystems.",
    color: "indigo"
  }
];

export const researchImpact = {
  publications: [
    "SC (Supercomputing) Conference",
    "IWOMP (International Workshop on OpenMP)",
    "FSGC (Future of Scientific Computing)",
    "arXiv Preprints"
  ],
  collaborations: [
    "NVIDIA GPU Architecture Teams",
    "HPE HPC Software Division",
    "OpenACC User Group",
    "LLVM Community"
  ]
};
