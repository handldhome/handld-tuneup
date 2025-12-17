// app/api/reports/create/route.js
// API endpoint to create a new home tuneup report

import { createReport, createTaskResults } from '../../../../lib/airtable-tuneup';

export async function POST(request) {
  try {
    const body = await request.json();
    const { reportData, taskResults, sectionNotes } = body;

    console.log('[API] Request received');

    // Validate required fields
    if (!reportData?.customerName || !reportData?.customerEmail || !reportData?.address) {
      return Response.json(
        { error: 'Missing required report fields' },
        { status: 400 }
      );
    }

    if (!taskResults || taskResults.length === 0) {
      return Response.json(
        { error: 'No task results provided' },
        { status: 400 }
      );
    }

    console.log('[API] Creating report...');
    
    // Step 1: Create the report with section notes
    const report = await createReport({
      ...reportData,
      sectionNotes,
    });
    console.log('[API] Report created:', report.id);
    
    // Step 2: Create task results linked to this report
    const tasksWithReportId = taskResults.map(task => ({
      ...task,
      reportId: report.id,
    }));

    console.log('[API] Creating task results...');
    
    const savedTasks = await createTaskResults(tasksWithReportId);
    console.log('[API] Task results created:', savedTasks.length);

    // Step 3: Return success
    return Response.json({
      success: true,
      reportId: report.id,
      reportLink: `https://tuneup.handldhome.com/reports/${report.id}`,
      taskCount: savedTasks.length,
    });

  } catch (error) {
    console.error('[API] Error:', error);
    console.error('[API] Error stack:', error.stack);
    return Response.json(
      { 
        error: 'Failed to create report',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
