import {
  Shield,
  ShieldCheck,
  Cpu,
  Server,
  Database,
  Terminal,
  Layers,
  Trophy,
  Mic,
  Users,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { Github, Linkedin } from './brandIcons'
import type {
  Achievement,
  Certification,
  ExperienceEntry,
  NavLink,
  Project,
  QuickFact,
  SkillCategory,
  SocialLink,
  Stat,
} from '../types'

export const personal = {
  name: 'Pugazhmani K',
  initials: 'PK',
  roles: [
    'Cybersecurity Analyst',
    'AI Engineer',
    'RAG & LLM Developer',
    'Security Tool Builder',
  ],
  location: 'Villupuram, Tamil Nadu, India',
  email: 'kpugazhmani21@gmail.com',
  phone: '+91-6374344424',
  tagline:
    'I build defensive security tooling and AI-driven systems — from IDS/IPS engines and PCAP forensics platforms to RAG pipelines powered by local LLMs.',
  summary:
    "Final-year Computer Science (Cybersecurity) student and AI engineering leader with hands-on experience across security monitoring, network forensics, IDS/IPS development, and LLM/RAG-based automation. Comfortable owning a problem end-to-end — from threat research and detection engineering to shipping production-ready backends and interfaces with Python, Go, FastAPI, and React. Currently leading CyberWolf's AI Department, translating research into deployable, security-aware software.",
  resumeUrl: '/Pugazhmani_Cybersecurity_Resume.pdf',
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export const pageLinks: NavLink[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Learning', href: '/learning' },
]

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/pugazh342', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pugazhmanik/', icon: Linkedin },
  { label: 'Email', href: 'mailto:kpugazhmani21@gmail.com', icon: Mail },
]

export const heroStats: Stat[] = [
  { value: '10+', label: 'Hackathon Podiums' },
  { value: '50+', label: 'Tech Talks Given' },
  { value: '8+', label: 'Security & AI Builds' },
  { value: '8.0', label: 'CGPA / 10' },
]

export const quickFacts: QuickFact[] = [
  { icon: MapPin, label: 'Location', value: 'Villupuram, Tamil Nadu' },
  { icon: Shield, label: 'Focus', value: 'Cybersecurity + AI Engineering' },
  { icon: Server, label: 'Role', value: 'CTO, AI Department — CyberWolf' },
  { icon: Phone, label: 'Reach', value: '+91-6374344424' },
]

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming',
    icon: Terminal,
    skills: ['Python', 'Go', 'C++', 'C', 'SQL', 'Node.js'],
  },
  {
    title: 'AI & Machine Learning',
    icon: Cpu,
    skills: [
      'PyTorch',
      'Llama 3',
      'RAG Pipelines',
      'NLP',
      'XGBoost',
      'Vector Databases',
      'ChromaDB',
      'Prompt Engineering',
      'Semantic Search',
    ],
  },
  {
    title: 'Backend & APIs',
    icon: Server,
    skills: [
      'FastAPI',
      'REST APIs',
      'Async Backend Dev',
      'API Integration',
      'JWT Auth',
    ],
  },
  {
    title: 'Cybersecurity',
    icon: ShieldCheck,
    skills: [
      'SIEM Fundamentals',
      'Incident Triage',
      'Network Traffic Analysis',
      'PCAP / DPI',
      'IDS/IPS',
      'Vulnerability Assessment',
      'Network Forensics',
      'WAF',
    ],
  },
  {
    title: 'Security Tools',
    icon: Shield,
    skills: ['Wireshark', 'Splunk', 'Burp Suite', 'Nmap', 'Git'],
  },
  {
    title: 'DevOps, Data & Frontend',
    icon: Database,
    skills: [
      'Docker',
      'Docker Compose',
      'PostgreSQL',
      'SQLite',
      'React.js',
      'Vite',
      'Tailwind CSS',
      'Streamlit',
    ],
  },
]

