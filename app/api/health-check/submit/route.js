// app/api/health-check/submit/route.js
// API endpoint to create a new Home Health Check report

import {
  createHealthCheckReport,
  createHealthCheckItems,
  calculateOverallRating,
  getPriorityItems,
} from '../../../../lib/healthCheck'

export async function POST(request) {
  try {
    const body = await request.json()
    const { customerName, address, techName, inspectionDate, notes, customerPhone, items } = body

    // Validate required fields
    if (!customerName || !address || !techName) {
      return Response.json(
        { error: 'Missing required fields: customerName, address, techName' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return Response.json(
        { error: 'No checklist items provided' },
        { status: 400 }
      )
    }

    // Auto-calculate overall rating and priority items
    const overallRating = calculateOverallRating(items)
    const priorityItems = getPriorityItems(items)

    console.log('[HealthCheck API] Creating report...')

    // Step 1: Create the report
    const report = await createHealthCheckReport({
      customerName,
      address,
      techName,
      inspectionDate: inspectionDate || new Date().toISOString().split('T')[0],
      notes: notes || '',
      overallRating,
      priorityItems,
      customerPhone: customerPhone || '',
    })

    console.log('[HealthCheck API] Report created:', report.id)

    // Step 2: Create checklist items linked to this report
    const itemRecords = items.map(item => ({
      reportId: report.id,
      itemNumber: item.number,
      section: item.section,
      itemName: item.name,
      rating: item.rating,
      notes: item.notes || '',
    }))

    const savedItems = await createHealthCheckItems(itemRecords)
    console.log('[HealthCheck API] Items created:', savedItems.length)

    return Response.json({
      success: true,
      reportId: report.id,
      reportLink: `https://tuneup.handldhome.com/health-check/reports/${report.id}`,
      overallRating,
      itemCount: savedItems.length,
    })

  } catch (error) {
    console.error('[HealthCheck API] Error:', error)
    return Response.json(
      { error: 'Failed to create report', details: error.message },
      { status: 500 }
    )
  }
}
