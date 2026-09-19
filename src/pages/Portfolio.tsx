import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Achievements from '../components/Achievements'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'

export default function Portfolio() {
  useSEO({
    title: 'Pugazhmani K — Cybersecurity Analyst & AI Engineer',
    description:
      'Portfolio of Pugazhmani K — Cybersecurity Analyst & AI Engineer from Tamil Nadu, India. Building defensive security tooling and AI-driven systems including IDS/IPS engines, PCAP forensics platforms, and RAG pipelines powered by local LLMs.',
    keywords:
      'Pugazhmani K, cybersecurity analyst, AI engineer, IDS/IPS developer, network forensics, PCAP analysis, RAG pipeline, LLM integration, Python developer, Go developer, FastAPI, React, security monitoring, threat detection, portfolio, Tamil Nadu, India',
    url: 'https://learnwithpugazh.vercel.app',
  })

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
