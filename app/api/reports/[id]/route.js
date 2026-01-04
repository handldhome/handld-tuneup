// app/api/reports/[id]/route.js
// API endpoint to fetch a single report by ID

import { getReport } from '../../../../lib/airtable-tuneup';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching report:', id);
    
    const report = await getReport(id);
    
    if (!report) {
      return Response.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return Response.json(report);

  } catch (error) {
    console.error('[API] Error fetching report:', error);
    return Response.json(
      { 
        error: 'Failed to fetch report',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
