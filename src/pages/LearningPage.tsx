import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, Eye, ShieldCheck, Cpu, Terminal, Database } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { learningCategories } from '../data/portfolioData'
import type { LearningTopic } from '../types'
import { subscribeToLearningTopics } from '../services/learningService'
import SectionHeading from '../components/SectionHeading'
import PdfViewerModal from '../components/PdfViewerModal'
import '../components/Learning.css'

const categoryIcons: Record<string, LucideIcon> = {
  Cybersecurity: ShieldCheck,
  'AI & ML': Cpu,
  Programming: Terminal,
  'Tools & DevOps': Database,
}

export default function LearningPage() {
  const [topics, setTopics] = useState<LearningTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewing, setViewing] = useState<LearningTopic | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToLearningTopics((data) => {
      setTopics(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filtered = useMemo(
    () => (activeCategory === 'All' ? topics : topics.filter((t) => t.category === activeCategory)),
    [topics, activeCategory]
  )

  return (
    <div className="learning-page">
      <div className="page-topbar">
        <a href="/" className="page-back"><ArrowLeft size={16} /> Back to Portfolio</a>
      </div>
      <section className="section learning">
        <div className="container">
          <SectionHeading
            eyebrow="Continuous Growth"
            title="Learning Journey"
            description="Notes, research write-ups, and PDFs I've put together while going deep on a topic — from packet forensics to RAG pipelines."
          />

          <div className="filter-bar">
            {learningCategories.map((c) => (
              <button
                key={c}
                className={`filter-btn ${activeCategory === c ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading && <p className="learning-empty">Loading resources...</p>}

          {!loading && filtered.length === 0 && (
            <p className="learning-empty">No learning resources yet. Check back soon.</p>
          )}

          {!loading && filtered.length > 0 && (
            <motion.div layout className="learning-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((topic) => {
                  const Icon = categoryIcons[topic.category] ?? FileText
                  return (
                    <motion.div
                      layout
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="learning-card"
                    >
                      <div className="learning-card-top">
                        <div className="learning-icon">
                          <Icon size={19} />
                        </div>
                        <span className="learning-date">{topic.date}</span>
                      </div>

                      <h3>{topic.title}</h3>
                      <p className="learning-description">{topic.description}</p>

                      <div className="learning-tags">
                        {topic.tags.map((t) => (
                          <span key={t} className="chip chip-sm">{t}</span>
                        ))}
                      </div>

                      <div className="learning-actions">
                        {topic.pdfUrl && (
                          <button className="btn btn-ghost btn-sm" onClick={() => setViewing(topic)}>
                            <Eye size={15} /> View PDF
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {viewing && viewing.pdfUrl && (
        <PdfViewerModal title={viewing.title} src={viewing.pdfUrl} onClose={() => setViewing(null)} />
      )}
    </div>
  )
}
