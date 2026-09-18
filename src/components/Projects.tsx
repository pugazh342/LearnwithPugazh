import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { projects } from '../data/portfolioData'
import type { ProjectCategory } from '../types'
import SectionHeading from './SectionHeading'
import './Projects.css'

const filters: Array<ProjectCategory | 'All'> = ['All', 'Cybersecurity', 'AI & ML', 'Full-Stack']

const gradients: Record<ProjectCategory, string> = {
  Cybersecurity: 'linear-gradient(135deg,#ff6b4a,#ffb56b)',
  'AI & ML': 'linear-gradient(135deg,#2f6f63,#7fd8c4)',
  'Full-Stack': 'linear-gradient(135deg,#4a6bff,#8bb3ff)',
}

export default function Projects() {
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active]
  )

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Selected Work"
          title="Projects"
          description="Security platforms, AI systems, and full-stack products I've designed and built."
        />

        <div className="filter-bar">
          {filters.map((f) => (
            <button key={f} className={`filter-btn ${active === f ? 'is-active' : ''}`} onClick={() => setActive(f)}>
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="project-card"
              >
                <div className="project-thumb" style={{ background: gradients[project.category] }}>
                  <span className="project-thumb-tag">{project.category}</span>
                  <ArrowUpRight size={20} className="project-thumb-arrow" />
                </div>

                <div className="project-body">
                  <h3 className="serif">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <ul className="project-highlights">
                    {project.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>

                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t} className="chip chip-sm">{t}</span>
                    ))}
                  </div>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-github-link"
                    >
                      <Github size={16} />
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}