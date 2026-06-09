import { createContext, useContext, useState } from 'react'

/**
 * AuthContext — provides authentication state throughout the app.
 * TODO: Integrate real auth API (login, register, token refresh, logout).
 * TODO: Persist auth state with localStorage or HTTP-only cookies.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // TODO: Replace with real user data from backend auth API
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // TODO: Implement real login — POST /api/auth/login
  const login = async (credentials) => {
    // TODO: Integrate backend API
    console.warn('AuthProvider.login: backend not connected', credentials)
  }

  // TODO: Implement real logout — POST /api/auth/logout
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = { user, isAuthenticated, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
