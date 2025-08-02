import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'applications.json')

function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readApplicationsData(): any {
  try {
    ensureDataDirectory()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
    return { applications: [] }
  } catch (error) {
    console.error('Error reading applications data:', error)
    return { applications: [] }
  }
}

function writeApplicationsData(data: any) {
  try {
    ensureDataDirectory()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing applications data:', error)
    throw error
  }
}

function getUserNameFromRequest(request: NextRequest): string {
  // Try to get user name from cookie
  const cookies = request.headers.get('cookie') || ''
  const userNameMatch = cookies.match(/user-name=([^;]+)/)
  
  if (userNameMatch) {
    return decodeURIComponent(userNameMatch[1])
  }
  
  // Fallback - try from headers
  const userName = request.headers.get('x-user-name')
  if (userName) {
    return decodeURIComponent(userName)
  }
  
  return 'Unknown User'
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const associateId = url.searchParams.get('associateId')
    const status = url.searchParams.get('status')
    
    const applicationsData = readApplicationsData()
    const userName = getUserNameFromRequest(request)
    
    let filteredApplications = applicationsData.applications || []
    
    // Filter by project ID if provided
    if (projectId) {
      filteredApplications = filteredApplications.filter((app: any) => app.projectId === projectId)
    }
    
    // Filter by associate ID if provided
    if (associateId) {
      filteredApplications = filteredApplications.filter((app: any) => app.associateId === associateId)
    }
    
    // Filter by status if provided
    if (status) {
      filteredApplications = filteredApplications.filter((app: any) => app.status === status)
    }
    
    // For PMs, only show applications for their projects
    // For associates, only show their own applications
    // This is a simplified logic - in a real app, you'd have proper role-based access control
    
    return NextResponse.json({ 
      applications: filteredApplications,
      total: filteredApplications.length
    })
  } catch (error) {
    console.error('Error in GET /api/applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()
    const userName = getUserNameFromRequest(request)
    
    // Read existing applications
    const applicationsData = readApplicationsData()
    
    // Generate new application ID
    const maxId = applicationsData.applications.length > 0 
      ? Math.max(...applicationsData.applications.map((a: any) => parseInt(a.id) || 0))
      : 0
    const newId = (maxId + 1).toString()
    
    // Create new application object
    const newApplication = {
      id: newId,
      projectId: applicationData.projectId,
      associateId: applicationData.associateId,
      associateName: applicationData.associateName,
      associateEmail: applicationData.associateEmail,
      associateSkills: applicationData.associateSkills || [],
      associateExperience: applicationData.associateExperience,
      appliedAt: new Date().toISOString(),
      status: 'Pending',
      coverLetter: applicationData.coverLetter || '',
      matchScore: applicationData.matchScore || 0,
      projectTitle: applicationData.projectTitle
    }
    
    // Add to applications array
    applicationsData.applications.push(newApplication)
    
    // Save updated data
    writeApplicationsData(applicationsData)
    
    return NextResponse.json({ 
      success: true, 
      application: newApplication,
      message: 'Application submitted successfully' 
    })
  } catch (error) {
    console.error('Error in POST /api/applications:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, ...updateData } = await request.json()
    const userName = getUserNameFromRequest(request)
    
    // Read existing applications
    const applicationsData = readApplicationsData()
    
    // Find the application to update
    const applicationIndex = applicationsData.applications.findIndex((a: any) => a.id === applicationId)
    
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    
    const existingApplication = applicationsData.applications[applicationIndex]
    
    // Update application with new data
    const updatedApplication = {
      ...existingApplication,
      ...updateData,
      status: status || existingApplication.status,
      updatedAt: new Date().toISOString(),
      updatedBy: userName
    }
    
    // Replace the application in the array
    applicationsData.applications[applicationIndex] = updatedApplication
    
    // Save updated data
    writeApplicationsData(applicationsData)
    
    return NextResponse.json({ 
      success: true, 
      application: updatedApplication,
      message: 'Application updated successfully' 
    })
  } catch (error) {
    console.error('Error in PUT /api/applications:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
} 