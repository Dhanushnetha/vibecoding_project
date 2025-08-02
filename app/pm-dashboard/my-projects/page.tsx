'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  postedBy: string;
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
  learningOpportunities: string[];
  applicationCount: number;
  viewCount: number;
}

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(3)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalApplications: 0,
    totalViews: 0
  })
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [togglingApplications, setTogglingApplications] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get logged-in PM's name from cookies
    const cookies = document.cookie.split(';')
    const nameCookie = cookies.find(cookie => cookie.trim().startsWith('user-name='))
    if (nameCookie) {
      const name = decodeURIComponent(nameCookie.split('=')[1])
      setUserName(name)
    }
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        
        if (response.ok) {
          // Sort by posted date (most recent first)
          const sortedProjects = data.projects.sort((a: Project, b: Project) => 
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          )
          
          setProjects(sortedProjects)
          setStats({
            totalProjects: data.total || 0,
            totalApplications: data.totalApplications || 0,
            totalViews: data.totalViews || 0
          })
        } else {
          console.error('Failed to fetch projects:', data.error)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userName) {
      fetchProjects()
    }
  }, [userName])

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'AI/ML': 'bg-purple-100 text-purple-800',
      'Cloud/DevOps': 'bg-blue-100 text-blue-800',
      'Frontend': 'bg-green-100 text-green-800',
      'Backend': 'bg-orange-100 text-orange-800',
      'Full Stack': 'bg-indigo-100 text-indigo-800',
      'Mobile': 'bg-pink-100 text-pink-800',
      'Data': 'bg-teal-100 text-teal-800',
      'Security': 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleDeleteProject = async (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteModal(true)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    
    setDeletingProjectId(projectToDelete.id)
    
    try {
      const response = await fetch(`/api/projects?id=${projectToDelete.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Remove project from local state
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id))
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          totalProjects: prevStats.totalProjects - 1,
          totalApplications: prevStats.totalApplications - (projectToDelete.applicationCount || 0),
          totalViews: prevStats.totalViews - (projectToDelete.viewCount || 0)
        }))
        
        setSuccessMessage(`Project "${projectToDelete.title}" deleted successfully!`)
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } else {
        console.error('Failed to delete project:', data.error)
        alert(`Failed to delete project: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('An error occurred while deleting the project')
    } finally {
      setDeletingProjectId(null)
      setShowDeleteModal(false)
      setProjectToDelete(null)
    }
  }

  const handleToggleApplications = async (project: Project) => {
    setTogglingApplications(project.id)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: project.id,
          action: 'toggle-applications'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Update the project in local state
        setProjects(prevProjects => 
          prevProjects.map(p => 
            p.id === project.id 
              ? { ...p, applicationsOpen: data.project.applicationsOpen }
              : p
          )
        )
        
        const status = data.project.applicationsOpen ? 'opened' : 'closed'
        setSuccessMessage(`Applications ${status} for "${project.title}"`)
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        console.error('Failed to toggle applications:', data.error)
        alert(`Failed to toggle applications: ${data.error}`)
      }
    } catch (error) {
      console.error('Error toggling applications:', error)
      alert('An error occurred while toggling applications')
    } finally {
      setTogglingApplications(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all the projects you've posted on InnerSwitch
          </p>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {stats.totalProjects === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first project to find talented associates.</p>
            <button
              onClick={() => router.push('/pm-dashboard/add-project')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Post Your First Project
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {currentProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-14 0h2m0 0h2m-2 0h2m2-16h2m2 0h2M7 8h2m2 0h2m2 0h2M7 12h2m2 0h2m2 0h2m-7 4h2m2 0h2" />
                            </svg>
                            {project.company}
                          </span>
                          <span>•</span>
                          <span>{project.division}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                          {project.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(project.urgency)}`}>
                          {project.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Project Description</h4>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      <p className="text-gray-600 text-sm">{project.description_detailed}</p>
                    </div>

                    {/* Project Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-medium">Duration:</span>
                        <span className="ml-2">{project.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Location:</span>
                        <span className="ml-2">{project.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Team Size:</span>
                        <span className="ml-2">{project.teamSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Work Model:</span>
                        <span className="ml-2">{project.workModel}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Budget:</span>
                        <span className="ml-2">{project.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Client Industry:</span>
                        <span className="ml-2">{project.clientIndustry}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Project Type:</span>
                        <span className="ml-2">{project.projectType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Travel Required:</span>
                        <span className="ml-2">{project.travelRequired}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Commitment:</span>
                        <span className="ml-2">{project.commitment}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Security Clearance:</span>
                        <span className="ml-2">{project.securityClearance ? 'Required' : 'Not Required'}</span>
                      </div>
                    </div>

                    {/* Skills Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.requiredSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.preferredSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Responsibilities</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {project.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Learning Opportunities */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Opportunities</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {project.learningOpportunities.map((opportunity, index) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {project.applicationCount} applications
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {project.viewCount} views
                        </span>
                      </div>
                      <span className="text-gray-500">Posted {formatDate(project.postedDate)}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Deadline: {formatDate(project.applicationDeadline)}
                        </span>
                        <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.applicationsOpen === false 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            project.applicationsOpen === false ? 'bg-red-500' : 'bg-green-500'
                          }`}></div>
                          Applications {project.applicationsOpen === false ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => router.push(`/pm-dashboard/my-projects/edit/${project.id}`)}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Toggle Applications Button */}
                        <button
                          onClick={() => handleToggleApplications(project)}
                          disabled={togglingApplications === project.id}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            project.applicationsOpen === false
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {togglingApplications === project.id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : project.applicationsOpen === false ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          <span>
                            {project.applicationsOpen === false ? 'Open Applications' : 'Close Applications'}
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProject(project)}
                          disabled={deletingProjectId === project.id}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingProjectId === project.id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Project</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false)
                        setProjectToDelete(null)
                      }}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteProject}
                      disabled={deletingProjectId !== null}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingProjectId !== null ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 