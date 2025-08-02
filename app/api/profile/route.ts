import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'associates.json')

function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readProfilesData(): any {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(DATA_FILE)) {
      // Create initial empty structure
      const initialData = { associates: [] }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
      return initialData
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading profiles:', error)
    return { associates: [] }
  }
}

function writeProfilesData(data: any) {
  try {
    ensureDataDirectory()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing profiles:', error)
    throw new Error('Failed to save profile data')
  }
}

function getUserIdFromRequest(request: NextRequest): string {
  // First try to get from header (for API calls)
  let userId = request.headers.get('user-id')
  
  // If not in header, try to get from cookies (for authenticated users)
  if (!userId) {
    const cookies = request.headers.get('cookie')
    if (cookies) {
      const userIdCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('user-id='))
      if (userIdCookie) {
        userId = userIdCookie.split('=')[1]
      }
    }
  }
  
  // Fallback to demo-user if nothing found
  return userId || 'demo-user'
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    const profilesData = readProfilesData()
    
    // Check if user exists in associates
    const associate = profilesData.associates?.find((a: any) => a.userId === userId)
    if (associate) {
      return NextResponse.json({ exists: true, profile: associate })
    }
    
    // User not found
    return NextResponse.json({ exists: false, profile: null })
  } catch (error) {
    console.error('GET profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    const profileData = await request.json()
    
    const profilesData = readProfilesData()
    
    // Check if user already exists in associates
    const existingIndex = profilesData.associates.findIndex((a: any) => a.userId === userId)
    
    const profile = {
      userId,
      associateId: `A${userId.substring(3)}`, // Convert CTS001234 to A001234
      role: 'associate',
      isManager: false,
      ...profileData,
      createdAt: existingIndex === -1 ? new Date().toISOString() : profilesData.associates[existingIndex].createdAt,
      updatedAt: new Date().toISOString()
    }
    
    if (existingIndex === -1) {
      // Add new associate
      profilesData.associates.push(profile)
    } else {
      // Update existing associate
      profilesData.associates[existingIndex] = { ...profilesData.associates[existingIndex], ...profile }
    }
    
    writeProfilesData(profilesData)
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('POST profile error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    const profileData = await request.json()
    const profilesData = readProfilesData()
    
    // Find existing profile in associates
    const associateIndex = profilesData.associates?.findIndex((a: any) => a.userId === userId)
    if (associateIndex !== -1) {
      const updatedProfile = {
        ...profilesData.associates[associateIndex],
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      profilesData.associates[associateIndex] = updatedProfile
      writeProfilesData(profilesData)
      return NextResponse.json({ success: true, profile: updatedProfile })
    }
    
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  } catch (error) {
    console.error('PUT profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
} 