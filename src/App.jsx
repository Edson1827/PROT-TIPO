import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import AgencyDashboard from './components/AgencyDashboard'
import ClientDashboard from './components/ClientDashboard'
import { ThemeProvider } from './components/ThemeProvider'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('access_token')
    if (token) {
      // Verify token with backend
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem('access_token')
        }
      })
      .catch(() => {
        localStorage.removeItem('access_token')
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('access_token', token)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate to={user.role === 'agency' ? '/agency' : '/dashboard'} replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/agency/*" 
              element={
                user && user.role === 'agency' ? (
                  <AgencyDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/dashboard/*" 
              element={
                user && user.role === 'client' ? (
                  <ClientDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  <Navigate to={user.role === 'agency' ? '/agency' : '/dashboard'} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
