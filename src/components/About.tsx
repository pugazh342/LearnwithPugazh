import { motion } from 'framer-motion'
import { personal, quickFacts } from '../data/portfolioData'
import SectionHeading from './SectionHeading'
import './About.css'

export default function About() {
  return (
    <section id="about" className="section section-alt about">
      <div className="container about-grid">
        <motion.div
          className="about-image-col"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-photo-frame">
            <div className="about-photo">
              <img
              src="/about.webp"
              alt={personal.name}
              className="about-photo-img"
              width="300"
              height="340"
              loading="lazy"
              decoding="async"
              />
            </div>
            <div className="about-photo-badge">
              <strong>B.E. CSE</strong>
              <span>Cybersecurity, 2027</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="about-content-col"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SectionHeading index="01" eyebrow="About Me" title="Turning research into resilient, working systems" />
          <p className="about-summary">{personal.summary}</p>

          <div className="quick-facts">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="quick-fact">
                <div className="quick-fact-icon"><fact.icon size={17} /></div>
                <div>
                  <span className="quick-fact-label">{fact.label}</span>
                  <span className="quick-fact-value">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}