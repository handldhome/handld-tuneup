// app/api/reports/[id]/tasks/route.js
// API endpoint to fetch task results for a report

import { getTaskResults } from '../../../../../lib/airtable-tuneup';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return Response.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching tasks for report:', id);
    
    const tasks = await getTaskResults(id);
    
    return Response.json(tasks);

  } catch (error) {
    console.error('[API] Error fetching tasks:', error);
    return Response.json(
      { 
        error: 'Failed to fetch tasks',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
