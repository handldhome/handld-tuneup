// app/api/master-tasks/route.js
// API endpoint to fetch master task list from Airtable

import { getMasterTasks } from '../../../lib/db';

export async function GET() {
  try {
    console.log('[API] Fetching master tasks');

    const tasks = await getMasterTasks();

    console.log('[API] Master tasks fetched:', tasks.length);

    return Response.json(tasks);
  } catch (error) {
    console.error('[API] Error fetching master tasks:', error);
    return Response.json(
      {
        error: 'Failed to fetch master tasks',
        details: error.message
      },
      { status: 500 }
    );
  }
}
