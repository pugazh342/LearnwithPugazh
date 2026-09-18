import type { LearningTopic, BlogPost } from '../types'
import { addLearningTopic } from './learningService'
import { addBlogPost } from './blogService'

const seedLearningTopics: Omit<LearningTopic, 'id' | 'createdAt'>[] = [
  {
    title: 'SIEM Fundamentals & Log Correlation',
    category: 'Cybersecurity',
    description: 'Notes on building detection logic, correlation rules, and triage workflows while studying for Splunk Fundamentals 1.',
    date: 'Mar 2025',
    tags: ['SIEM', 'Splunk', 'Incident Triage'],
    pdfUrl: '',
  },
  {
    title: 'Deep Packet Inspection & PCAP Forensics',
    category: 'Cybersecurity',
    description: 'Research notes from building NetX Sentry — protocol dissection, stream reconstruction, and anomaly-hunting workflows in Wireshark.',
    date: 'Jan 2025',
    tags: ['Wireshark', 'Network Forensics', 'PCAP'],
    pdfUrl: '',
  },
  {
    title: 'Designing an IDS/IPS Detection Engine',
    category: 'Cybersecurity',
    description: 'Architecture notes on rule-execution engines, signature vs anomaly detection, and real-time alert pipelines from the Cyprolib/Wolf-Runtime build.',
    date: 'Nov 2024',
    tags: ['IDS/IPS', 'Detection Engineering'],
    pdfUrl: '',
  },
  {
    title: 'RAG Pipelines: Chunking, Embeddings & Retrieval',
    category: 'AI & ML',
    description: 'A breakdown of chunking strategies, embedding models, and vector retrieval trade-offs learned while building CyberWolf VulnStream and Healthy Buddy+.',
    date: 'Feb 2025',
    tags: ['RAG', 'ChromaDB', 'Embeddings'],
    pdfUrl: '',
  },
  {
    title: 'Deploying Local LLMs for Sensitive Workloads',
    category: 'AI & ML',
    description: 'Practical notes on running open-weight models offline for CuraCore — hardware constraints, quantization, and latency trade-offs.',
    date: 'Apr 2025',
    tags: ['Local LLM', 'Llama 3', 'Privacy'],
    pdfUrl: '',
  },
  {
    title: 'Static Malware Detection with XGBoost',
    category: 'AI & ML',
    description: 'Feature engineering and model tuning notes from training a PE-malware classifier on the EMBER 2018 dataset.',
    date: 'Sep 2024',
    tags: ['XGBoost', 'Malware Analysis'],
    pdfUrl: '',
  },
  {
    title: 'Go for High-Performance Security Tooling',
    category: 'Programming',
    description: 'Concurrency patterns, goroutines, and channel-based pipelines applied while building WolfGuard 360 and WolfX.',
    date: 'Dec 2024',
    tags: ['Go', 'Concurrency'],
    pdfUrl: '',
  },
  {
    title: 'Containerized, Multi-Tenant Architecture',
    category: 'Tools & DevOps',
    description: 'Notes on Docker Compose orchestration, tenant isolation, and JWT-based access control from the WolfGuard 360 build.',
    date: 'Jan 2025',
    tags: ['Docker', 'JWT', 'Multi-Tenancy'],
    pdfUrl: '',
  },
]

const seedBlogPosts: Omit<BlogPost, 'id' | 'createdAt'>[] = [
  {
    title: 'Building WolfX: Lessons from a SOC-Inspired Monitoring Platform',
    excerpt: 'What I learned engineering a real-time application security intelligence platform from scratch — event aggregation, alerting, and the UI decisions that matter under pressure.',
    content: [
      "When we started building WolfX, the goal was simple on paper: aggregate security events in real time and surface the ones that actually matter. In practice, that's one of the harder problems in defensive tooling.",
      "The hardest problem wasn't detection logic — it was signal-to-noise. Any monitoring platform can generate alerts; the value is in ranking them so an analyst's attention goes to the right five events out of five thousand.",
      'We ended up designing the interface around triage speed first, and completeness second — showing severity, blast radius, and a one-line "why this matters" summary before any raw payload data.',
      "Key takeaway: design for the analyst's attention span, not just data completeness. A SOC-inspired UI has to earn trust fast, or it gets ignored.",
    ],
    date: 'May 2025',
    readTime: '6 min read',
    tags: ['Cybersecurity', 'SOC', 'Go'],
    gradient: 'linear-gradient(135deg,#ff6b4a,#ffb56b)',
  },
  {
    title: 'Centralizing Threat Intelligence with RAG',
    excerpt: 'How CyberWolf VulnStream pulls CVE, CWE, CAPEC and MITRE ATT&CK data into one retrieval-ready knowledge base — and why grounding matters for security LLM apps.',
    content: [
      'Security teams drown in disconnected intelligence feeds — CVE databases, CWE taxonomies, CAPEC attack patterns, and MITRE ATT&CK mappings all live in different formats with different update cadences.',
      'We designed an ingestion pipeline that normalizes these heterogeneous sources into a consistent, retrieval-ready format, then indexed them with embeddings in ChromaDB for semantic search.',
      "Grounding LLM answers in retrieved, cited data was non-negotiable for a security context — an ungrounded hallucination in a threat-intel tool isn't just wrong, it's dangerous.",
      'The result: analysts can ask natural-language questions and get answers traceable back to the exact CVE or ATT&CK technique that informed them.',
    ],
    date: 'Mar 2025',
    readTime: '7 min read',
    tags: ['AI', 'RAG', 'Threat Intel'],
    gradient: 'linear-gradient(135deg,#2f6f63,#7fd8c4)',
  },
  {
    title: "What Winning My First National Hackathon Taught Me About Shipping Fast",
    excerpt: 'Speed, scoping, and storytelling — reflections after 10+ hackathon podiums and what actually moves the needle in 24 hours.',
    content: [
      "The first time we won, it wasn't because our code was the most polished — it was because we scoped ruthlessly and had something demoable within the first six hours.",
      "Judges remember stories, not stack traces. We learned to lead every demo with the problem, not the tech, and only go deep on architecture if asked.",
      'My rule now: build the thinnest possible slice that proves the core idea works, then decide what to cut before you decide what to add.',
    ],
    date: 'Oct 2024',
    readTime: '4 min read',
    tags: ['Hackathons', 'Career'],
    gradient: 'linear-gradient(135deg,#4a6bff,#8bb3ff)',
  },
  {
    title: "Why We Kept CuraCore's AI Fully Offline",
    excerpt: "Building an AI-enabled hospital system meant one non-negotiable constraint: no patient data ever leaves local infrastructure. Here's how local LLMs made that possible.",
    content: [
      "Healthcare data is some of the most sensitive data there is, so the moment cloud AI APIs came up in planning for CuraCore, it was an easy no.",
      'Running quantized, open-weight models locally meant real trade-offs in latency and raw capability compared to frontier cloud models — but the privacy guarantee was worth it.',
      'The result was a system clinicians could actually trust, because the data never left the building, and every summarization step was auditable end-to-end.',
    ],
    date: 'Jul 2025',
    readTime: '5 min read',
    tags: ['AI', 'Privacy', 'Healthcare'],
    gradient: 'linear-gradient(135deg,#ff8f6b,#ffd36b)',
  },
]

export async function seedStarterContent() {
  for (const topic of seedLearningTopics) {
    await addLearningTopic(topic)
  }
  for (const post of seedBlogPosts) {
    await addBlogPost(post)
  }
}
