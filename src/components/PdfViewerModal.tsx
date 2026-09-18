import { useEffect, useRef, useState } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import './PdfViewerModal.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface PdfViewerModalProps {
  title: string
  src: string
  onClose: () => void
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1]
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export default function PdfViewerModal({ title, src, onClose }: PdfViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false

    async function render() {
      try {
        const data = src.startsWith('data:') ? dataUrlToBytes(src) : new Uint8Array(await (await fetch(src)).arrayBuffer())
        const pdf = await pdfjsLib.getDocument({ data }).promise
        const container = containerRef.current!
        container.innerHTML = ''

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.style.marginBottom = '8px'
          canvas.style.borderRadius = '4px'
          container.appendChild(canvas)
          await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    render()
    return () => { cancelled = true }
  }, [src])

  const handleOpen = () => window.open(src, '_blank')

  return (
    <AnimatePresence>
      <motion.div
        className="pdf-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="pdf-modal"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pdf-modal-head">
            <h3>{title}</h3>
            <div className="pdf-modal-actions">
              <button className="icon-btn" onClick={handleOpen} aria-label="Open PDF">
                <ExternalLink size={17} />
              </button>
              <a href={src} download className="icon-btn" aria-label="Download PDF">
                <Download size={17} />
              </a>
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="pdf-modal-body">
            {error ? (
              <div className="pdf-preview-placeholder">
                <p>Unable to render PDF inline</p>
                <div className="pdf-preview-buttons">
                  <button className="btn btn-primary" onClick={handleOpen}>
                    <ExternalLink size={16} /> Open in Browser
                  </button>
                  <a href={src} download className="btn btn-outline">
                    <Download size={16} /> Download
                  </a>
                </div>
              </div>
            ) : (
              <div ref={containerRef} className="pdf-canvas-container" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
