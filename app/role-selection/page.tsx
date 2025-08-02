'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import associatesData from '../../data/associates.json'

interface Associate {
  userId: string
  name: string
  email: string
  skills: string[]
  [key: string]: unknown
}

export default function RoleSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState('associate') // 'associate' or 'pm'
  const [userName, setUserName] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user has completed their associate profile
  const checkProfileCompletion = (userId: string) => {
    // Check if user exists in associates with skills
    const associate = associatesData.associates.find((a: Associate) => a.userId === userId)
    if (associate && associate.skills && associate.skills.length > 0) {
      return true
    }
    return false
  }

  useEffect(() => {
    // Get user info from cookies (should be set by auth/login)
    const cookies = document.cookie.split(';')
    const nameCookie = cookies.find(cookie => cookie.trim().startsWith('user-name='))
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('user-role='))
    
    if (nameCookie) {
      const name = decodeURIComponent(nameCookie.split('=')[1])
      setUserName(name)
    }

    // If no auth token, redirect to auth login
    if (!authCookie) {
      router.push('/auth/login')
      return
    }

    // If user already has a role selected, redirect to appropriate dashboard
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
  }, [router])

  const handleRoleSelection = async (selectedRole: 'associate' | 'pm') => {
    setIsLoading(true)
    setUserType(selectedRole)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Set the selected role in cookies
      document.cookie = `user-role=${selectedRole}; path=/; max-age=86400; Secure; SameSite=Strict`

      // If selecting associate role, check profile completion
      if (selectedRole === 'associate') {
        const cookies = document.cookie.split(';')
        const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
        const userId = userIdCookie ? userIdCookie.split('=')[1] : ''
        
        // For PMs acting as associates, check if they have a complete associate profile
        const profileComplete = checkProfileCompletion(userId)
        document.cookie = `profile-complete=${profileComplete}; path=/; max-age=86400; Secure; SameSite=Strict`
      }

      const redirectTo = searchParams.get('redirect')

      if (selectedRole === 'pm') {
        router.push(redirectTo && redirectTo.startsWith('/pm-dashboard') ? redirectTo : '/pm-dashboard')
      } else {
        // For associate role
        if (redirectTo && !redirectTo.startsWith('/pm-dashboard')) {
          router.push(redirectTo)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Role selection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-3 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome, {userName}!
            </h2>
            <p className="text-gray-600 mb-4">
              Login as:
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-2 mx-5">
            {/* Associate Option */}
            <button
              onClick={() => setUserType('associate')}
              disabled={isLoading}
              className={`w-full p-3 border-2 rounded-lg transition-all duration-200 flex items-center ${
                userType === 'associate'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center flex-1">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Associate
                  </h3>
                  <p className="text-xs text-gray-600 leading-tight">
                    Explore opportunities and grow your career
                  </p>
                </div>
              </div>
              <div className="ml-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Project Manager Option */}
            <button
              onClick={() => setUserType('pm')}
              disabled={isLoading}
              className={`w-full p-3 border-2 rounded-lg transition-all duration-200 flex items-center ${
                userType === 'pm'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center flex-1">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Project Manager
                  </h3>
                  <p className="text-xs text-gray-600 leading-tight">
                    Find talent and review applications
                  </p>
                </div>
              </div>
              <div className="ml-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Description */}
          <div className="mt-4 text-center mx-5">
            
            <button
              onClick={() => handleRoleSelection(userType as 'associate' | 'pm')}
              disabled={isLoading}
              className="w-full py-2.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sign in as {userType === 'associate' ? 'Associate' : 'Project Manager'}</span>
                </div>
              )}
            </button>
          </div>

          {/* Security Info */}
          <div className="mt-4 text-center mx-5">
            <p className="text-xs text-gray-600">
              <strong>Secure Access:</strong> Your personalized workspace for career growth and opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 