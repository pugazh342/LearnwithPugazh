import { motion } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'
import { achievements, certifications, education } from '../data/portfolioData'
import SectionHeading from './SectionHeading'
import './Achievements.css'

export default function Achievements() {
  return (
    <section id="achievements" className="section section-alt achievements">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Recognition"
          title="Achievements & Education"
          description="Competition results, speaking engagements, leadership roles, and academic background."
        />

        <div className="achievements-grid">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.title}
              className="achievement-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
            >
              <div className="achievement-icon"><item.icon size={20} /></div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="lower-grid">
          <motion.div className="edu-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
            <div className="edu-card-head"><GraduationCap size={20} /><span>Education</span></div>
            <h3 className="serif">{education.degree}</h3>
            <p className="edu-institution">{education.institution} · {education.affiliation}</p>
            <div className="cgpa-row">
              <div className="cgpa-track">
                <div className="cgpa-fill" style={{ width: `${(parseFloat(education.cgpa) / education.cgpaScale) * 100}%` }} />
              </div>
              <span className="cgpa-value">{education.cgpa} / {education.cgpaScale}</span>
            </div>
            <span className="edu-expected">{education.expected}</span>
          </motion.div>

          <motion.div className="cert-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="edu-card-head"><Award size={20} /><span>Certifications</span></div>
            <ul className="cert-list">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-issuer">{cert.issuer}{cert.status && <em className="cert-status"> · {cert.status}</em>}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}