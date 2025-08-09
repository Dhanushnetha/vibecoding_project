'use client'

import { useState, useEffect } from 'react'

interface Application {
  id: string
  projectId: string
  projectTitle: string
  associateId: string
  associateName: string
  associateEmail: string
  associateSkills: string[]
  associateExperience: string
  appliedAt: string
  status: 'Pending' | 'Accepted' | 'Declined'
  coverLetter?: string
  matchScore: number
}

interface Project {
  id: string
  title: string
  company: string
  location: string
  duration: string
  requiredSkills: string[]
  urgency: string
  postedBy: string
}

interface Associate {
  userId: string
  name: string
  email: string
  skills: string[]
  [key: string]: unknown
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  useEffect(() => {
    loadApplicationsData()
  }, [])

  const loadApplicationsData = async () => {
    try {
      // Load projects for this PM
      const projectsResponse = await fetch('/api/projects')
      const projectsData = await projectsResponse.json()
      
      if (projectsResponse.ok) {
        setProjects(projectsData.projects || [])
      }

      // Load applications from API
      const applicationsResponse = await fetch('/api/applications')
      const applicationsData = await applicationsResponse.json()
      
      if (applicationsResponse.ok) {
        setApplications(applicationsData.applications || [])
      } else {
        // If no applications exist yet, generate some sample data
        const sampleApplications = await generateSampleApplications()
        setApplications(sampleApplications)
      }
    } catch (error) {
      console.error('Error loading applications data:', error)
      // Fallback to sample data
      const sampleApplications = await generateSampleApplications()
      setApplications(sampleApplications)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleApplications = async (): Promise<Application[]> => {
    // Generate sample applications for demo purposes
    const applications: Application[] = []
    
    // Get PM's projects
    const projectsResponse = await fetch('/api/projects')
    const projectsData = await projectsResponse.json()
    const pmProjects = projectsData.projects || []

    // Get associates
    const associatesResponse = await fetch('/api/associates')
    const associatesData = await associatesResponse.json()
    const allAssociates = associatesData.associates || []

    pmProjects.forEach((project: Project) => {
      // Generate applications for first 3 associates
      const sampleAssociates = allAssociates.slice(0, 3)
      
      sampleAssociates.forEach((associate: Associate, index: number) => {
        const matchScore = calculateMatchScore(project.requiredSkills, associate.skills)
        
        applications.push({
          id: `${project.id}-${associate.userId}`,
          projectId: project.id,
          projectTitle: project.title,
          associateId: associate.userId.toString(),
          associateName: associate.name,
          associateEmail: associate.email,
          associateSkills: associate.skills,
          associateExperience: 'N/A', // Placeholder, actual experience would need to be fetched
          appliedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
          status: index === 0 ? 'Pending' : index === 1 ? 'Accepted' : 'Declined',
          coverLetter: `I am excited to apply for the ${project.title} position. With my experience in ${associate.skills.slice(0, 3).join(', ')}, I believe I would be a great fit for this role.`,
          matchScore
        })
      })
    })

    return applications
  }

  const calculateMatchScore = (requiredSkills: string[], associateSkills: string[]): number => {
    const matchedSkills = requiredSkills.filter(skill => 
      associateSkills.some(associateSkill => 
        associateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(associateSkill.toLowerCase())
      )
    )
    return Math.round((matchedSkills.length / requiredSkills.length) * 100)
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: 'Accepted' | 'Declined') => {
    setProcessingAction(applicationId)
    
    try {
      // Update application status via API
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus
        })
      })
      
      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        ))
        
        // Update selected application if it's the same one
        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        console.error('Failed to update application status')
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const toggleApplicationDetails = (application: Application) => {
    if (selectedApplication?.id === application.id) {
      setSelectedApplication(null) // Close if same application
    } else {
      setSelectedApplication(application) // Open new application
    }
  }

  const filteredApplications = applications.filter(app => {
    const statusMatch = selectedFilter === 'all' || app.status.toLowerCase() === selectedFilter
    const projectMatch = selectedProject === 'all' || app.projectId === selectedProject
    return statusMatch && projectMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'Declined': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications & Interest</h1>
                <p className="text-gray-600">Review and manage applications from associates</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'Pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'Accepted').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Declined</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'Declined').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'declined')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Filter</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Applications ({filteredApplications.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedFilter === 'all' ? 'No applications have been submitted yet.' : `No ${selectedFilter} applications found.`}
                  </p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {application.associateName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {application.associateName}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              Applied for: {application.projectTitle}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                              <span className={`text-xs font-medium ${getMatchScoreColor(application.matchScore)}`}>
                                {application.matchScore}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleApplicationDetails(application)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedApplication?.id === application.id 
                              ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg' 
                              : 'text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 border border-blue-200 hover:border-transparent'
                          }`}
                        >
                          {selectedApplication?.id === application.id ? 'Hide Details' : 'View Details'}
                        </button>
                        {application.status === 'Pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'Accepted')}
                              disabled={processingAction === application.id}
                              className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-sm"
                            >
                              {processingAction === application.id ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'Declined')}
                              disabled={processingAction === application.id}
                              className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-sm"
                            >
                              {processingAction === application.id ? 'Processing...' : 'Decline'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Centered Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Transparent Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedApplication(null)}
          />
          
          {/* Centered Modal */}
          <div className={`relative w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 ease-out ${
            selectedApplication ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="h-full bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mr-3"></div>
                    Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Associate Information */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mr-3"></div>
                      Associate Information
                    </h4>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-lg font-bold text-white">
                            {selectedApplication.associateName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 text-lg">{selectedApplication.associateName}</h5>
                          <p className="text-gray-600">{selectedApplication.associateEmail}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3">
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Experience:</span>
                          <p className="text-gray-900 mt-1">{selectedApplication.associateExperience}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedApplication.associateSkills.map((skill, index) => (
                              <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200/50">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3"></div>
                      Project Information
                    </h4>
                    <div className="grid gap-3">
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Project:</span>
                        <p className="text-gray-900 mt-1 text-lg font-medium">{selectedApplication.projectTitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Match Score:</span>
                          <div className="mt-1">
                            <span className={`text-2xl font-bold ${getMatchScoreColor(selectedApplication.matchScore)}`}>
                              {selectedApplication.matchScore}%
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Status:</span>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
                              {selectedApplication.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Applied:</span>
                        <p className="text-gray-900 mt-1">{new Date(selectedApplication.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                      Cover Letter
                    </h4>
                    <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/60 p-4 rounded-xl border border-gray-200/40">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedApplication.status === 'Pending' && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                      Actions
                    </h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'Accepted')}
                        disabled={processingAction === selectedApplication.id}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-center"
                      >
                        {processingAction === selectedApplication.id ? 'Processing...' : '✓ Accept Application'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'Declined')}
                        disabled={processingAction === selectedApplication.id}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-center"
                      >
                        {processingAction === selectedApplication.id ? 'Processing...' : '✗ Decline Application'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 