'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Analytics() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUserProfile()
  })

  const checkUserProfile = async () => {
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : null

      if (!userId) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/profile', {
        headers: { 'user-id': userId }
      })
      const data = await response.json()
      
      if (data.exists && data.profile.skills && data.profile.skills.length > 0) {
        setHasProfile(true)
      } else {
        setHasProfile(false)
      }
    } catch (error) {
      console.error('Failed to check profile:', error)
      setHasProfile(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for demo purposes (only shown if profile exists)
  const analyticsData = {
    profileViews: {
      total: 47,
      thisMonth: 23,
      lastMonth: 24,
      trend: '+15%'
    },
    pmActions: {
      totalEmails: 8,
      totalTeamsMessages: 12,
      totalContacts: 15, // Unique PMs who contacted
      thisMonth: {
        emails: 5,
        teamsMessages: 7,
        contacts: 9
      }
    },
    recentActivity: [
      { date: '2024-01-28', type: 'email', pm: 'Sarah Johnson', project: 'Cloud Migration' },
      { date: '2024-01-25', type: 'teams', pm: 'Mike Chen', project: 'Mobile App Dev' },
      { date: '2024-01-22', type: 'email', pm: 'David Smith', project: 'AI Implementation' },
      { date: '2024-01-18', type: 'teams', pm: 'Lisa Wang', project: 'Data Analytics' },
      { date: '2024-01-15', type: 'email', pm: 'Tom Brown', project: 'Frontend Redesign' }
    ]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (hasProfile === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                No Analytics Data Available
              </h1>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Analytics are only available after you complete your profile. Create your profile first to start tracking your visibility and engagement with Project Managers.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/profile/create')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Profile
                </button>
                
                <div className="text-sm text-gray-500">
                  <p>Once you complete your profile, you&apos;ll be able to see:</p>
                  <ul className="inline-flex flex-wrap gap-x-6 gap-y-1 mt-2">
                    <li>• Profile views</li>
                    <li>• PM contacts</li>
                    <li>• Engagement trends</li>
                    <li>• Activity history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Profile Analytics
            </h1>
            <p className="text-gray-600">
              Track your profile visibility and PM engagement over the last month
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Profile Views */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile Views</h3>
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">{analyticsData.profileViews.thisMonth}</div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">{analyticsData.profileViews.trend}</span> from last month
                </div>
                <div className="text-xs text-gray-500">
                  Total all time: {analyticsData.profileViews.total} views
                </div>
              </div>
            </div>

            {/* PM Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">PM Contacts</h3>
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">{analyticsData.pmActions.thisMonth.contacts}</div>
                <div className="text-sm text-gray-600">
                  Unique PMs this month
                </div>
                <div className="text-xs text-gray-500">
                  Total contacts: {analyticsData.pmActions.totalContacts}
                </div>
              </div>
            </div>

            {/* Total Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Actions</h3>
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {analyticsData.pmActions.thisMonth.emails + analyticsData.pmActions.thisMonth.teamsMessages}
                </div>
                <div className="text-sm text-gray-600">
                  Emails + Teams messages
                </div>
                <div className="text-xs text-gray-500">
                  This month activity
                </div>
              </div>
            </div>
          </div>

          {/* Communication Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Breakdown (Last 30 Days)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Email Stats */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-blue-900">Email Contacts</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">{analyticsData.pmActions.thisMonth.emails}</span>
                </div>
                <p className="text-sm text-blue-700">
                  Project managers reached out via email
                </p>
              </div>

              {/* Teams Stats */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium text-green-900">Teams Messages</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">{analyticsData.pmActions.thisMonth.teamsMessages}</span>
                </div>
                <p className="text-sm text-green-700">
                  Direct messages via Microsoft Teams
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent PM Activity</h3>
            <div className="space-y-3">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'email' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'email' ? (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.pm}</p>
                      <p className="text-sm text-gray-600">Contacted about {activity.project}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.date}</p>
                    <p className="text-xs text-gray-400 capitalize">{activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Key Insights
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • Your profile has been viewed by <strong>{analyticsData.profileViews.thisMonth} project managers</strong> this month
              </p>
              <p>
                • <strong>{analyticsData.pmActions.thisMonth.contacts} unique PMs</strong> have reached out to you
              </p>
              <p>
                • Teams messages are <strong>40% more frequent</strong> than emails for initial contact
              </p>
              <p>
                • Your skills in <strong>React and AWS</strong> are most viewed by PMs
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
} 