import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export async function clearCollection(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName))
  const deletions = snapshot.docs.map((d) => deleteDoc(doc(db, collectionName, d.id)))
  await Promise.all(deletions)
  return snapshot.docs.length
}

export async function clearAllData() {
  const blogCount = await clearCollection('blogPosts')
  const learningCount = await clearCollection('learningTopics')
  return { blogCount, learningCount }
}
