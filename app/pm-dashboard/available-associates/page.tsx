'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import associatesData from '../../../data/associates.json'

interface Associate {
  userId: string
  name: string
  email: string
  role: string
  isManager: boolean
  currentProject: string
  skills: string[]
  certifications: any[]
  projects: any[]
  desiredTech: string[]
  preferredLocation: string
  workMode: string
  availability: string
  openToOpportunities: boolean
  experience?: string
  profileCompleteness?: number
  matchingProjects?: number
  lastUpdated?: string
  location?: string
}

export default function AvailableAssociates() {
  const router = useRouter()
  const [associates, setAssociates] = useState<Associate[]>([])
  const [filteredAssociates, setFilteredAssociates] = useState<Associate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [associatesPerPage] = useState(4) // Show 4 associates per page

  useEffect(() => {
    // Load associates from data file and filter only those open to opportunities
    const availableAssociates = associatesData.associates.filter(associate => associate.openToOpportunities)
    
    setTimeout(() => {
      setAssociates(availableAssociates)
      setFilteredAssociates(availableAssociates)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = associates

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(associate =>
        associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        associate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        associate.currentProject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Skill filter
    if (skillFilter) {
      filtered = filtered.filter(associate =>
        associate.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(associate =>
        (associate.preferredLocation || '').toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    setFilteredAssociates(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [associates, searchTerm, skillFilter, locationFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssociates.length / associatesPerPage)
  const startIndex = (currentPage - 1) * associatesPerPage
  const endIndex = startIndex + associatesPerPage
  const currentAssociates = filteredAssociates.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of associates list
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleContactAssociate = (associate: Associate, method: string) => {
    const message = method === 'email' 
      ? `Opening email to contact ${associate.name}...`
      : `Opening Teams chat with ${associate.name}...`
    alert(message)
  }

  const handleViewProfile = (associateId: string) => {
    router.push(`/pm-dashboard/associate-profile/${associateId}`)
  }

  const uniqueSkills = [...new Set(associates.flatMap(a => a.skills))].sort()
  const uniqueLocations = [...new Set(associates.map(a => a.location || a.preferredLocation || '').filter(Boolean))].sort()

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
          <p className="text-gray-600">Loading available associates...</p>
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
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Associates</h1>
                <p className="text-gray-600">Associates open to internal opportunities</p>
              </div>
              <div className="text-sm text-gray-600">
                {filteredAssociates.length} of {associates.length} associates
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filters</h3>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Associates
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, skills, or project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Skill
                </label>
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Skills</option>
                  {uniqueSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAssociates.length)} of {filteredAssociates.length} associates
            </p>
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Associates List */}
          <div className="space-y-4">
            {currentAssociates.map((associate) => (
              <div key={associate.userId} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  {/* Associate Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {associate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{associate.name}</h3>
                        <p className="text-gray-600">{associate.experience || 'Experience not specified'} • {associate.preferredLocation || 'Location not specified'}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">Available</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Current Project</h4>
                        <p className="text-sm text-gray-600">{associate.currentProject}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                        <p className="text-sm text-gray-600">{associate.availability}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Profile Status</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${associate.profileCompleteness || 85}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{associate.profileCompleteness || 85}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {(associate.skills || []).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                        {(!associate.skills || associate.skills.length === 0) && (
                          <span className="text-gray-500 text-sm italic">No skills listed</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📧 {associate.email}</span>
                      <span>📈 {associate.matchingProjects || 0} matching projects</span>
                      <span>🔄 Updated {associate.lastUpdated || 'recently'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 lg:w-48">
                    <button
                      onClick={() => handleContactAssociate(associate, 'email')}
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Email</span>
                    </button>

                    <button
                      onClick={() => handleContactAssociate(associate, 'teams')}
                      className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Teams Message</span>
                    </button>

                    <button 
                      onClick={() => handleViewProfile(associate.userId)}
                      className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>View Profile</span>
                    </button>
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
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAssociates.length)} of {filteredAssociates.length} results
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
                      // Show first page, last page, current page, and pages around current page
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
          {filteredAssociates.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
              <p className="text-gray-600 mb-4">No associates found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSkillFilter('')
                  setLocationFilter('')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
} 