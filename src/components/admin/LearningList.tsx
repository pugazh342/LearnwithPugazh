import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { LearningTopic } from '../../types'
import { subscribeToLearningTopics, deleteLearningTopic } from '../../services/learningService'

export default function LearningList() {
  const [topics, setTopics] = useState<LearningTopic[]>([])

  useEffect(() => subscribeToLearningTopics(setTopics), [])

  const handleDelete = async (topic: LearningTopic) => {
    if (!confirm(`Delete "${topic.title}"?`)) return
    await deleteLearningTopic(topic.id)
  }

  return (
    <div className="admin-panel">
      <h3>Published Resources ({topics.length})</h3>
      <div className="admin-list">
        {topics.map((t) => (
          <div key={t.id} className="admin-list-item">
            <div>
              <h4>{t.title}</h4>
              <p>{t.category} · {t.date}</p>
            </div>
            <button className="icon-btn danger" onClick={() => handleDelete(t)} aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {topics.length === 0 && <p className="admin-list-empty">No resources published yet.</p>}
      </div>
    </div>
  )
}
