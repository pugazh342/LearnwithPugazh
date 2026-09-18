import type { LucideIcon } from 'lucide-react'

export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
  icon: LucideIcon
}

export interface Stat {
  label: string
  value: string
}

export interface QuickFact {
  icon: LucideIcon
  label: string
  value: string
}

export interface SkillCategory {
  title: string
  icon: LucideIcon
  skills: string[]
}

export interface ExperienceRole {
  title: string
  period: string
}

export interface ExperienceEntry {
  company: string
  summary: string
  roles: ExperienceRole[]
  bullets: string[]
}

export type ProjectCategory = 'Cybersecurity' | 'AI & ML' | 'Full-Stack'

export interface Project {
  title: string
  category: ProjectCategory
  tech: string[]
  description: string
  highlights: string[]
  github?: string
  featured?: boolean
}

export interface Achievement {
  icon: LucideIcon
  title: string
  description: string
}

export interface Certification {
  name: string
  issuer: string
  status?: string
}
export interface LearningTopic {
  id: string
  title: string
  category: string
  description: string
  date: string
  tags: string[]
  pdfUrl?: string
  isCustom?: boolean
  createdAt?: unknown
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string[]
  date: string
  readTime: string
  tags: string[]
  gradient: string
  createdAt?: unknown
}