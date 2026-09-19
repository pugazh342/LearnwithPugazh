import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowLeft, Calendar, Clock, X } from 'lucide-react'
import type { BlogPost } from '../types'
import { subscribeToBlogPosts } from '../services/blogService'
import SectionHeading from '../components/SectionHeading'
import { useSEO } from '../hooks/useSEO'
import '../components/Blog.css'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<BlogPost | null>(null)

  useSEO({
    title: 'Blog — Cybersecurity & AI Engineering Insights',
    description:
      'Technical blog by Pugazhmani K covering cybersecurity, AI/ML engineering, RAG pipelines, threat intelligence, hackathon experiences, and lessons from building security tools.',
    keywords:
      'cybersecurity blog, AI engineering blog, RAG pipeline, threat intelligence, LLM applications, hackathon experience, security tooling, SOC monitoring, Splunk, Python, Go, FastAPI, Pugazhmani K blog',
    url: 'https://learnwithpugazh.vercel.app/blog',
  })

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts((data) => {
      setPosts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <div className="blog-page">
      <div className="page-topbar">
        <a href="/" className="page-back"><ArrowLeft size={16} /> Back to Portfolio</a>
      </div>
      <section className="section blog">
        <div className="container">
          <SectionHeading
            eyebrow="Writing"
            title="From the Blog"
            description="Reflections on the tools I've built, problems I've debugged, and things I wish I knew earlier."
          />

          {loading && <p className="learning-empty">Loading posts...</p>}

          {!loading && posts.length === 0 && (
            <p className="learning-empty">No blog posts yet. Check back soon.</p>
          )}

          {!loading && posts.length > 0 && (
            <div className="blog-grid">
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  onClick={() => setActive(post)}
                >
                  <div className="blog-cover" style={{ background: post.gradient }}>
                    <ArrowUpRight size={20} className="blog-cover-arrow" />
                  </div>
                  <div className="blog-body">
                    <div className="blog-meta">
                      <span><Calendar size={13} /> {post.date}</span>
                      <span><Clock size={13} /> {post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-tags">
                      {post.tags.map((t) => (
                        <span key={t} className="chip chip-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="blog-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="blog-modal"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="blog-modal-cover" style={{ background: active.gradient }}>
                <button className="icon-btn light" onClick={() => setActive(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="blog-modal-body">
                <div className="blog-meta">
                  <span><Calendar size={13} /> {active.date}</span>
                  <span><Clock size={13} /> {active.readTime}</span>
                </div>
                <h2>{active.title}</h2>
                <div className="blog-tags">
                  {active.tags.map((t) => (
                    <span key={t} className="chip chip-sm">{t}</span>
                  ))}
                </div>
                <div className="blog-content">
                  {active.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
