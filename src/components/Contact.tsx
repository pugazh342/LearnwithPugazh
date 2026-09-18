import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { personal } from '../data/portfolioData'
import SectionHeading from './SectionHeading'
import './Contact.css'

export default function Contact() {
  const contactButtons = [
    {
      icon: Mail,
      label: 'Email',
      value: personal.email,
      href: `mailto:${personal.email}`,
    },
    {
      icon: Phone,
      label: 'Call',
      value: personal.phone,
      href: `tel:${personal.phone}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personal.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(personal.location)}`,
    },
  ]

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's build something secure"
          description="Open to internships, freelance security/AI projects, and full-time opportunities."
        />

        <div className="contact-buttons">
          {contactButtons.map((c, idx) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.label === 'Location' ? '_blank' : undefined}
              rel={c.label === 'Location' ? 'noreferrer' : undefined}
              className="contact-btn"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="contact-btn-icon">
                <c.icon size={22} />
              </div>
              <span className="contact-btn-label">{c.label}</span>
              <span className="contact-btn-value">{c.value}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
