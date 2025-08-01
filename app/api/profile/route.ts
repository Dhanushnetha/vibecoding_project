import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'profiles.json')

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
      const initialData = { associates: [], projectManagers: [], userProfiles: {} }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
      return initialData
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading profiles:', error)
    return { associates: [], projectManagers: [], userProfiles: {} }
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
    
    // First check if user exists in associates or PMs (these are the predefined users)
    const associate = profilesData.associates?.find((a: any) => a.userId === userId)
    if (associate) {
      return NextResponse.json({ exists: true, profile: associate })
    }
    
    const pm = profilesData.projectManagers?.find((pm: any) => pm.userId === userId)
    if (pm) {
      return NextResponse.json({ exists: true, profile: pm })
    }
    
    // If not found in predefined users, check user profiles (for custom created profiles)
    const userProfile = profilesData.userProfiles?.[userId]
    if (userProfile) {
      return NextResponse.json({ exists: true, profile: userProfile })
    }
    
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
    
    const profile = {
      ...profileData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const profilesData = readProfilesData()
    
    // Initialize userProfiles if it doesn't exist
    if (!profilesData.userProfiles) {
      profilesData.userProfiles = {}
    }
    
    // Store in userProfiles section for custom profiles
    profilesData.userProfiles[userId] = profile
    
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
    
    // Try to find existing profile in associates
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
    
    // Try to find existing profile in PMs
    const pmIndex = profilesData.projectManagers?.findIndex((pm: any) => pm.userId === userId)
    if (pmIndex !== -1) {
      const updatedProfile = {
        ...profilesData.projectManagers[pmIndex],
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      profilesData.projectManagers[pmIndex] = updatedProfile
      writeProfilesData(profilesData)
      return NextResponse.json({ success: true, profile: updatedProfile })
    }
    
    // Try to find existing profile in userProfiles
    const existingProfile = profilesData.userProfiles?.[userId]
    if (existingProfile) {
      const updatedProfile = {
        ...existingProfile,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      if (!profilesData.userProfiles) {
        profilesData.userProfiles = {}
      }
      profilesData.userProfiles[userId] = updatedProfile
      
      writeProfilesData(profilesData)
      return NextResponse.json({ success: true, profile: updatedProfile })
    }
    
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  } catch (error) {
    console.error('PUT profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
} 