export const experience: ExperienceEntry[] = [
  {
    company: 'CyberWolf',
    summary:
      'Security & AI engineering collective focused on defensive tooling, threat research, and applied AI systems.',
    roles: [
      { title: 'CTO — AI Department', period: '2024 – 2026' },
      { title: 'Cybersecurity Analyst & Developer', period: 'Present' },
    ],
    bullets: [
      'Led AI engineering initiatives around LLM applications, Retrieval-Augmented Generation (RAG), automation, and intelligent security systems.',
      'Architected and shipped practical AI systems using Python, FastAPI, local LLMs, vector databases, REST APIs, and containerized infrastructure.',
      'Built real-time monitoring, network traffic analysis, and threat-detection tooling in Python and Go, supporting incident triage workflows.',
      'Researched defensive mitigation strategies aligned with OWASP Top 10 and delivered technical sessions on DNS analysis, email security, and reconnaissance.',
      'Directed technical execution across AI and cybersecurity projects — translating requirements into deployable software and reusable components.',
      'Organized and coordinated cybersecurity conferences, technical workshops, and national-level hackathons.',
    ],
  },
]

export const projects: Project[] = [
  {
    title: 'CyberWolf VulnStream',
    category: 'AI & ML',
    tech: ['Python', 'FastAPI', 'RAG', 'ChromaDB', 'LLMs'],
    description:
      'A cybersecurity-focused RAG platform that centralizes threat intelligence from multiple trusted sources into one retrieval-ready knowledge system.',
    highlights: [
      'Designed ingestion & normalization pipelines for heterogeneous threat intel feeds',
      'Vector-based semantic retrieval over CVE, CWE, CAPEC & MITRE ATT&CK data',
    ],
    github: 'https://github.com/pugazh342/CyberWolf-VulnStream',
    featured: true,
  },
  {
    title: 'WolfGuard 360',
    category: 'Full-Stack',
    tech: ['Golang', 'Python', 'FastAPI', 'React', 'Docker', 'PostgreSQL'],
    description:
      'A containerized Security-as-a-Service platform with a reverse-proxy Web Application Firewall for intercepting malicious HTTP traffic.',
    highlights: [
      'Async threat-telemetry pipeline routing events to a live monitoring dashboard',
      'Multi-tenant JWT auth with API key revocation for tenant isolation',
    ],
    github: 'https://github.com/pugazh342/WolfGuard-360',
    featured: true,
  },
  {
    title: 'WolfX V1.0 — RASIP',
    category: 'Cybersecurity',
    tech: ['Go', 'Python'],
    description:
      'Real-Time Application Security Intelligence Platform with event aggregation and a SOC-inspired operational interface.',
    highlights: [
      'Real-time alert visualization & suspicious-activity monitoring',
      'Built for high-throughput event aggregation across services',
    ],
    github: 'https://github.com/pugazh342/WolfX',
  },
  {
    title: 'Cyprolib & Wolf-Runtime',
    category: 'Cybersecurity',
    tech: ['Python', 'React', 'Node.js'],
    description:
      'A custom IDS/IPS ecosystem — Cyprolib for network scanning & defensive analysis, Wolf-Runtime for executing security rules and rendering live alerts.',
    highlights: [
      'Modular Python package for scanning & active-defense operations',
      'Runtime engine for real-time rule execution and alert rendering',
    ],
    github: 'https://github.com/pugazh342/Cyprolib',
  },
  {
    title: 'NetX Sentry',
    category: 'Cybersecurity',
    tech: ['Python', 'Streamlit', 'Wireshark'],
    description:
      'A network forensic and traffic analysis platform for PCAP investigation, with stream visualization and protocol-level inspection.',
    highlights: [
      'Built for anomaly detection & forensic incident analysis',
      'Protocol-level packet inspection with visual traffic breakdowns',
    ],
    github: 'https://github.com/pugazh342/NetX-Sentry',
  },
  {
    title: 'X-MalForensics-XGBoost',
    category: 'AI & ML',
    tech: ['Python', 'XGBoost', 'EMBER 2018'],
    description:
      'An XGBoost model trained on the EMBER 2018 dataset to classify malicious Windows PE files using static binary features.',
    highlights: [
      'Automated malware detection from static PE feature extraction',
      'Benchmarked against EMBER 2018 for classification accuracy',
    ],
    github: 'https://github.com/pugazh342/X-MalForensics',
  },
  {
    title: 'CuraCore',
    category: 'Full-Stack',
    tech: ['Python', 'FastAPI', 'React', 'Local LLMs', 'SQLite'],
    description:
      'An offline, AI-enabled hospital management system using locally hosted LLMs to keep sensitive patient data on local infrastructure.',
    highlights: [
      'Open-weight models for clinical summarization & structured extraction',
      'Responsive React frontend on an async FastAPI backend',
    ],
    github: 'https://github.com/pugazh342/CuraCore',
  },
  {
    title: 'Healthy Buddy+',
    category: 'AI & ML',
    tech: ['Python', 'Streamlit', 'Llama 3', 'RAG'],
    description:
      'A RAG application powered by Llama 3 delivering context-aware, citation-backed answers from proprietary PDF documents.',
    highlights: [
      'Document ingestion, chunking, embedding & similarity search',
      'Citation-backed responses for traceable, grounded answers',
    ],
    github: 'https://github.com/pugazh342/Healthy-Buddy',
  },
]

