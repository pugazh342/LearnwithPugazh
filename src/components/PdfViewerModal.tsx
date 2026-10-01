import { useEffect, useRef, useState, useMemo } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import './PdfViewerModal.css'

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
}

interface PdfViewerModalProps {
  title: string
  src: string
  onClose: () => void
}

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',')
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'application/pdf'
  const bstr = atob(parts[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export default function PdfViewerModal({ title, src, onClose }: PdfViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const viewUrl = useMemo(() => {
    if (!src) return ''
    if (src.startsWith('data:')) {
      try {
        const blob = dataUrlToBlob(src)
        return URL.createObjectURL(blob)
      } catch {
        return src
      }
    }
    return src
  }, [src])

  useEffect(() => {
    return () => {
      if (viewUrl && viewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(viewUrl)
      }
    }
  }, [viewUrl])

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
    if (!containerRef.current || !viewUrl) return
    let cancelled = false
    setLoading(true)
    setError(false)

    async function render() {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: viewUrl })
        const pdf = await loadingTask.promise
        const container = containerRef.current
        if (!container || cancelled) return

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
          canvas.style.marginBottom = '12px'
          canvas.style.borderRadius = '4px'
          canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
          container.appendChild(canvas)
          await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise
        }
        if (!cancelled) setLoading(false)
      } catch (err) {
        console.warn('PDF.js rendering fallback triggered:', err)
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [viewUrl])

  const handleOpen = () => {
    if (viewUrl) {
      window.open(viewUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const downloadFilename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`

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
              <button className="icon-btn" onClick={handleOpen} aria-label="Open PDF" title="Open in new tab">
                <ExternalLink size={17} />
              </button>
              <a
                href={viewUrl}
                download={downloadFilename}
                className="icon-btn"
                aria-label="Download PDF"
                title="Download PDF"
              >
                <Download size={17} />
              </a>
              <button className="icon-btn" onClick={onClose} aria-label="Close" title="Close">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="pdf-modal-body">
            {loading && !error && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9a9187' }}>
                Rendering document…
              </div>
            )}
            {error ? (
              <div className="pdf-preview-placeholder">
                <p>Native rendering unavailable in inline canvas.</p>
                <div className="pdf-preview-buttons">
                  <button className="btn btn-primary" onClick={handleOpen}>
                    <ExternalLink size={16} /> Open PDF in New Tab
                  </button>
                  <a href={viewUrl} download={downloadFilename} className="btn btn-outline">
                    <Download size={16} /> Download PDF
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

