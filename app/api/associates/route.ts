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

function readAssociatesData(): any {
  try {
    ensureDataDirectory()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
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
      const associate = associatesData.associates.find((a: any) => a.id.toString() === associateId)
      
      if (!associate) {
        return NextResponse.json({ error: 'Associate not found' }, { status: 404 })
      }
      
      return NextResponse.json({ associate })
    }
    
    // Return all associates
    return NextResponse.json(associatesData)
  } catch (error) {
    console.error('Error in GET /api/associates:', error)
    return NextResponse.json({ error: 'Failed to fetch associates' }, { status: 500 })
  }
} 