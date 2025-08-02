'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import profilesData from '../../data/profiles.json'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState('associate') // 'associate' or 'pm'
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get random user based on role
  const getRandomUser = (role: 'associate' | 'pm') => {
    if (role === 'associate') {
      const associates = profilesData.associates
      const randomIndex = Math.floor(Math.random() * associates.length)
      return associates[randomIndex]
    } else {
      const pms = profilesData.projectManagers
      const randomIndex = Math.floor(Math.random() * pms.length)
      return pms[randomIndex]
    }
  }

  const handleLogin = async (loginType: 'associate' | 'pm') => {
    setIsLoading(true)

    try {
      // Get random user
      const randomUser = getRandomUser(loginType)
      setSelectedUser(randomUser)

      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Set auth token and user data in cookies
      document.cookie = 'auth-token=demo-token; path=/; max-age=86400; Secure; SameSite=Strict'
      document.cookie = `user-role=${loginType}; path=/; max-age=86400; Secure; SameSite=Strict`
      document.cookie = `user-id=${randomUser.userId}; path=/; max-age=86400; Secure; SameSite=Strict`
      document.cookie = `user-name=${encodeURIComponent(randomUser.name)}; path=/; max-age=86400; Secure; SameSite=Strict`

      const redirectTo = searchParams.get('redirect')

      if (loginType === 'pm') {
        router.push(redirectTo && redirectTo.startsWith('/pm-dashboard') ? redirectTo : '/pm-dashboard')
      } else {
        // For associates, check if they have a profile (they all do in our new system)
        if (redirectTo && !redirectTo.startsWith('/pm-dashboard')) {
          router.push(redirectTo)
        } else {
          // Check if associate has complete profile data
          const hasCompleteProfile = randomUser.skills && randomUser.skills.length > 0
          if (hasCompleteProfile) {
            router.push('/dashboard')
          } else {
            router.push('/profile/create')
          }
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InnerSwitch</h1>
          <p className="text-blue-100">Internal Mobility & Talent Discovery Platform</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          
          {/* Welcome Message */}
          {selectedUser && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-green-900">Welcome back, {selectedUser.name}</div>
                  <div className="text-sm text-green-700">
                    {selectedUser.role === 'associate' ? 
                      `${selectedUser.currentProject}` :
                      `${selectedUser.department}`
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType('associate')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === 'associate'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Associate</span>
                </div>
              </button>

              <button
                onClick={() => setUserType('pm')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === 'pm'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a2 2 0 011-1h4a2 2 0 011 1v12m-6 0h6" />
                  </svg>
                  <span className="font-medium">Project Manager</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-700 text-xs">
                {userType === 'associate'
                  ? 'Access your projects, skills, and internal opportunities'
                  : 'Manage your team, post projects, and find talent'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => handleLogin(userType)}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              userType === 'associate'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {userType === 'associate' ? 'Sign in as Associate' : 'Sign in as Project Manager'}
                </span>
              </div>
            )}
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Secure Access:</strong> {userType === 'associate'
                ? 'Your personalized workspace for career growth and opportunities'
                : 'Project management dashboard with team insights and talent discovery'
              }
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Platform Features:
            </h3>
            {userType === 'associate' ? (
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Browse internal project opportunities</li>
                <li>• Manage your skills and career goals</li>
                <li>• Track your profile visibility and engagement</li>
                <li>• Participate in shadow mode projects</li>
              </ul>
            ) : (
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Post and manage project opportunities</li>
                <li>• Discover and connect with available talent</li>
                <li>• Track project applications and team formation</li>
                <li>• Access comprehensive talent analytics</li>
              </ul>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">
            Cognizant Internal Mobility Platform
          </p>
        </div>
      </div>
    </div>
  )
} 