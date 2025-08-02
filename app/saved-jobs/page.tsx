'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ApplicationAlert from '../components/ApplicationAlert'

interface AppliedJob {
  id: string
  title: string
  company: string
  location: string
  duration: string
  requiredSkills: string[]
  preferredSkills: string[]
  description: string
  urgency: string
  appliedAt: string
  status: string
}

interface Project {
  id: string
  title: string
  company: string
  location: string
  duration: string
  requiredSkills: string[]
  preferredSkills: string[]
  description: string
  responsibilities: string[]
  benefits: string[]
  projectType: string
  urgency: 'High' | 'Medium' | 'Low'
  teamSize: string
  budget: string
  startDate: string
  applicationDeadline: string
  savedAt: string
}

export default function SavedJobs() {
  const [savedProjects, setSavedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [applyingToProject, setApplyingToProject] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadSavedJobs()
  }, [])

  // Handle apply to project with loading state
  const handleApplyToProject = async (project: Project) => {
    setApplyingToProject(project.id)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Save applied job to localStorage and update profile
    try {
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : null

      if (userId) {
        // Save to applied jobs list
        const appliedJobsKey = `applied-jobs-${userId}`
        const existingAppliedJobs = localStorage.getItem(appliedJobsKey)
        const appliedJobsList = existingAppliedJobs ? JSON.parse(existingAppliedJobs) : []

        // Check if already applied
        const alreadyApplied = appliedJobsList.some((job: AppliedJob) => job.id === project.id)
        
        if (!alreadyApplied) {
          const appliedJob = {
            id: project.id,
            title: project.title,
            company: project.company,
            location: project.location,
            duration: project.duration,
            requiredSkills: project.requiredSkills,
            preferredSkills: project.preferredSkills,
            description: project.description,
            urgency: project.urgency,
            appliedAt: new Date().toISOString(),
            status: 'Submitted'
          }
          
          appliedJobsList.push(appliedJob)
          localStorage.setItem(appliedJobsKey, JSON.stringify(appliedJobsList))

          // Update user profile with applied job ID
          try {
            const response = await fetch('/api/profile', {
              headers: { 'user-id': userId }
            })
            const profileData = await response.json()
            
            if (profileData.exists) {
              const updatedProfile = {
                ...profileData.profile,
                appliedJobs: [...(profileData.profile.appliedJobs || []), project.id],
                updatedAt: new Date().toISOString()
              }

              await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'user-id': userId
                },
                body: JSON.stringify(updatedProfile)
              })
            }
          } catch (profileError) {
            console.error('Error updating profile with applied job:', profileError)
          }
        }
      }
    } catch (error) {
      console.error('Error saving applied job:', error)
    }
    
    // Show alert directly
    setSelectedProject(project)
    setShowAlert(true)
    setApplyingToProject(null)
  }

  const loadSavedJobs = () => {
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : null

      if (!userId) {
        console.error('No user ID found')
        setIsLoading(false)
        return
      }

      // Load saved jobs from localStorage
      const savedJobsKey = `saved-jobs-${userId}`
      const savedJobs = localStorage.getItem(savedJobsKey)
      
      if (savedJobs) {
        const parsedJobs = JSON.parse(savedJobs)
        setSavedProjects(parsedJobs)
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeSavedJob = (projectId: string) => {
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : null

      if (!userId) return

      // Update localStorage
      const savedJobsKey = `saved-jobs-${userId}`
      const updatedJobs = savedProjects.filter(project => project.id !== projectId)
      localStorage.setItem(savedJobsKey, JSON.stringify(updatedJobs))
      
      // Update state
      setSavedProjects(updatedJobs)
    } catch (error) {
      console.error('Error removing saved job:', error)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600">Your bookmarked project opportunities</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{savedProjects.length}</span> saved jobs
                </div>
              </div>
              <button
                onClick={() => router.push('/projects')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse More Jobs →
              </button>
            </div>
          </div>
        </div>

        {/* Saved Jobs List */}
        {savedProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring projects and save the ones that interest you
            </p>
            <button
              onClick={() => router.push('/projects')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Projects
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(project.urgency)}`}>
                          {project.urgency} Priority
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                          </svg>
                          <span>{project.company}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{project.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{project.duration}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSavedJob(project.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from saved jobs"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.preferredSkills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Saved on {new Date(project.savedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApplyToProject(project)}
                        disabled={applyingToProject === project.id}
                        className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                          applyingToProject === project.id ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {applyingToProject === project.id ? (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          router.push(`/projects?search=${encodeURIComponent(project.title)}`)
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Alert */}
        {selectedProject && (
          <ApplicationAlert
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            projectTitle={selectedProject.title}
            company={selectedProject.company}
          />
        )}
      </div>
      </div>
    )
  } 