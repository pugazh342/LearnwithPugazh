import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { BlogPost } from '../../types'
import { subscribeToBlogPosts, deleteBlogPost } from '../../services/blogService'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => subscribeToBlogPosts(setPosts), [])

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return
    await deleteBlogPost(post.id)
  }

  return (
    <div className="admin-panel">
      <h3>Published Posts ({posts.length})</h3>
      <div className="admin-list">
        {posts.map((p) => (
          <div key={p.id} className="admin-list-item">
            <div>
              <h4>{p.title}</h4>
              <p>{p.date} · {p.readTime}</p>
            </div>
            <button className="icon-btn danger" onClick={() => handleDelete(p)} aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="admin-list-empty">No posts published yet.</p>}
      </div>
    </div>
  )
}