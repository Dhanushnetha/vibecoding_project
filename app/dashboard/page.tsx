'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  currentProject?: string
  skills: string[]
  desiredTech: string[]
  preferredLocation: string
  workMode: string
  availability: string
  openToOpportunities: boolean
  updatedAt: string
}

export default function Dashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : null

      if (!userId) {
        console.error('No user ID found in cookies')
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/profile', {
        headers: { 'user-id': userId }
      })
      const data = await response.json()
      
      if (data.exists) {
        setProfile(data.profile)
        // Check if profile is incomplete (no skills)
        if (!data.profile.skills || data.profile.skills.length === 0) {
          router.push('/profile/create')
          return
        }
      } else {
        // No profile exists, redirect to create
        router.push('/profile/create')
        return
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailability = async () => {
    if (!profile) return
    
    setIsUpdating(true)
    
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : 'demo-user'

      const updatedProfile = {
        ...profile,
        openToOpportunities: !profile.openToOpportunities,
        updatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(updatedProfile)
      })

      const data = await response.json()

      if (data.success) {
        setProfile(updatedProfile)
      } else {
        console.error('Failed to update availability:', data.error)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    } finally {
      setIsUpdating(false)
    }
  }  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Welcome & Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to your Dashboard
                </h2>
                <p className="text-gray-600">
                  Manage your profile and discover internal opportunities
                </p>
              </div>
              
              {/* Availability Toggle */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className='mr-4'>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Open to Opportunities
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {profile?.openToOpportunities ? 'Visible to PMs' : 'Hidden from PMs'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile?.openToOpportunities || false}
                      onChange={toggleAvailability}
                      disabled={isUpdating}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          {profile && (
            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Your Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!profile.skills || profile.skills.length === 0) && (
                    <span className="text-gray-500 text-sm italic">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Location & Work Mode */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Work Preferences
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Preferred Location:</span> {profile.preferredLocation}</p>
                  <p><span className="font-medium">Work Mode:</span> {profile.workMode}</p>
                  <p><span className="font-medium">Availability:</span> {profile.availability}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => router.push('/projects')}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-medium">Browse Projects</span>
              </button>
              
              <button
                onClick={() => router.push('/analytics')}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              
              <button
                onClick={() => router.push('/profile/create')}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {profile && (
            <div className={`rounded-lg p-4 ${profile.openToOpportunities ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center">
                <svg className={`w-5 h-5 mr-2 ${profile.openToOpportunities ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={profile.openToOpportunities ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"} />
                </svg>
                <p className={`text-sm font-medium ${profile.openToOpportunities ? 'text-green-800' : 'text-yellow-800'}`}>
                  {profile.openToOpportunities 
                    ? 'Your profile is visible to Project Managers. They can contact you for opportunities!' 
                    : 'Your profile is currently hidden. Toggle availability to be discoverable by PMs.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 