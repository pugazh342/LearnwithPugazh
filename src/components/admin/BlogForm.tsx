import { useState } from 'react'
import { addBlogPost } from '../../services/blogService'

const gradientPresets = [
  { label: 'Coral', value: 'linear-gradient(135deg,#ff6b4a,#ffb56b)' },
  { label: 'Green', value: 'linear-gradient(135deg,#2f6f63,#7fd8c4)' },
  { label: 'Blue', value: 'linear-gradient(135deg,#4a6bff,#8bb3ff)' },
  { label: 'Gold', value: 'linear-gradient(135deg,#ff8f6b,#ffd36b)' },
]

export default function BlogForm() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [contentText, setContentText] = useState('')
  const [readTime, setReadTime] = useState('5 min read')
  const [tags, setTags] = useState('')
  const [gradient, setGradient] = useState(gradientPresets[0].value)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !excerpt.trim() || !contentText.trim()) {
      setError('Please fill in title, excerpt, and content.')
      return
    }

    try {
      setSubmitting(true)
      const content = contentText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)

      await addBlogPost({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        readTime,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        gradient,
      })

      setSuccess('Blog post published.')
      setTitle('')
      setExcerpt('')
      setContentText('')
      setTags('')
    } catch (err) {
      console.error('Blog publish error:', err)
      setError(`Failed to publish: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-panel">
      <h3>Write a Blog Post</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Post title" />
        </div>

        <div>
          <label>Excerpt</label>
          <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required placeholder="One or two sentence summary shown on the card" />
        </div>

        <div>
          <label>Content (separate paragraphs with a blank line)</label>
          <textarea rows={8} value={contentText} onChange={(e) => setContentText(e.target.value)} required placeholder={'First paragraph...\n\nSecond paragraph...'} />
        </div>

        <div className="admin-row-split">
          <div>
            <label>Read Time</label>
            <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="5 min read" />
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, Security" />
          </div>
        </div>

        <div>
          <label>Cover Style</label>
          <div className="gradient-options">
            {gradientPresets.map((g) => (
              <button
                type="button"
                key={g.value}
                className={`gradient-swatch ${gradient === g.value ? 'is-selected' : ''}`}
                style={{ background: g.value }}
                onClick={() => setGradient(g.value)}
                aria-label={g.label}
              />
            ))}
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Publishing…' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}