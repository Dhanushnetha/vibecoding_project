'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import projectsData from '../../data/projects.json'
import ApplicationAlert from '../components/ApplicationAlert'

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
  matchScore?: number;
  matchedSkills?: string[];
  matchType?: 'high' | 'medium' | 'low' | 'none';
}

interface UserProfile {
  skills: string[];
  desiredTech: string[];
  location: string;
  experience: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(5)
  const [applyingToProject, setApplyingToProject] = useState<number | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle search parameter from URL (when coming from saved jobs)
  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [searchParams])

  // Load applied jobs to check for duplicates
  useEffect(() => {
    const loadAppliedJobs = () => {
      try {
        const cookies = document.cookie.split(';')
        const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
        const userId = userIdCookie ? userIdCookie.split('=')[1] : null

        if (userId) {
          const appliedJobsKey = `applied-jobs-${userId}`
          const appliedJobsData = localStorage.getItem(appliedJobsKey)
          
          if (appliedJobsData) {
            const parsedJobs = JSON.parse(appliedJobsData)
            const appliedIds: string[] = parsedJobs.map((job: any) => job.id.toString())
            setAppliedJobs(new Set(appliedIds))
          }
        }
      } catch (error) {
        console.error('Error loading applied jobs:', error)
      }
    }

    loadAppliedJobs()
  }, [])

  // Load user profile to get skills for matching
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user ID from cookies
        const cookies = document.cookie.split(';')
        const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
        const userId = userIdCookie ? userIdCookie.split('=')[1] : null

        if (!userId) {
          console.error('No user ID found in cookies')
          return
        }

        const response = await fetch('/api/profile', {
          headers: { 'user-id': userId }
        })
        const data = await response.json()
        if (data.exists && data.profile) {
          setUserProfile({
            skills: data.profile.skills || [],
            desiredTech: data.profile.desiredTech || [],
            location: data.profile.preferredLocation || '',
            experience: data.profile.experience || ''
          })
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    }

    fetchUserProfile()
  }, [])

  // Calculate project match score based on user skills
  const calculateMatchScore = (project: Project, userSkills: string[], userDesiredTech: string[]): { score: number; matchedSkills: string[]; matchType: 'high' | 'medium' | 'low' | 'none' } => {
    const allUserSkills = [...userSkills, ...userDesiredTech].map(skill => skill.toLowerCase())
    const requiredSkills = project.requiredSkills.map(skill => skill.toLowerCase())
    const preferredSkills = project.preferredSkills.map(skill => skill.toLowerCase())
    const allProjectSkills = [...requiredSkills, ...preferredSkills]

    // Find matching skills
    const matchedRequired = requiredSkills.filter(skill => 
      allUserSkills.some(userSkill => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    )
    const matchedPreferred = preferredSkills.filter(skill => 
      allUserSkills.some(userSkill => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    )

    // Calculate score (required skills weighted more heavily)
    const requiredMatchPercent = matchedRequired.length / Math.max(requiredSkills.length, 1)
    const preferredMatchPercent = matchedPreferred.length / Math.max(preferredSkills.length, 1)
    const score = (requiredMatchPercent * 0.7) + (preferredMatchPercent * 0.3)

    // Get original skill names for display
    const matchedSkillNames = [
      ...project.requiredSkills.filter(skill => 
        allUserSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      ),
      ...project.preferredSkills.filter(skill => 
        allUserSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      )
    ]

    // Determine match type
    let matchType: 'high' | 'medium' | 'low' | 'none'
    if (score >= 0.7) matchType = 'high'
    else if (score >= 0.4) matchType = 'medium'
    else if (score > 0) matchType = 'low'
    else matchType = 'none'

    return { score, matchedSkills: [...new Set(matchedSkillNames)], matchType }
  }

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
        let appliedJobsList = existingAppliedJobs ? JSON.parse(existingAppliedJobs) : []

        // Double-check if already applied (safety check)
        const alreadyApplied = appliedJobsList.some((job: any) => job.id === project.id.toString())
        
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

          // Update local state
          setAppliedJobs(prev => new Set([...prev, project.id.toString()]))

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
    
    // Show alert directly
    setSelectedProject(project)
    setShowAlert(true)
    setApplyingToProject(null)
  }

  useEffect(() => {
    // Load and process projects
    setTimeout(() => {
      const processedProjects = projectsData.projects.map(project => {
        const baseProject = project as Project
        
        if (userProfile && userProfile.skills.length > 0) {
          const { score, matchedSkills, matchType } = calculateMatchScore(
            baseProject, 
            userProfile.skills, 
            userProfile.desiredTech
          )
          return {
            ...baseProject,
            matchScore: score,
            matchedSkills,
            matchType
          }
        }
        
        return {
          ...baseProject,
          matchScore: 0,
          matchedSkills: [],
          matchType: 'none' as const
        }
      })

      // Sort by match score (highest first), then by posted date
      const sortedProjects = processedProjects.sort((a, b) => {
        if (a.matchScore !== b.matchScore) {
          return (b.matchScore || 0) - (a.matchScore || 0)
        }
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      })

      setProjects(sortedProjects)
      setFilteredProjects(sortedProjects)
      setLoading(false)
    }, 1000)
  }, [userProfile])

  useEffect(() => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.preferredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    setFilteredProjects(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [selectedCategory, projects, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const categories = ['All', ...new Set(projects.map(p => p.category))]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchColor = (matchType: string) => {
    switch (matchType) {
      case 'high': return 'bg-green-100 text-green-800 border-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const getMatchLabel = (matchType: string, matchScore: number) => {
    switch (matchType) {
      case 'high': return `${Math.round(matchScore * 100)}% Match`
      case 'medium': return `${Math.round(matchScore * 100)}% Match`
      case 'low': return `${Math.round(matchScore * 100)}% Match`
      default: return 'No Match'
    }
  }

  const renderPaginationButton = (page: number, label: string | null = null) => {
    const isActive = page === currentPage
    const displayLabel = label || page

    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        disabled={isActive}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white cursor-default'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {displayLabel}
      </button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Project Opportunities</h1>
            <p className="text-gray-600">Discover exciting internal projects and expand your career</p>
            <div className="mt-4 text-sm text-gray-600">
              {filteredProjects.length} of {projects.length} projects available
              {userProfile && userProfile.skills.length > 0 && (
                <span className="ml-2 text-blue-600">• Sorted by skill match</span>
                    )}
                  </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search projects by title, skills, company, location..."
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                  </div>
                </div>
              </div>

          {/* Match Statistics */}
          {userProfile && userProfile.skills.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skill Matches</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProjects.filter(p => p.matchType === 'high').length}
                  </div>
                  <div className="text-sm text-green-700">High Match</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredProjects.filter(p => p.matchType === 'medium').length}
                  </div>
                  <div className="text-sm text-yellow-700">Medium Match</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredProjects.filter(p => p.matchType === 'low').length}
                  </div>
                  <div className="text-sm text-blue-700">Low Match</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {filteredProjects.filter(p => p.matchType === 'none').length}
                  </div>
                  <div className="text-sm text-gray-700">No Match</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            {currentProjects.map((project) => (
              <div key={project.id} className={`bg-white rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-all ${
                project.matchType === 'high' ? 'border-green-200 bg-green-50/30' :
                project.matchType === 'medium' ? 'border-yellow-200 bg-yellow-50/30' :
                project.matchType === 'low' ? 'border-blue-200 bg-blue-50/30' :
                'border-gray-200'
              }`}>
                
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  
                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          {project.matchType !== 'none' && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getMatchColor(project.matchType!)}`}>
                              ⭐ {getMatchLabel(project.matchType!, project.matchScore!)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{project.company}</span>
                          <span>•</span>
                          <span>{project.division}</span>
                          <span>•</span>
                          <span>Posted by {project.postedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(project.urgency)}`}>
                          {project.urgency} Priority
                        </span>
                        {project.applicationsOpen === false && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                            🚫 Closed
                          </span>
                        )}
                      </div>
            </div>

                    <p className="text-gray-700 mb-4">{project.description}</p>

                    {/* Show matched skills if any */}
                    {project.matchedSkills && project.matchedSkills.length > 0 && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">🎯 Your Matching Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.matchedSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
                              ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.requiredSkills.slice(0, 3).map((skill, index) => (
                            <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${
                              project.matchedSkills?.includes(skill) 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {project.matchedSkills?.includes(skill) && '✓ '}{skill}
                    </span>
                  ))}
                          {project.requiredSkills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{project.requiredSkills.length - 3} more
                            </span>
                          )}
              </div>
            </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Preferred Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.preferredSkills.slice(0, 3).map((skill, index) => (
                            <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${
                              project.matchedSkills?.includes(skill) 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {project.matchedSkills?.includes(skill) && '✓ '}{skill}
                            </span>
                          ))}
                          {project.preferredSkills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{project.preferredSkills.length - 3} more
                            </span>
                          )}
            </div>
              </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📍 {project.location}</div>
                          <div>⏱️ {project.duration}</div>
                          <div>💼 {project.commitment}</div>
              </div>
            </div>
          </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>👥 {project.teamSize}</span>
                      <span>🏢 {project.clientIndustry}</span>
                      <span>🚀 {project.projectType}</span>
                      <span>📅 Apply by {new Date(project.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="lg:w-64 space-y-4">
                    
                    {/* Stats */}
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

                    {/* Apply Button */}
                <button 
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                        project.applicationsOpen === false ?
                        'bg-gray-400 text-gray-600 cursor-not-allowed' :
                        appliedJobs.has(project.id.toString()) ? 
                        'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white' :
                        applyingToProject === project.id ? 
                        'opacity-75 cursor-not-allowed ' + (
                          project.matchType === 'high' ? 'bg-green-600 text-white' :
                          project.matchType === 'medium' ? 'bg-yellow-600 text-white' :
                          'bg-blue-600 text-white'
                        ) :
                        project.matchType === 'high' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        project.matchType === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                        'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={() => {
                        if (project.applicationsOpen === false) {
                          return; // Do nothing if applications are closed
                        }
                        if (appliedJobs.has(project.id.toString())) {
                          router.push('/applied-jobs')
                        } else {
                          handleApplyToProject(project)
                        }
                      }}
                      disabled={applyingToProject === project.id || project.applicationsOpen === false}
                    >
                      {project.applicationsOpen === false ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                          Applications Closed
                        </div>
                      ) : appliedJobs.has(project.id.toString()) ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          View Application
                    </div>
                      ) : applyingToProject === project.id ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                          Applying...
                    </div>
                  ) : (
                        project.matchType === 'high' ? '🎯 Apply Now (Great Match!)' :
                        project.matchType === 'medium' ? '⭐ Apply Now (Good Match!)' :
                    'Apply Now'
                  )}
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                </button>
              </div>
            </div>
                </div>
                </div>
            ))}
                </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} results
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return renderPaginationButton(page)
                      } else if (
                        page === currentPage - 2 || 
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No projects found matching your search.' : 'No projects found in this category.'}
              </p>
              <div className="space-x-4">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all projects
                </button>
            </div>
          </div>
          )}

        </div>
      </main>

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
  )
} 