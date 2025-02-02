import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const propertyRequest = await prisma.propertyRequest.findUnique({
      where: { id }
    })

    if (!propertyRequest) {
      return NextResponse.json(
        { success: false, error: 'Property request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: propertyRequest
    })
  } catch (error) {
    console.error('Error fetching property request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property request' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const updatedRequest = await prisma.propertyRequest.update({
      where: { id },
      data: {
        status: data.status
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedRequest
    })
  } catch (error) {
    console.error('Error updating property request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update property request' },
      { status: 500 }
    )
  }
}
