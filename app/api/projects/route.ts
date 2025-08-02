import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json')

interface Project {
  id: number
  title: string
  company?: string
  division?: string
  department?: string
  description: string
  requiredSkills: string[]
  preferredSkills: string[]
  duration: string
  location: string
  commitment: string
  urgency: string
  category: string
  postedDate: string
  applicationDeadline: string
  teamSize?: string
  budget?: string
  clientIndustry?: string
  projectType?: string
  workModel?: string
  travelRequired?: string
  securityClearance?: boolean
  description_detailed?: string
  responsibilities?: string[]
  learningOpportunities?: string[]
  viewCount: number
  createdBy: string
  applicationStatus?: string
  applicationCount?: number
  applicationsOpen?: boolean
  [key: string]: unknown
}

interface ProjectsData {
  projects: Project[]
  total?: number
  totalViews?: number
}

function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readProjectsData(): ProjectsData {
  try {
    ensureDataDirectory()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data) as ProjectsData
    }
    return { projects: [] }
  } catch (error) {
    console.error('Error reading projects data:', error)
    return { projects: [] }
  }
}

function writeProjectsData(data: ProjectsData): void {
  try {
    ensureDataDirectory()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing projects data:', error)
    throw error
  }
}

// Removed unused function getUserNameFromRequest

function getUserIdFromRequest(request: NextRequest): string {
  // Try to get user id from cookie
  const cookies = request.headers.get('cookie') || ''
  const userNameMatch = cookies.match(/user-id=([^;]+)/)
  
  if (userNameMatch) {
    return decodeURIComponent(userNameMatch[1])
  }
  
  // Fallback - try from headers
  const userName = request.headers.get('x-user-name')
  if (userName) {
    return decodeURIComponent(userName)
  }
  
  return 'Unknown PM'
}

