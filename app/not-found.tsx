'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check user role from cookie to provide appropriate navigation
    const cookies = document.cookie.split(';')
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('user-role='))
    if (roleCookie) {
      const role = roleCookie.split('=')[1]
      setUserRole(role)
    }
  }, [])

  const getHomeRoute = () => {
    if (userRole === 'pm') {
      return '/pm-dashboard'
    } else if (userRole === 'associate') {
      return '/dashboard'
    }
    return '/auth/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Main 404 Text */}
            <div className="text-8xl sm:text-9xl font-bold text-gray-200 select-none">
              404
            </div>
            
            {/* InnerSwitch Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist in InnerSwitch.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Go Back</span>
          </button>

          <button
            onClick={() => router.push(getHomeRoute())}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              userRole === 'pm' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>
              {userRole === 'pm' ? 'PM Dashboard' : userRole === 'associate' ? 'Dashboard' : 'Home'}
            </span>
          </button>
        </div>        

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact{' '}
            <button 
              onClick={() => alert('Contact: support@innerswitch.cognizant.com')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              IT Support
            </button>
            {' '}or check our{' '}
            <button 
              onClick={() => router.push('/about')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              About page
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            InnerSwitch - Cognizant Internal Mobility Platform
          </p>
        </div>
      </div>
    </div>
  )
} 