import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { accessToken, user } = useAuth()

  if (!accessToken) return <Navigate to="/login" replace />
  if (!user?.isAdmin) return <Navigate to="/" replace />

  return children
}
