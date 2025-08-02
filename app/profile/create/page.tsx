'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  currentProject?: string
  skills: string[]
  certifications: { name: string; link: string }[]
  projects: { title: string; description: string; link: string }[]
  desiredTech: string[]
  preferredLocation: string
  workMode: string
  availability: string
  openToOpportunities: boolean
}

export default function CreateProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const [formData, setFormData] = useState<ProfileData>({
    currentProject: '',
    skills: [],
    certifications: [{ name: '', link: '' }],
    projects: [{ title: '', description: '', link: '' }],
    desiredTech: [],
    preferredLocation: '',
    workMode: '',
    availability: '',
    openToOpportunities: false
  })

  const [newSkill, setNewSkill] = useState('')
  const [newTech, setNewTech] = useState('')

  // Check if profile exists and populate form
  useEffect(() => {
    const fetchProfile = async () => {
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
          // Map the profile data to form structure
          const profileData = {
            currentProject: data.profile.currentProject || '',
            skills: data.profile.skills || [],
            certifications: data.profile.certifications && data.profile.certifications.length > 0 
              ? data.profile.certifications 
              : [{ name: '', link: '' }],
            projects: data.profile.projects && data.profile.projects.length > 0 
              ? data.profile.projects 
              : [{ title: '', description: '', link: '' }],
            desiredTech: data.profile.desiredTech || [],
            preferredLocation: data.profile.preferredLocation || '',
            workMode: data.profile.workMode || '',
            availability: data.profile.availability || '',
            openToOpportunities: data.profile.openToOpportunities || false
          }
          
          setFormData(profileData)
          setIsEditMode(true)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required'
    }

    if (!formData.preferredLocation.trim()) {
      newErrors.preferredLocation = 'Preferred location is required'
    }

    if (!formData.workMode.trim()) {
      newErrors.workMode = 'Work mode is required'
    }

    if (!formData.availability.trim()) {
      newErrors.availability = 'Availability is required'
    }

    // Validate certification links
    formData.certifications.forEach((cert, index) => {
      if (cert.name && cert.link && !isValidUrl(cert.link)) {
        newErrors[`certification_${index}`] = 'Please enter a valid URL'
      }
    })

    // Validate project links
    formData.projects.forEach((project, index) => {
      if (project.link && !isValidUrl(project.link)) {
        newErrors[`project_${index}`] = 'Please enter a valid URL'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addDesiredTech = () => {
    if (newTech.trim() && !formData.desiredTech.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        desiredTech: [...prev.desiredTech, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  const removeDesiredTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      desiredTech: prev.desiredTech.filter(tech => tech !== techToRemove)
    }))
  }

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', link: '' }]
    }))
  }

  const updateCertification = (index: number, field: 'name' | 'link', value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', link: '' }]
    }))
  }

  const updateProject = (index: number, field: 'title' | 'description' | 'link', value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';')
      const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('user-id='))
      const userId = userIdCookie ? userIdCookie.split('=')[1] : 'demo-user'

      const method = isEditMode ? 'PUT' : 'POST'
      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/dashboard')
      } else {
        console.error('Failed to save profile:', data.error)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? 'Edit Your Profile' : 'Create Your Professional Profile'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isEditMode 
                ? 'Update your skills, experience, and preferences to get matched with the right opportunities.'
                : 'Tell us about your skills, experience, and preferences to get matched with the right opportunities.'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
            
            {/* Availability Toggle - Prominent */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Open to Internal Opportunities</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Make your profile visible to Project Managers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openToOpportunities}
                    onChange={(e) => setFormData(prev => ({ ...prev, openToOpportunities: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Current Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Project (Optional)
              </label>
              <input
                type="text"
                value={formData.currentProject}
                onChange={(e) => setFormData(prev => ({ ...prev, currentProject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter your current project name"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills *
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Certification name"
                      />
                      <input
                        type="url"
                        value={cert.link}
                        onChange={(e) => updateCertification(index, 'link', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Certificate link or upload URL"
                      />
                    </div>
                    {formData.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCertification}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Certification
                </button>
              </div>
            </div>

            {/* Projects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hands-on Projects
              </label>
              <div className="space-y-4">
                {formData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Project {index + 1}</span>
                      {formData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Project title"
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={2}
                      placeholder="Brief project description"
                    />
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="GitHub/demo link"
                    />
                    {errors[`project_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`project_${index}`]}</p>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Project
                </button>
              </div>
            </div>

            {/* Desired Tech/Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Tech/Domain/Project Type
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDesiredTech())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Type desired technology or domain"
                  />
                  <button
                    type="button"
                    onClick={addDesiredTech}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.desiredTech.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeDesiredTech(tech)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location *
              </label>
              <select
                value={formData.preferredLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredLocation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select preferred location</option>
                <option value="remote">Remote</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="mumbai">Mumbai</option>
                <option value="noida">Noida</option>
                <option value="kolkata">Kolkata</option>
              </select>
              {errors.preferredLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.preferredLocation}</p>
              )}
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Mode *
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData(prev => ({ ...prev, workMode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select work mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.workMode && (
                <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select availability</option>
                <option value="immediate">Immediate</option>
                <option value="1-month">1 Month</option>
                <option value="2-months">2 Months</option>
                <option value="3-months">3 Months</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditMode ? 'Update Profile' : 'Create Profile'}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
} 