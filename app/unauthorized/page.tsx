'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Unauthorized() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [attemptedRoute, setAttemptedRoute] = useState<string>('')

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('user-role='))
    if (roleCookie) {
      const role = roleCookie.split('=')[1]
      setUserRole(role)
    }

    const route = searchParams.get('route')
    if (route) {
      setAttemptedRoute(route)
    }
  }, [searchParams])

  const getHomeRoute = () => {
    if (userRole === 'pm') {
      return '/pm-dashboard'
    } else if (userRole === 'associate') {
      return '/dashboard'
    }
    return '/auth/login'
  }

  const getRequiredRole = () => {
    if (attemptedRoute.startsWith('/pm-dashboard')) {
      return 'Project Manager'
    }
    return 'Associate'
  }

  const getCurrentRoleDisplay = () => {
    if (userRole === 'pm') {
      return 'Project Manager'
    } else if (userRole === 'associate') {
      return 'Associate'
    }
    return 'Unknown'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl sm:text-9xl font-bold text-red-200 select-none">
              403
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Sorry, you don&apos;t have permission to access this area of InnerSwitch.
          </p>
          
          {/* Role Information */}
          <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-red-600 font-medium mb-1">Your Current Role</div>
                <div className="text-lg font-bold text-red-800">{getCurrentRoleDisplay()}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 font-medium mb-1">Required Role</div>
                <div className="text-lg font-bold text-gray-800">{getRequiredRole()}</div>
              </div>
            </div>
            
            {attemptedRoute && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Attempted Route:</strong> <code className="bg-white px-2 py-1 rounded text-sm">{attemptedRoute}</code>
                </div>
              </div>
            )}
          </div>
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
            <span>Go to My Dashboard</span>
          </button>
        </div>

        {/* Help Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Access?
          </h3>
          
          {userRole === 'associate' && attemptedRoute.startsWith('/pm-dashboard') ? (
            <div className="text-left space-y-3">
              <p className="text-gray-600">
                The area you&apos;re trying to access is restricted to <strong>Project Managers</strong> only.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">As an Associate, you can:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Browse and apply for project opportunities</li>
                  <li>• View your analytics and profile insights</li>
                  <li>• Update your skills and preferences</li>
                  <li>• Participate in shadow mode projects</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-left space-y-3">
              <p className="text-gray-600">
                If you believe you should have access to this area, please contact your manager or IT support.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Contact Information:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• IT Support: <a href="mailto:support@innerswitch.cognizant.com" className="text-blue-600 hover:text-blue-700">support@innerswitch.cognizant.com</a></li>
                  <li>• HR Portal: <a href="#" className="text-blue-600 hover:text-blue-700">cognizant.hr.portal.com</a></li>
                  <li>• Internal Help Desk: Ext. 2500</li>
                </ul>
              </div>
            </div>
          )}
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