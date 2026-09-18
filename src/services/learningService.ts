import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { LearningTopic } from '../types'

const COLLECTION = 'learningTopics'

export function subscribeToLearningTopics(callback: (topics: LearningTopic[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const topics = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as LearningTopic)
    callback(topics)
  })
}

export async function addLearningTopic(data: Omit<LearningTopic, 'id' | 'createdAt'>) {
  try {
    await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
  } catch (error) {
    console.error('Failed to add learning topic:', error)
    throw error
  }
}

export async function deleteLearningTopic(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
  } catch (error) {
    console.error('Failed to delete learning topic:', error)
    throw error
  }
}
