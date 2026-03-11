// app/api/health-check/[recordId]/route.js
// API endpoint to fetch a Health Check report + items for customer viewing

import { getHealthCheckReport, getHealthCheckItems } from '../../../../lib/healthCheck'

export async function GET(request, { params }) {
  try {
    const { recordId } = await params

    if (!recordId) {
      return Response.json({ error: 'Missing record ID' }, { status: 400 })
    }

    const report = await getHealthCheckReport(recordId)
    const items = await getHealthCheckItems(recordId)

    return Response.json({ report, items })
  } catch (error) {
    console.error('[HealthCheck API] Error fetching report:', error)
    return Response.json(
      { error: 'Report not found', details: error.message },
      { status: 404 }
    )
  }
}
