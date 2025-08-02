'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ApplicationAlert from '../../components/ApplicationAlert'
import projectsData from '../../../data/projects.json'

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
  id: number;
  title: string;
  description: string;
  company: string;
  division: string;
  category: string;
  requiredSkills: string[];
  preferredSkills: string[];
  duration: string;
  location: string;
  commitment: string;
  urgency: string;
  createdBy: string;
  postedBy?: string;
  postedDate: string;
  applicationDeadline: string;
  applicationsOpen?: boolean;
  teamSize: string;
  budget: string;
  clientIndustry: string;
  projectType: string;
  workModel: string;
  travelRequired: string;
  securityClearance: boolean;
  description_detailed: string;
  responsibilities: string[];
  benefits?: string[];
  learningOpportunities: string[];
  applicationCount?: number;
  viewCount: number;
}

export default function ProjectDetails() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applyingToProject, setApplyingToProject] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const projectId = parseInt(params.id as string)
    const foundProject = projectsData.projects.find(p => p.id === projectId)
    if (foundProject) {
      setProject(foundProject as Project)
    }
    setIsLoading(false)
  }, [params.id])

  const handleApplyToProject = async () => {
    if (!project) return
    
    setApplyingToProject(true)
    
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
        const alreadyApplied = appliedJobsList.some((job: AppliedJob) => job.id === project.id.toString())
        
        if (!alreadyApplied) {
          const appliedJob = {
            id: project.id.toString(),
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
                appliedJobs: [...(profileData.profile.appliedJobs || []), project.id.toString()],
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
    
    // Show alert
    setShowAlert(true)
    setApplyingToProject(false)
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <button
            onClick={() => router.push('/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Projects</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(project.urgency)}`}>
                      {project.urgency} Priority
                    </span>
                    {project.applicationsOpen === false && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        🚫 Applications Closed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                      </svg>
                      <span>{project.company}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                      </svg>
                      <span>{project.division}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{project.category}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{project.teamSize}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>{project.commitment}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <p className="text-gray-600">{project.description_detailed}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills & Technologies</h2>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Preferred Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.preferredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {(project.responsibilities || [
                  "Collaborate with cross-functional teams to deliver project objectives",
                  "Design and implement technical solutions according to project requirements", 
                  "Participate in code reviews and maintain high coding standards",
                  "Document technical specifications and project progress",
                  "Mentor junior team members and share knowledge",
                  "Ensure project deliverables meet quality standards and deadlines"
                ]).map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits & Learning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {(project.benefits || [
                    "Competitive compensation package",
                    "Flexible working hours and remote work options",
                    "Professional development opportunities",
                    "Health and wellness benefits",
                    "Performance-based bonuses",
                    "Access to latest technologies and tools"
                  ]).map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Opportunities</h2>
                <ul className="space-y-2">
                  {(project.learningOpportunities || [
                    "Exposure to cutting-edge technologies and methodologies",
                    "Cross-functional collaboration experience",
                    "Industry best practices and standards",
                    "Leadership and project management skills",
                    "Technical certification support",
                    "Conference and training attendance opportunities"
                  ]).map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-600 text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Now</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{project.applicationCount}</div>
                      <div className="text-xs text-gray-600">Applications</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{project.viewCount}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleApplyToProject}
                  disabled={applyingToProject || project.applicationsOpen === false}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed ${
                    project.applicationsOpen === false 
                      ? 'bg-gray-400 text-gray-600' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {project.applicationsOpen === false ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      <span>Applications Closed</span>
                    </div>
                  ) : applyingToProject ? (
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
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted by</span>
                  <span className="font-medium">{project.postedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted date</span>
                  <span className="font-medium">{new Date(project.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application deadline</span>
                  <span className="font-medium text-red-600">{new Date(project.applicationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">{project.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client industry</span>
                  <span className="font-medium">{project.clientIndustry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Work model</span>
                  <span className="font-medium">{project.workModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel required</span>
                  <span className="font-medium">{project.travelRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security clearance</span>
                  <span className="font-medium">{project.securityClearance ? 'Required' : 'Not required'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Alert */}
        {project && (
          <ApplicationAlert
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            projectTitle={project.title}
            company={project.company}
          />
        )}
      </div>
    </div>
  )
} 