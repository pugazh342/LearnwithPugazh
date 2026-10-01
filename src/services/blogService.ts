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
import type { BlogPost } from '../types'
import { getDefaultBlogPosts } from './seedService'

const COLLECTION = 'blogPosts'

export function subscribeToBlogPosts(callback: (posts: BlogPost[]) => void) {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(getDefaultBlogPosts())
        } else {
          const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
          callback(posts)
        }
      },
      (error) => {
        console.warn('Firestore blogPosts error, falling back to starter posts:', error.message)
        callback(getDefaultBlogPosts())
      }
    )
  } catch (err) {
    console.warn('Failed to subscribe to blogPosts:', err)
    callback(getDefaultBlogPosts())
    return () => {}
  }
}

export async function addBlogPost(data: Omit<BlogPost, 'id' | 'createdAt'>) {
  try {
    await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
  } catch (error) {
    console.error('Failed to add blog post:', error)
    throw error
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    throw error
  }
}

