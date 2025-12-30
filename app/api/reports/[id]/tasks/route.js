// app/api/reports/[id]/tasks/route.js
// API endpoint to fetch task results for a report

import { getTaskResults } from '../../../../../lib/airtable-tuneup';

export async function GET(request, { params }) {
  try {
    // In Next.js 14+, params might be a Promise
    const { id } = await params;

    console.log('[API] Route called with id:', id);
    console.log('[API] ID type:', typeof id);

    if (!id) {
      console.error('[API] No ID provided');
      return Response.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    console.log('[API] Fetching tasks for report:', id);

    const tasks = await getTaskResults(id);

    console.log('[API] getTaskResults returned:', tasks.length, 'tasks');

    if (tasks.length === 0) {
      console.error('[API] WARNING: No tasks found for report:', id);
      console.error('[API] This report should have tasks but returned empty array');
    } else {
      console.log('[API] SUCCESS: Found', tasks.length, 'tasks');
      console.log('[API] First task:', JSON.stringify(tasks[0]));
    }

    console.log('[API] Returning', tasks.length, 'tasks');

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
