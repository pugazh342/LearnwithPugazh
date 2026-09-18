import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Portfolio from './pages/Portfolio'
import BlogPage from './pages/BlogPage'
import LearningPage from './pages/LearningPage'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  )
}
