import { motion } from 'framer-motion'
import { skillCategories, skillLevels } from '../data/portfolioData'
import SectionHeading from './SectionHeading'
import './Skills.css'

export default function Skills() {
  const barCategories = skillCategories.filter((c) => skillLevels[c.title])
  const chipCategories = skillCategories.filter((c) => !skillLevels[c.title])

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Capabilities"
          title="Skills & Expertise"
          description="A blend of defensive security engineering and modern AI/backend development."
        />

        <div className="skills-bars-grid">
          {barCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              className="skill-bar-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="skill-bar-head">
                <div className="skill-icon"><cat.icon size={18} /></div>
                <h3>{cat.title}</h3>
              </div>

              {skillLevels[cat.title].map((skill) => (
                <div key={skill.name} className="skill-bar-row">
                  <div className="skill-bar-labels">
                    <span>{skill.name}</span>
                    <span className="skill-bar-pct">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="skills-chip-row">
          {chipCategories.map((cat) => (
            <div key={cat.title} className="chip-category">
              <div className="chip-category-head">
                <cat.icon size={16} /> <span>{cat.title}</span>
              </div>
              <div className="chip-list">
                {cat.skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}