export const achievements: Achievement[] = [
  {
    icon: Trophy,
    title: '10+ National Hackathon Podiums',
    description:
      'Top finishes at Hack India, IFET Hackathon, and Taksha Sheela University Hackathon.',
  },
  {
    icon: Mic,
    title: '50+ Conferences & Tech Talks',
    description:
      'Presented and participated across national-level technical conferences and engineering events.',
  },
  {
    icon: Layers,
    title: 'Project Lead — AgroMed',
    description:
      'IFET Hack Warriors (Jan 2026) — led solution planning and architecture for an agriculture & healthcare analytics platform.',
  },
  {
    icon: Users,
    title: 'Core Member — Aaniveru Akkuveru',
    description:
      'CyberWolf initiative (Oct 2025) — contributed to system architecture for a digital learning platform.',
  },
]

export const certifications: Certification[] = [
  { name: 'Splunk Fundamentals 1', issuer: 'Splunk Education', status: 'In Progress' },
  { name: 'Certified Online Fraud Prevention Specialist (COFPS)', issuer: 'Hack&Fix Academy' },
  {
    name: 'Cybersecurity Workshop Operations Certificate',
    issuer: 'Center for Innovation and Software Learning',
  },
]

export const education = {
  institution: 'SKP Engineering College',
  affiliation: 'Affiliated to Anna University',
  degree: 'B.E. Computer Science and Engineering (Cybersecurity)',
  cgpa: '8.0',
  cgpaScale: 10,
  expected: 'Expected 2027',
}

export interface SkillLevel {
  name: string
  level: number // 0–100, self-assessed proficiency
}

export const skillLevels: Record<string, SkillLevel[]> = {
  Programming: [
    { name: 'Python', level: 92 },
    { name: 'Go', level: 78 },
    { name: 'C++ / C', level: 70 },
    { name: 'SQL', level: 75 },
  ],
  'AI & Machine Learning': [
    { name: 'RAG & LLM Integration', level: 90 },
    { name: 'PyTorch / XGBoost', level: 75 },
    { name: 'Vector DBs (ChromaDB)', level: 85 },
    { name: 'Prompt Engineering', level: 88 },
  ],
  'Backend & APIs': [
    { name: 'FastAPI', level: 90 },
    { name: 'REST API Design', level: 88 },
    { name: 'Async Backend Dev', level: 82 },
  ],
  Cybersecurity: [
    { name: 'Network Traffic / PCAP Analysis', level: 88 },
    { name: 'IDS / IPS Development', level: 85 },
    { name: 'SIEM & Incident Triage', level: 78 },
    { name: 'Vulnerability Assessment', level: 80 },
  ],
}
export const learningCategories = [
  'All',
  'Cybersecurity',
  'AI & ML',
  'Programming',
  'Tools & DevOps',
] as const