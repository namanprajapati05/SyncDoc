import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Login from './pages/login'
import Home from './pages/Home'
import Signup from './pages/signup'
import Features from './pages/Features'
import Dashboard from './pages/Dashboard'

const ProtectedRoute = ({ children }) => {
  const hasAccessToken = Boolean(localStorage.getItem('syncdoc-access-token'))
  return hasAccessToken ? children : <Navigate to="/login" replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<><Navbar /><Home /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
