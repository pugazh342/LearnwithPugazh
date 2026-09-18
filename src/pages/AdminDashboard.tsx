import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Sparkles, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { seedStarterContent } from '../services/seedService'
import { clearAllData } from '../services/adminService'
import BlogForm from '../components/admin/BlogForm'
import BlogList from '../components/admin/BlogList'
import LearningForm from '../components/admin/LearningForm'
import LearningList from '../components/admin/LearningList'
import '../components/admin/admin.css'

type Tab = 'blog' | 'learning'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('blog')
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const handleSeed = async () => {
    if (!confirm('Import starter blog posts and learning resources? This only needs to be done once.')) return
    setSeeding(true)
    try {
      await seedStarterContent()
      alert('Starter content imported successfully!')
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('⚠️ This will DELETE all blog posts and learning resources from Firebase. Are you sure?')) return
    if (!confirm('Last chance — this cannot be undone. Proceed?')) return
    setClearing(true)
    try {
      const result = await clearAllData()
      alert(`Cleared: ${result.blogCount} blog posts, ${result.learningCount} learning resources.`)
    } catch (err) {
      alert(`Failed to clear: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <span className="admin-brand">Admin Panel</span>
        <div className="admin-user-info">
          <span className="admin-user-email">{user?.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        <div className="admin-actions-row">
          <button className="btn btn-outline btn-sm seed-btn" onClick={handleSeed} disabled={seeding}>
            <Sparkles size={15} /> {seeding ? 'Importing…' : 'Import Starter Content'}
          </button>
          <button className="btn btn-ghost btn-sm clear-btn" onClick={handleClear} disabled={clearing}>
            <Trash2 size={15} /> {clearing ? 'Clearing…' : 'Clear Database'}
          </button>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'blog' ? 'is-active' : ''}`} onClick={() => setTab('blog')}>
            Blog Posts
          </button>
          <button className={`admin-tab ${tab === 'learning' ? 'is-active' : ''}`} onClick={() => setTab('learning')}>
            Learning Resources
          </button>
        </div>

        {tab === 'blog' ? (
          <div className="admin-grid">
            <BlogForm />
            <BlogList />
          </div>
        ) : (
          <div className="admin-grid">
            <LearningForm />
            <LearningList />
          </div>
        )}
      </div>
    </div>
  )
}
