'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import associatesData from '../../../data/associates.json'

interface Associate {
  userId: string
  name: string
  email: string
  skills: string[]
  [key: string]: unknown
}

export default function AuthLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('user-role='))
    
    if (authCookie) {
      // User is already authenticated, redirect based on role
      if (roleCookie) {
        const userRole = roleCookie.split('=')[1]
        if (userRole === 'pm') {
          router.push('/pm-dashboard')
          return
        } else if (userRole === 'associate') {
          router.push('/dashboard')
          return
        }
      }
      // If authenticated but no role, redirect to role selection
      router.push('/role-selection')
      return
    }
  }, [router])

  // Find user by email
  const findUserByEmail = (email: string) => {
    const allUsers = associatesData.associates
    return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase())
  }

  // Check if user has completed their associate profile
  const checkProfileCompletion = (userId: string) => {
    // Check if user exists in associates with skills
    const associate = associatesData.associates.find((a: Associate) => a.userId === userId)
    if (associate && associate.skills && associate.skills.length > 0) {      
      return true
    }    
    
    // Note: For now, we don't check userProfiles section during login
    // This will be checked and updated when they visit the dashboard
    return false
  }

  const handleAuthentication = async (overrideEmail?: string) => {
    const emailToUse = (overrideEmail ?? email).trim()
    if (!emailToUse) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate authentication delay first
      //await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Find user by email
      const user = findUserByEmail(emailToUse)
      
      if (!user) {
        setError('Email not found. Please check your email address.')
        setIsLoading(false)
        return
      }

      // Set basic auth token and user data in cookies
      document.cookie = 'auth-token=demo-token; path=/; max-age=86400; Secure; SameSite=Strict'
      document.cookie = `user-id=${user.userId}; path=/; max-age=86400; Secure; SameSite=Strict`
      document.cookie = `user-name=${encodeURIComponent(user.name)}; path=/; max-age=86400; Secure; SameSite=Strict`

      // Check if user is a manager by looking at the isManager property
      const isManager = user.isManager === true

      if (isManager) {
        // Redirect to role selection screen for PMs
        router.push('/role-selection')
      } else {
        // Direct to associate dashboard for regular associates
        const profileComplete = checkProfileCompletion(user.userId)
        document.cookie = `user-role=associate; path=/; max-age=86400; Secure; SameSite=Strict`
        document.cookie = `profile-complete=${profileComplete}; path=/; max-age=86400; Secure; SameSite=Strict`
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">InnerSwitch</h1>
            <p className="text-gray-600">Internal Mobility & Talent Discovery Platform</p>
          </div>


          {/* Authentication Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthentication()}
                placeholder="Enter your Cognizant email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={() => handleAuthentication()}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cognizant SSO Login</span>
                </div>
              )}
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs text-center">
              <strong>Demo Mode</strong>
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isLoading) return
                  setEmail('david.rodriguez@cognizant.com')
                  handleAuthentication('david.rodriguez@cognizant.com')
                }}
                disabled={isLoading}
                className="w-full text-xs py-2 px-3 rounded-md border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                Login as PM
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLoading) return
                  setEmail('vibe.coder@cognizant.com')
                  handleAuthentication('vibe.coder@cognizant.com')
                }}
                disabled={isLoading}
                className="w-full text-xs py-2 px-3 rounded-md border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
              >
                Login as Associate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 