'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProject() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: 'Cognizant Technology Solutions',
    department: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    duration: '',
    location: '',
    commitment: '',
    urgency: 'Medium',
    category: ''
  })

  const [skillInput, setSkillInput] = useState('')
  const [preferredSkillInput, setPreferredSkillInput] = useState('')

  const companyOptions = [
    'Cognizant Technology Solutions',
    'Cognizant Digital Engineering',
    'Cognizant AI & Analytics',
    'Cognizant Interactive',
    'Cognizant Cloud Infrastructure',
    'Cognizant Mobile Solutions',
    'Cognizant Data & Analytics'
  ]

  const categoryOptions = [
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'fullstack', label: 'Full Stack Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'cloud', label: 'Cloud & Infrastructure' },
    { value: 'devops', label: 'DevOps & SRE' },
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'data', label: 'Data Engineering & Analytics' },
    { value: 'security', label: 'Cybersecurity' },
    { value: 'qa', label: 'Quality Assurance' }
  ]

  const urgencyOptions = [
    { value: 'Low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'Medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'High', label: 'High Priority', color: 'text-red-600' }
  ]

  const commitmentOptions = [
    'Shadow mode (10% time for 2 weeks)',
    'Shadow mode (15% time for 1 month)',
    'Part-time transition (50% for 3 months)',
    'Full-time transition available',
    'Full-time opportunity',
    'Contract-based (3-6 months)',
    'Project-based assignment'
  ]

  const handleAddSkill = (type) => {
    const input = type === 'required' ? skillInput : preferredSkillInput
    const setInput = type === 'required' ? setSkillInput : setPreferredSkillInput
    const skillsKey = type === 'required' ? 'requiredSkills' : 'preferredSkills'

    if (input.trim() && !formData[skillsKey].includes(input.trim())) {
      setFormData(prev => ({
        ...prev,
        [skillsKey]: [...prev[skillsKey], input.trim()]
      }))
      setInput('')
    }
  }

  const handleRemoveSkill = (type, skillToRemove) => {
    const skillsKey = type === 'required' ? 'requiredSkills' : 'preferredSkills'
    setFormData(prev => ({
      ...prev,
      [skillsKey]: prev[skillsKey].filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.title || !formData.department || !formData.description || 
        formData.requiredSkills.length === 0 || !formData.duration || 
        !formData.location || !formData.commitment || !formData.category) {
      alert('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert('Project posted successfully! Associates can now view and apply for this opportunity.')
        
        // Reset form
        setFormData({
          title: '',
          company: 'Cognizant Technology Solutions',
          department: '',
          description: '',
          requiredSkills: [],
          preferredSkills: [],
          duration: '',
          location: '',
          commitment: '',
          urgency: 'Medium',
          category: ''
        })
        
        // Redirect to My Projects to see the newly created project
        router.push('/pm-dashboard/my-projects')
      } else {
        throw new Error(result.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error posting project:', error)
      alert('Error posting project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to PM Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add New Project</h1>
            <p className="text-gray-600">Post a new opportunity for associates</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Division *
                  </label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {companyOptions.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Digital Experience, Cloud Solutions"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the project, technologies involved, client domain, and what the associate will be working on..."
                  required
                />
              </div>
            </div>

            {/* Skills & Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Requirements</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills *
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('required'))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill('required')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('required', skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Skills
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={preferredSkillInput}
                      onChange={(e) => setPreferredSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('preferred'))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill('preferred')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('preferred', skill)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 6 months, 3-4 months"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Hyderabad / Remote, Chennai / Hybrid"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commitment Type *
                  </label>
                  <select
                    value={formData.commitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, commitment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select commitment type</option>
                    {commitmentOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level *
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {urgencyOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting Project...</span>
                  </div>
                ) : (
                  'Post Project'
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  )
} 