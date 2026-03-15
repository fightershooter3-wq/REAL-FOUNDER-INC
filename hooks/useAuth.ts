import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook for authentication management
 * Handles user session, login, logout, and protected route access
 * Uses localStorage for client-side session persistence
 */
export interface User {
  id: string
  email: string
  username: string
  name?: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initialize auth state from localStorage on component mount
   * This runs once when the hook is first called
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          // Parse and set user data
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (err) {
        // Handle JSON parsing errors gracefully
        console.error('Failed to parse stored user data:', err)
        localStorage.removeItem('user')
      } finally {
        // Mark loading as complete
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Login user with email and password
   * Stores user data in localStorage on successful login
   * @param email - User email address
   * @param password - User password
   * @returns Success status
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Call login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Set error message from API response
        setError(data.error || 'Login failed')
        return false
      }

      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      // Handle network or other errors
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Register new user
   * Stores user data in localStorage on successful registration
   * @param email - User email address
   * @param username - User username
   * @param password - User password
   * @param name - User full name (optional)
   * @returns Success status
   */
  const register = async (
    email: string,
    username: string,
    password: string,
    name?: string
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Call signup API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Set error message from API response
        setError(data.error || 'Registration failed')
        return false
      }

      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      // Handle network or other errors
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout user
   * Clears user data from localStorage and redirects to login
   */
  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user')
    setUser(null)
    // Redirect to login page
    router.push('/login')
  }

  /**
   * Check if user is authenticated
   * @returns True if user is logged in, false otherwise
   */
  const isAuthenticated = (): boolean => {
    return !!user
  }

  /**
   * Require authentication for a page
   * Redirects to login if user is not authenticated
   * Call this in useEffect of protected pages
   */
  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login')
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    requireAuth,
  }
}
