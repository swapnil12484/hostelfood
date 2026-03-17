import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import WeeklyMenu from './components/WeeklyMenu'
import Complaints from './components/Complaints'
import MyFeedback from './components/MyFeedback'
import Profile from './components/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/menu" element={<WeeklyMenu />} />
        <Route path="/feedback" element={<MyFeedback />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/profile" element={<Profile />} />
        {/* Redirect root to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
