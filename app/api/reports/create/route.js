// app/api/reports/create/route.js
// API endpoint to create a new home tuneup report

import { createReport, createTaskResults, getTaskResults, verifyTaskResultsTableConfiguration } from '../../../../lib/airtable-tuneup';

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

    // Step 1: Verify Airtable field configuration
    console.log('[API] Verifying Airtable table configuration...');
    await verifyTaskResultsTableConfiguration();
    console.log('[API] Configuration verification passed');

    // Step 2: Create the report with section notes
    console.log('[API] Creating report...');
    const report = await createReport({
      ...reportData,
      sectionNotes,
    });
    console.log('[API] Report created with ID:', report.id);
    console.log('[API] Report ID type:', typeof report.id);
    console.log('[API] Full report object:', JSON.stringify(report, null, 2));

    // Step 3: Create task results linked to this report (WITHOUT photos)
    const tasksWithReportId = taskResults.map(task => {
      const { photos, ...taskWithoutPhotos } = task;
      return {
        ...taskWithoutPhotos,
        reportId: report.id,
      };
    });

    console.log('[API] Creating task results...');
    console.log('[API] Number of tasks to create:', tasksWithReportId.length);
    console.log('[API] Sample task with reportId:', JSON.stringify(tasksWithReportId[0], null, 2));

    const savedTasks = await createTaskResults(tasksWithReportId);
    console.log('[API] Task results created:', savedTasks.length);

    // Step 4: VALIDATION - Verify tasks are actually linked to the report
    // Note: Airtable's linked record fields may take a moment to propagate
    console.log('[API] Validating task linking...');
    console.log('[API] Expected:', savedTasks.length, 'tasks');

    // Wait briefly for Airtable to propagate linked records
    await new Promise(resolve => setTimeout(resolve, 1000));

    let verifyTasks = await getTaskResults(report.id);
    console.log('[API] First validation query returned:', verifyTasks.length, 'tasks');

    // If not all tasks found, retry once after another delay
    if (verifyTasks.length < savedTasks.length) {
      console.log('[API] Not all tasks found, retrying after delay...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      verifyTasks = await getTaskResults(report.id);
      console.log('[API] Retry query returned:', verifyTasks.length, 'tasks');
    }

    // Validation: Check that ALL tasks were linked
    if (verifyTasks.length === 0) {
      console.error('[API] CRITICAL: Tasks created but ZERO linked!');
      console.error('[API] Report ID used:', report.id);
      console.error('[API] Sample saved task:', JSON.stringify(savedTasks[0], null, 2));
      console.error('[API] Tasks created:', savedTasks.length);
      throw new Error(`Task linking validation failed - ${savedTasks.length} tasks created but 0 found when querying. Check server logs for details.`);
    }

    if (verifyTasks.length !== savedTasks.length) {
      console.error('[API] WARNING: Partial task linking!');
      console.error('[API] Created:', savedTasks.length, 'tasks');
      console.error('[API] Found:', verifyTasks.length, 'tasks');
      console.error('[API] Missing:', savedTasks.length - verifyTasks.length, 'tasks');
      console.error('[API] This may be an Airtable propagation delay issue');
      throw new Error(`Task linking validation failed - Created ${savedTasks.length} tasks but only ${verifyTasks.length} found when querying. Airtable may need more time to propagate linked records.`);
    }

    console.log('[API] ✓ Validation passed:', verifyTasks.length, 'tasks successfully linked to report');

    // Step 5: Return success
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
