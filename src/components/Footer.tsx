import { ArrowUp, BookOpen, GraduationCap } from 'lucide-react'
import { navLinks, personal, socialLinks } from '../data/portfolioData'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="brand serif">{personal.name.split(' ')[0]}<span className="accent-text">.</span></a>
            <p>Cybersecurity Analyst &amp; AI Engineer building secure, intelligent software.</p>
          </div>

          <ul className="footer-links" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>

          <div className="footer-page-links">
            <a href="/blog" className="btn btn-ghost btn-sm">
              <BookOpen size={15} /> Blog
            </a>
            <a href="/learning" className="btn btn-ghost btn-sm">
              <GraduationCap size={15} /> Learning
            </a>
          </div>

          <div className="footer-socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                aria-label={s.label}
              >
                <s.icon size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {personal.name}. All rights reserved.</p>
          <button className="back-to-top" onClick={scrollTop} aria-label="Back to top"><ArrowUp size={16} /></button>
        </div>
      </div>
    </footer>
  )
}
