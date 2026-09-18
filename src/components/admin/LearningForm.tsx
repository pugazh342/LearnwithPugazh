import { useState } from 'react'
import { learningCategories } from '../../data/portfolioData'
import { uploadPdf } from '../../services/storageService'
import { addLearningTopic } from '../../services/learningService'

export default function LearningForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(learningCategories[1])
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTags('')
    setFile(null)
    setProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!file) {
      setError('Please choose a PDF file.')
      return
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.')
      return
    }

    try {
      setUploading(true)
      const { dataUrl } = await uploadPdf(file, setProgress)
      await addLearningTopic({
        title: title.trim(),
        category,
        description: description.trim() || 'Personal notes and resources on this topic.',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        pdfUrl: dataUrl,
      })
      setSuccess('Resource published successfully.')
      resetForm()
    } catch (err) {
      console.error('Learning upload error:', err)
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-panel">
      <h3>Upload Learning Resource</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Threat Modeling Basics" />
        </div>

        <div className="admin-row-split">
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {learningCategories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. OSINT, Recon" />
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short note on what this covers..." />
        </div>

        <div>
          <label>PDF File</label>
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>

        {uploading && (
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}

        <button className="btn btn-primary btn-block" disabled={uploading}>
          {uploading ? `Uploading… ${Math.round(progress)}%` : 'Publish Resource'}
        </button>
      </form>
    </div>
  )
}