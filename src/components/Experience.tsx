import { motion } from 'framer-motion'
import { experience } from '../data/portfolioData'
import SectionHeading from './SectionHeading'
import './Experience.css'

export default function Experience() {
  return (
    <section id="experience" className="section section-alt experience">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Career Path"
          title="Experience"
          description="Where I've applied security engineering and AI development to real problems."
        />

        <div className="resume-timeline">
          {experience.map((entry, idx) =>
            entry.roles.map((role, rIdx) => (
              <motion.div
                key={role.title}
                className="resume-row"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (idx + rIdx) * 0.08 }}
              >
                <div className="resume-period-col">
                  <span className="resume-period">{role.period}</span>
                  <span className="resume-node" />
                </div>
                <div className="resume-content-col">
                  <h3>{role.title}</h3>
                  <p className="resume-company">{entry.company} — <span>{entry.summary}</span></p>
                  {rIdx === 0 && (
                    <ul className="resume-bullets">
                      {entry.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}