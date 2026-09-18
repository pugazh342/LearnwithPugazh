import { Download, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { personal, heroStats, socialLinks } from '../data/portfolioData'
import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">
            <Sparkles size={14} /> Cybersecurity &amp; AI Engineer
          </span>

          <h1 className="hero-title serif">
            Hi, I'm <span className="accent-text">{personal.name}</span> —
            building defensive security &amp; intelligent AI systems.
          </h1>

          <p className="hero-tagline">{personal.tagline}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View My Work <ArrowRight size={17} />
            </a>
            <a href={personal.resumeUrl} className="btn btn-outline" download>
              <Download size={17} /> Download CV
            </a>
          </div>

          <div className="hero-socials">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-pill" aria-label={s.label}>
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="blob" />
          <div className="hero-photo">
            <img src="/profile.jpeg" alt={personal.name} className="hero-photo-img" />
          </div>

          <div className="floating-card card-top">
            <ShieldCheck size={18} />
            <div>
              <strong>10+</strong>
              <span>Hackathon Wins</span>
            </div>
          </div>

          <div className="floating-card card-bottom">
            <strong>CTO</strong>
            <span>AI Department — CyberWolf</span>
          </div>

          <div className="dot-pattern" />
        </div>
      </div>

      <div className="hero-stats-bar">
        <div className="container hero-stats-row">
          {heroStats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-value serif">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}