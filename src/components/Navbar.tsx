import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, pageLinks, personal } from '../data/portfolioData'
import { useScrolled } from '../hooks/useScrolled'
import { useActiveSection } from '../hooks/useActiveSection'
import './Navbar.css'

export default function Navbar() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const active = useActiveSection(navLinks.map((l) => l.href.replace('#', '')))
  const close = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar-inner container" aria-label="Main navigation">
        <a href="#home" className="brand serif" onClick={close}>
          {personal.name.split(' ')[0]}<span className="accent-text">.</span>
        </a>

        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={close}
                className={active === link.href.replace('#', '') ? 'is-active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
          {pageLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>{link.label}</a>
            </li>
          ))}
          <li className="nav-cta-mobile">
            <a href="#contact" className="btn btn-primary btn-sm" onClick={close}>
              Let's Talk
            </a>
          </li>
        </ul>

        <div className="navbar-actions">
          <a href="#contact" className="btn btn-primary btn-sm">Let's Talk</a>
          <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
