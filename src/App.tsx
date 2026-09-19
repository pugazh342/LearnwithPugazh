import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Portfolio from './pages/Portfolio'

const BlogPage = lazy(() => import('./pages/BlogPage'))
const LearningPage = lazy(() => import('./pages/LearningPage'))
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: '#9a9187', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
