import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, GraduationCap, Compass } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import './NotFound.css'

export default function NotFound() {
  useSEO({
    title: '404 — Page Not Found',
    description: 'The requested page could not be found on Pugazhmani K portfolio.',
    url: 'https://learnwithpugazh.vercel.app/404',
  })

  return (
    <div className="notfound-page">
      <motion.div
        className="notfound-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="notfound-badge">
          <Compass size={15} /> Page Not Found
        </div>

        <div className="notfound-code">404</div>

        <h1>Lost in Cyberspace?</h1>
        <p>
          The page or resource you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/learning" className="btn btn-outline">
            <GraduationCap size={16} /> Learning Notes
          </Link>
          <Link to="/blog" className="btn btn-outline">
            <BookOpen size={16} /> Read Blog
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
