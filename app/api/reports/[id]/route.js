import { getReport } from '../../../../lib/airtable-tuneup';

export async function GET(request, { params }) {
  try {
    const { id } = params;
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
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
