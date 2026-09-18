import { useRef, useState } from 'react'
import { X, UploadCloud, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LearningTopic } from '../types'
import { learningCategories } from '../data/portfolioData'
import './UploadLearningModal.css'

interface UploadLearningModalProps {
  onClose: () => void
  onSave: (topic: LearningTopic) => void
}

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB — safe limit for localStorage

export default function UploadLearningModal({ onClose, onSave }: UploadLearningModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(learningCategories[1])
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selected: File | null) => {
    setError('')
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File is too large. Please keep uploads under 4MB.')
      return
    }
    setFile(selected)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please attach a PDF file.')
      return
    }
    if (!title.trim()) {
      setError('Please add a title.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const topic: LearningTopic = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        category,
        description: description.trim() || 'Personal notes and resources on this topic.',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        pdfUrl: reader.result as string,
        isCustom: true,
      }
      onSave(topic)
      onClose()
    }
    reader.readAsDataURL(file)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="upload-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="upload-modal"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="upload-modal-head">
            <h3 className="serif">Add a Learning Resource</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Threat Modeling Basics"
              />
            </div>

            <div className="form-row-split">
              <div className="form-row">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {learningCategories
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-row">
                <label>Tags (comma separated)</label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. OSINT, Recon"
                />
              </div>
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short note on what this covers..."
              />
            </div>

            <div className="form-row">
              <label>PDF File</label>
              <div
                className={`dropzone ${file ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFile(e.dataTransfer.files?.[0] ?? null)
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="dropzone-file">
                    <FileText size={18} /> {file.name}
                  </div>
                ) : (
                  <div className="dropzone-empty">
                    <UploadCloud size={22} />
                    <span>Click or drag a PDF here</span>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="upload-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block">
              Save Resource
            </button>
            <p className="upload-note">
              Stored locally in this browser — perfect for personal notes and demo purposes.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}