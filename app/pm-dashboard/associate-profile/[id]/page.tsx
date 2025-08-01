'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import associatesData from '../../../../data/associates.json'

export default function AssociateProfile() {
  const params = useParams()
  const router = useRouter()
  const [associate, setAssociate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const associateId = parseInt(params.id as string)
    const foundAssociate = associatesData.associates.find(a => a.id === associateId)
    
    if (foundAssociate) {
      setAssociate(foundAssociate)
    }
    setLoading(false)
  }, [params.id])

  const handleContactAssociate = (method) => {
    const message = method === 'email' 
      ? `Opening email to contact ${associate.name}...`
      : `Opening Teams chat with ${associate.name}...`
    alert(message)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading associate profile...</p>
        </div>
      </div>
    )
  }

  if (!associate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Associate Not Found</h1>
          <p className="text-gray-600 mb-6">The associate you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'experience', name: 'Experience', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'skills', name: 'Skills & Certs', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'preferences', name: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Associate Profile</h1>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                
                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {associate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{associate.name}</h2>
                      <p className="text-gray-600">{associate.currentRole}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">📧 {associate.email}</span>
                        <span className="text-sm text-gray-500">🆔 {associate.employeeId}</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      {associate.openToOpportunities && (
                        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700 font-medium">Available</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{associate.experience}</div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{associate.profileCompleteness}%</div>
                      <div className="text-sm text-gray-600">Profile Complete</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{associate.matchingProjects}</div>
                      <div className="text-sm text-gray-600">Matching Projects</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 lg:w-64">
                  <button
                    onClick={() => handleContactAssociate('email')}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Send Email</span>
                  </button>

                  <button
                    onClick={() => handleContactAssociate('teams')}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Teams Message</span>
                  </button>

                  <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-t border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Current Assignment */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignment</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project:</span>
                      <p className="text-gray-900">{associate.currentProject}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Department:</span>
                      <p className="text-gray-900">{associate.department}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Manager:</span>
                      <p className="text-gray-900">{associate.manager}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{associate.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Availability:</span>
                      <p className="text-gray-900">{associate.availability}</p>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Join Date:</span>
                      <p className="text-gray-900">{new Date(associate.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Cost Center:</span>
                      <p className="text-gray-900">{associate.costCenter}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Performance Rating:</span>
                      <p className="text-gray-900">{associate.performanceRating}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Review:</span>
                      <p className="text-gray-900">{new Date(associate.lastPerformanceReview).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Languages:</span>
                      <p className="text-gray-900">{associate.languages.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Career Goals */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Goals & Interests</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Career Goals:</span>
                      <p className="text-gray-900 mt-1">{associate.careerGoals}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Preferred Roles:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {associate.preferredRoles.map((role, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Shadow Mode Interest:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          associate.shadowModeInterest 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {associate.shadowModeInterest ? 'Yes' : 'No'}
                        </span>
                        {associate.previousShadowProjects.length > 0 && (
                          <span className="text-sm text-gray-500">
                            ({associate.previousShadowProjects.length} previous projects)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Experience</h3>
                  <div className="space-y-6">
                    {associate.projects.map((project, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                            <p className="text-sm text-gray-600">{project.role} • {project.duration}</p>
                          </div>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills & Certifications Tab */}
            {activeTab === 'skills' && (
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Current Skills */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {associate.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desired Technologies */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {associate.desiredTech.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {associate.certifications.map((cert, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Verify →
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">Issued: {new Date(cert.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Work Preferences */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Preferences</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Remote Work:</span>
                      <p className="text-gray-900">{associate.workPreferences.remoteWork}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Travel Willingness:</span>
                      <p className="text-gray-900">{associate.workPreferences.travelWillingness}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Preferred Project Duration:</span>
                      <p className="text-gray-900">{associate.workPreferences.projectDuration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Preferred Team Size:</span>
                      <p className="text-gray-900">{associate.workPreferences.teamSize}</p>
                    </div>
                  </div>
                </div>

                {/* Shadow Mode History */}
                {associate.previousShadowProjects.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shadow Mode History</h3>
                    <div className="space-y-2">
                      {associate.previousShadowProjects.map((project, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          <span className="text-gray-700">{project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Status</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{associate.availability}</div>
                      <div className="text-sm text-gray-600">Available Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-semibold ${
                        associate.openToOpportunities ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {associate.openToOpportunities ? 'Open' : 'Not Available'}
                      </div>
                      <div className="text-sm text-gray-600">Internal Opportunities</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">
                        {new Date(associate.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">Last Updated</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 