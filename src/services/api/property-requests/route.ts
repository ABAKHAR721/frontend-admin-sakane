import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: Request) {
  console.log('POST request received at /api/property-requests')
  
  try {
    const data = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))

    // Validation des données
    if (!data.propertyDetails || !data.location || !data.contact) {
      console.error('Invalid data structure')
      return NextResponse.json(
        { success: false, error: 'Invalid data structure' },
        { status: 400 }
      )
    }

    // Créer une nouvelle entrée dans la base de données
    const propertyRequest = await prisma.propertyRequest.create({
      data: {
        mode: data.propertyDetails.mode || '',
        type: data.propertyDetails.type || '',
        bedrooms: data.propertyDetails.bedrooms || '',
        area: data.propertyDetails.area || '',
        budget: data.propertyDetails.budget || '',
        rentalDuration: data.propertyDetails.rentalDuration || '',
        timing: data.propertyDetails.timing || '',
        
        // Location details
        address: data.location.address || '',
        latitude: data.location.coordinates?.lat || 0,
        longitude: data.location.coordinates?.lng || 0,
        
        // Contact information
        contactName: data.contact.name || '',
        contactEmail: data.contact.email || '',
        contactPhone: data.contact.phone || '',
        
        // Store the complete JSON
        rawData: data
      }
    })

    console.log('Created property request:', propertyRequest)

    return NextResponse.json({ 
      success: true, 
      data: propertyRequest 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error creating property request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create property request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

export async function GET() {
  console.log('GET request received at /api/property-requests')
  
  try {
    const propertyRequests = await prisma.propertyRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${propertyRequests.length} requests`)

    return NextResponse.json({ 
      success: true, 
      data: propertyRequests 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error fetching property requests:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch property requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}
