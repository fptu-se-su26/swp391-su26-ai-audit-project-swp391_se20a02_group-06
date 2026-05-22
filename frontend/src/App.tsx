import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/public/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Pricing from './pages/public/Pricing'
import About from './pages/public/About'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Homepage / Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Marketing Pages */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        
        {/* Default Route Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
