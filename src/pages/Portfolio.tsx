import { lazy, Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { useSEO } from '../hooks/useSEO'

const About = lazy(() => import('../components/About'))
const Skills = lazy(() => import('../components/Skills'))
const Experience = lazy(() => import('../components/Experience'))
const Projects = lazy(() => import('../components/Projects'))
const Achievements = lazy(() => import('../components/Achievements'))
const Contact = lazy(() => import('../components/Contact'))
const Footer = lazy(() => import('../components/Footer'))

function SectionLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 1.5rem', color: '#9a9187', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      Loading...
    </div>
  )
}

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
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </main>
    </>
  )
}
