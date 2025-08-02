import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'associates.json')

interface Associate {
  userId: string
  name: string
  email: string
  role: string
  isManager: boolean
  currentProject?: string
  skills: string[]
  certifications: Array<{
    name: string
    issuer: string
    issuedDate: string
    link?: string
  }>
  projects: Array<{
    title: string
    description: string
    link?: string
    technologies?: string[]
    role?: string
    duration?: string
  }>
  desiredTech: string[]
  preferredLocation: string
  workMode: string
  availability: string
  openToOpportunities: boolean
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

interface AssociatesData {
  associates: Associate[]
}

function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readAssociatesData(): AssociatesData {
  try {
    ensureDataDirectory()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data) as AssociatesData
    }
    return { associates: [] }
  } catch (error) {
    console.error('Error reading associates data:', error)
    return { associates: [] }
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const associateId = url.searchParams.get('id')
    
    const associatesData = readAssociatesData()
    
    // If requesting a specific associate by ID
    if (associateId) {
      const associate = associatesData.associates.find((a: Associate) => a.userId === associateId)
      
      if (!associate) {
        return NextResponse.json({ error: 'Associate not found' }, { status: 404 })
      }
      
      return NextResponse.json({ associate })
    }
    
    // Return all associates
    return NextResponse.json({ 
      associates: associatesData.associates,
      total: associatesData.associates.length
    })
  } catch (error) {
    console.error('Error in GET /api/associates:', error)
    return NextResponse.json({ error: 'Failed to fetch associates' }, { status: 500 })
  }
} 