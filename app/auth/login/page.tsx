'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import profilesData from '../../../data/profiles.json'

export default function AuthLogin() {
  const [isLoading, setIsLoading] = useState(false)
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

  // Get random user from all users
  const getRandomUser = () => {
    const allUsers = [...profilesData.associates, ...profilesData.projectManagers]
    const randomIndex = Math.floor(Math.random() * allUsers.length)
    return allUsers[randomIndex]
  }

  const handleAuthentication = async () => {
    setIsLoading(true)

    try {
      // Simulate authentication delay first
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Get random user after delay
      const randomUser = getRandomUser()

      // Set basic auth token and user data in cookies
      document.cookie = 'auth-token=demo-token; path=/; max-age=86400; Secure; SameSite=Strict'
      document.cookie = `user-id=${randomUser.userId}; path=/; max-age=86400; Secure; SameSite=Strict`
      document.cookie = `user-name=${encodeURIComponent(randomUser.name)}; path=/; max-age=86400; Secure; SameSite=Strict`

      // Check if user is a manager by looking at the isManager property
      const isManager = randomUser.isManager === true

      if (isManager) {
        // Redirect to role selection screen for PMs
        router.push('/role-selection')
      } else {
        // Direct to associate dashboard for regular associates
        document.cookie = `user-role=associate; path=/; max-age=86400; Secure; SameSite=Strict`
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
          <div className="mb-6">
            <button
              onClick={handleAuthentication}
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

          {/* Security Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 font-medium mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Access
            </h3>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• Multi-factor authentication enabled</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• End-to-end encryption</li>
              <li>• Session management & monitoring</li>
            </ul>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs text-center">
              <strong>Demo Mode:</strong> This will simulate login with a random user account for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 