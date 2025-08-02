'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface FormData {
  title: string
  company: string
  department: string
  description: string
  description_detailed: string
  requiredSkills: string[]
  preferredSkills: string[]
  duration: string
  location: string
  commitment: string
  urgency: string
  category: string
  teamSize: string
  budget: string
  clientIndustry: string
  projectType: string
  workModel: string
  travelRequired: string
  securityClearance: boolean
  responsibilities: string[]
  learningOpportunities: string[]
}

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: 'Cognizant Technology Solutions',
    department: '',
    description: '',
    description_detailed: '',
    requiredSkills: [],
    preferredSkills: [],
    duration: '',
    location: '',
    commitment: '',
    urgency: 'Medium',
    category: '',
    teamSize: '',
    budget: 'Medium',
    clientIndustry: '',
    projectType: 'Greenfield',
    workModel: 'Hybrid',
    travelRequired: 'Minimal',
    securityClearance: false,
    responsibilities: [],
    learningOpportunities: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [preferredSkillInput, setPreferredSkillInput] = useState('')
  const [responsibilityInput, setResponsibilityInput] = useState('')
  const [opportunityInput, setOpportunityInput] = useState('')

  const companyOptions = [
    'Cognizant Technology Solutions',
    'Cognizant Digital Engineering',
    'Cognizant AI & Analytics',
    'Cognizant Interactive',
    'Cognizant Cloud Infrastructure',
    'Cognizant Mobile Solutions',
    'Cognizant Data & Analytics',
    'Cognizant Cybersecurity',
    'Cognizant Blockchain Solutions'
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
    { value: 'qa', label: 'Quality Assurance' },
    { value: 'blockchain', label: 'Blockchain' }
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

  const budgetOptions = ['Low', 'Medium', 'High']
  const clientIndustryOptions = [
    'Technology', 'Financial Services', 'Healthcare', 'Retail', 'Manufacturing',
    'Automotive', 'Banking', 'Insurance', 'Telecommunications', 'Government'
  ]
  const projectTypeOptions = ['Greenfield', 'Enhancement', 'Redesign', 'Migration', 'Innovation', 'Architecture']
  const workModelOptions = ['Remote', 'Hybrid', 'On-site', 'Flexible']
  const travelOptions = ['Minimal', 'Occasional', 'Frequent', 'International']

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`)
        const data = await response.json()
        
        if (response.ok) {
          const project = data.project
          setFormData({
            title: project.title || '',
            company: project.company || 'Cognizant Technology Solutions',
            department: project.division || '',
            description: project.description || '',
            description_detailed: project.description_detailed || '',
            requiredSkills: project.requiredSkills || [],
            preferredSkills: project.preferredSkills || [],
            duration: project.duration || '',
            location: project.location || '',
            commitment: project.commitment || '',
            urgency: project.urgency || 'Medium',
            category: getCategoryValue(project.category) || '',
            teamSize: project.teamSize || '',
            budget: project.budget || 'Medium',
            clientIndustry: project.clientIndustry || '',
            projectType: project.projectType || 'Greenfield',
            workModel: project.workModel || 'Hybrid',
            travelRequired: project.travelRequired || 'Minimal',
            securityClearance: project.securityClearance || false,
            responsibilities: project.responsibilities || [],
            learningOpportunities: project.learningOpportunities || []
          })
        } else {
          console.error('Failed to fetch project:', data.error)
          router.push('/pm-dashboard/my-projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        router.push('/pm-dashboard/my-projects')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, router])

  const getCategoryValue = (categoryLabel: string) => {
    const categoryMap: { [key: string]: string } = {
      'Frontend': 'frontend',
      'Backend': 'backend',
      'Full Stack': 'fullstack',
      'Mobile': 'mobile',
      'Cloud/DevOps': 'cloud',
      'AI/ML': 'ai',
      'Data': 'data',
      'Security': 'security',
      'QA/Testing': 'qa',
      'Blockchain': 'blockchain'
    }
    return categoryMap[categoryLabel] || categoryLabel.toLowerCase()
  }

  const handleAddSkill = (type: 'required' | 'preferred') => {
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

  const handleRemoveSkill = (type: 'required' | 'preferred', skillToRemove: string) => {
    const skillsKey = type === 'required' ? 'requiredSkills' : 'preferredSkills'
    setFormData(prev => ({
      ...prev,
      [skillsKey]: prev[skillsKey].filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() && !formData.responsibilities.includes(responsibilityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }))
      setResponsibilityInput('')
    }
  }

  const handleRemoveResponsibility = (responsibilityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(resp => resp !== responsibilityToRemove)
    }))
  }

  const handleAddOpportunity = () => {
    if (opportunityInput.trim() && !formData.learningOpportunities.includes(opportunityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        learningOpportunities: [...prev.learningOpportunities, opportunityInput.trim()]
      }))
      setOpportunityInput('')
    }
  }

  const handleRemoveOpportunity = (opportunityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      learningOpportunities: prev.learningOpportunities.filter(opp => opp !== opportunityToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          ...formData
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert('Project updated successfully!')
        router.push('/pm-dashboard/my-projects')
      } else {
        throw new Error(result.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pm-dashboard/my-projects')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to My Projects</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
            <p className="text-gray-600">Update your project details and requirements</p>
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief overview of the project..."
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.description_detailed}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_detailed: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed project description, goals, and context..."
                />
              </div>
            </div>

            {/* Project Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h3>
              
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
                    placeholder="e.g., 6 months, 1 year"
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
                    placeholder="e.g., Bangalore, Mumbai, Remote"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commitment Level *
                  </label>
                  <select
                    value={formData.commitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, commitment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select commitment level</option>
                    {commitmentOptions.map(commitment => (
                      <option key={commitment} value={commitment}>{commitment}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {urgencyOptions.map(urgency => (
                      <option key={urgency.value} value={urgency.value}>{urgency.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Project Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <input
                    type="text"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 6-12 members"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {budgetOptions.map(budget => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Industry
                  </label>
                  <select
                    value={formData.clientIndustry}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientIndustry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select industry</option>
                    {clientIndustryOptions.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {projectTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Model
                  </label>
                  <select
                    value={formData.workModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, workModel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {workModelOptions.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Required
                  </label>
                  <select
                    value={formData.travelRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelRequired: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {travelOptions.map(travel => (
                      <option key={travel} value={travel}>{travel}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.securityClearance}
                    onChange={(e) => setFormData(prev => ({ ...prev, securityClearance: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Security clearance required</span>
                </label>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
              
              {/* Required Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('required'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a required skill..."
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
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('required', skill)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={preferredSkillInput}
                    onChange={(e) => setPreferredSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('preferred'))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a preferred skill..."
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill('preferred')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('preferred', skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsibilities Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a key responsibility..."
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              <ul className="space-y-2">
                {formData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex-1">{responsibility}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(responsibility)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Opportunities Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Opportunities</h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={opportunityInput}
                  onChange={(e) => setOpportunityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOpportunity())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a learning opportunity..."
                />
                <button
                  type="button"
                  onClick={handleAddOpportunity}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              <ul className="space-y-2">
                {formData.learningOpportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex-1">{opportunity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOpportunity(opportunity)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/pm-dashboard/my-projects')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating Project...
                    </>
                  ) : (
                    'Update Project'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
} 