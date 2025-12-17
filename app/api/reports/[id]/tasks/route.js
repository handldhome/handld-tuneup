import { getTaskResults } from '../../../../../lib/airtable-tuneup';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const tasks = await getTaskResults(id);
    
    return Response.json(tasks);
  } catch (error) {
    console.error('[API] Error fetching tasks:', error);
    return Response.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
