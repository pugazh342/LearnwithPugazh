import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

let appCheckInstance: AppCheck | null = null

if (typeof window !== 'undefined') {
  const appCheckToken = import.meta.env.VITE_FIREBASE_APP_CHECK_TOKEN

  // Enable debug token in development or on localhost
  if (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  if (appCheckToken) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(appCheckToken),
        isTokenAutoRefreshEnabled: true,
      })
    } catch (e) {
      console.warn('Firebase App Check initialization warning:', e)
    }
  }
}

export const appCheck = appCheckInstance