export async function PUT(request: NextRequest) {
  try {
    const { projectId, ...formData } = await request.json()
    const userId = getUserIdFromRequest(request)
    
    // Read existing projects
    const projectsData = readProjectsData()
    
    // Find the project to update
    const projectIndex = projectsData.projects.findIndex((p: Project) => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const existingProject = projectsData.projects[projectIndex]
    
    // Verify ownership
    if (existingProject.createdBy !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only edit your own projects' }, { status: 403 })
    }
    
    // Update project with new data while preserving some original fields
    const updatedProject = {
      ...existingProject,
      title: formData.title,
      description: formData.description,
      company: formData.company,
      division: formData.department, // Map department to division
      category: getCategoryDisplayName(formData.category),
      requiredSkills: formData.requiredSkills || [],
      preferredSkills: formData.preferredSkills || [],
      duration: formData.duration,
      location: formData.location,
      commitment: formData.commitment,
      urgency: formData.urgency,
      teamSize: formData.teamSize || existingProject.teamSize,
      budget: formData.budget || existingProject.budget,
      clientIndustry: formData.clientIndustry || existingProject.clientIndustry,
      projectType: formData.projectType || existingProject.projectType,
      workModel: formData.workModel || existingProject.workModel,
      travelRequired: formData.travelRequired || existingProject.travelRequired,
      securityClearance: formData.securityClearance !== undefined ? formData.securityClearance : existingProject.securityClearance,
      description_detailed: formData.description_detailed || formData.description,
      responsibilities: formData.responsibilities || existingProject.responsibilities,
      learningOpportunities: formData.learningOpportunities || existingProject.learningOpportunities,
      applicationDeadline: formData.urgency !== existingProject.urgency ? getApplicationDeadline(formData.urgency) : existingProject.applicationDeadline,
      // Preserve creation data, stats, and application status
      createdBy: existingProject.createdBy,
      postedDate: existingProject.postedDate,
      id: existingProject.id,
      applicationCount: existingProject.applicationCount,
      viewCount: existingProject.viewCount,
      applicationsOpen: existingProject.applicationsOpen !== undefined ? existingProject.applicationsOpen : true
    }
    
    // Replace the project in the array
    projectsData.projects[projectIndex] = updatedProject
    
    // Save updated data
    writeProjectsData(projectsData)
    
    return NextResponse.json({ 
      success: true, 
      project: updatedProject,
      message: 'Project updated successfully' 
    })
  } catch (error) {
    console.error('Error in PUT /api/projects:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')
    const browse = url.searchParams.get('browse') // New parameter for browsing all projects
    
    const projectsData = readProjectsData()
    const userId = getUserIdFromRequest(request)    
    // If requesting a specific project by ID
    if (projectId) {
      const project = projectsData.projects.find((p: Project) => p.id === parseInt(projectId))
      
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      
      // For browsing mode, don't check ownership - allow viewing any project
      if (!browse && project.createdBy !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
      
      return NextResponse.json({ project })
    }
    
    // If browse mode, return all projects
    if (browse) {
      return NextResponse.json({ 
        projects: projectsData.projects,
        total: projectsData.projects.length
      })
    }
    
    // Default: Filter projects by the requesting PM (for PM dashboard)
    const userProjects = projectsData.projects.filter((project: Project) => 
      project.createdBy === userId
    )
    
    return NextResponse.json({ 
      projects: userProjects,
      total: userProjects.length,
      totalApplications: userProjects.reduce((sum: number, project: Project) => sum + (project.applicationCount || 0), 0),
      totalViews: userProjects.reduce((sum: number, project: Project) => sum + (project.viewCount || 0), 0)
    })
  } catch (error) {
    console.error('Error in GET /api/projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const userId = getUserIdFromRequest(request)
    
    // Read existing projects
    const projectsData = readProjectsData()
    
    // Generate new project ID
    const maxId = projectsData.projects.length > 0 
      ? Math.max(...projectsData.projects.map((p: Project) => p.id || 0))
      : 0
    const newId = maxId + 1
    
    // Create new project object with all required fields
    const newProject = {
      id: newId,
      title: formData.title,
      description: formData.description,
      company: formData.company,
      division: formData.department, // Map department to division
      category: getCategoryDisplayName(formData.category),
      requiredSkills: formData.requiredSkills || [],
      preferredSkills: formData.preferredSkills || [],
      duration: formData.duration,
      location: formData.location,
      commitment: formData.commitment,
      urgency: formData.urgency,
      createdBy: userId,
      postedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      applicationDeadline: getApplicationDeadline(formData.urgency),
      teamSize: '6-12 members', // Default team size
      budget: 'Medium', // Default budget
      clientIndustry: 'Technology', // Default industry
      projectType: 'Greenfield', // Default project type
      workModel: 'Hybrid', // Default work model
      travelRequired: 'Minimal', // Default travel
      securityClearance: false, // Default security clearance
      description_detailed: formData.description, // Use same description for detailed
      responsibilities: [
        'Collaborate with cross-functional teams',
        'Develop and maintain project deliverables',
        'Participate in code reviews and technical discussions',
        'Ensure quality and performance standards'
      ],
      learningOpportunities: [
        'Exposure to modern technologies and frameworks',
        'Cross-functional collaboration experience',
        'Technical leadership opportunities',
        'Industry best practices and methodologies'
      ],
      applicationsOpen: true, // Applications are open by default
      applicationCount: 0,
      viewCount: 0
    }
    
    // Add to projects array
    projectsData.projects.push(newProject)
    
    // Save updated data
    writeProjectsData(projectsData)
    
    return NextResponse.json({ 
      success: true, 
      project: newProject,
      message: 'Project created successfully' 
    })
  } catch (error) {
    console.error('Error in POST /api/projects:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')
    const userId = getUserIdFromRequest(request)
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    // Read existing projects
    const projectsData = readProjectsData()
    
    // Find the project to delete
    const projectIndex = projectsData.projects.findIndex((p: Project) => p.id === parseInt(projectId))
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const projectToDelete = projectsData.projects[projectIndex]
    
    // Verify ownership - only the PM who created the project can delete it
    if (projectToDelete.createdBy !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only delete your own projects' }, { status: 403 })
    }
    
    // Remove the project from the array
    projectsData.projects.splice(projectIndex, 1)
    
    // Save updated data
    writeProjectsData(projectsData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully',
      deletedProject: {
        id: projectToDelete.id,
        title: projectToDelete.title
      }
    })
  } catch (error) {
    console.error('Error in DELETE /api/projects:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { projectId, action } = await request.json()
    const userId = getUserIdFromRequest(request)
    
    if (!projectId || !action) {
      return NextResponse.json({ error: 'Project ID and action are required' }, { status: 400 })
    }
    
    // Read existing projects
    const projectsData = readProjectsData()
    
    // Find the project to update
    const projectIndex = projectsData.projects.findIndex((p: Project) => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const project = projectsData.projects[projectIndex]
    
    // Verify ownership
    if (project.createdBy !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only modify your own projects' }, { status: 403 })
    }
    
    // Handle different actions
    if (action === 'toggle-applications') {
      project.applicationsOpen = !project.applicationsOpen
      
      // Save updated data
      writeProjectsData(projectsData)
      
      return NextResponse.json({ 
        success: true, 
        project: project,
        message: `Applications ${project.applicationsOpen ? 'opened' : 'closed'} successfully`
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in PATCH /api/projects:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'fullstack': 'Full Stack',
    'mobile': 'Mobile',
    'cloud': 'Cloud/DevOps',
    'devops': 'Cloud/DevOps',
    'ai': 'AI/ML',
    'data': 'Data',
    'security': 'Security',
    'qa': 'QA/Testing'
  }
  return categoryMap[category] || category
}

function getApplicationDeadline(urgency: string): string {
  const today = new Date()
  let daysToAdd = 30 // Default to 30 days
  
  switch (urgency.toLowerCase()) {
    case 'high':
      daysToAdd = 14
      break
    case 'medium':
      daysToAdd = 21
      break
    case 'low':
      daysToAdd = 30
      break
  }
  
  const deadline = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
  return deadline.toISOString().split('T')[0] // YYYY-MM-DD format
} 