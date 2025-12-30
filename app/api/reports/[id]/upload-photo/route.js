// app/api/reports/[id]/upload-photo/route.js
// API endpoint to upload a single photo to a task result

import { uploadPhotoToTask } from '../../../../../lib/airtable-tuneup';

export async function POST(request, { params }) {
  try {
    const { id: reportId } = params;
    const body = await request.json();
    const { taskNumber, photo } = body;

    console.log(`[API] Uploading photo for report ${reportId}, task ${taskNumber}`);

    // Validate required fields
    if (!taskNumber) {
      return Response.json(
        { error: 'Missing task number' },
        { status: 400 }
      );
    }

    if (!photo || !photo.url) {
      return Response.json(
        { error: 'Missing photo data' },
        { status: 400 }
      );
    }

    // Upload the photo to the task result
    const result = await uploadPhotoToTask(reportId, taskNumber, photo);

    console.log(`[API] Photo uploaded successfully for task ${taskNumber}`);

    return Response.json({
      success: true,
      taskId: result.taskId,
    });

  } catch (error) {
    console.error('[API] Error uploading photo:', error);
    console.error('[API] Error stack:', error.stack);
    return Response.json(
      {
        error: 'Failed to upload photo',
        details: error.message
      },
      { status: 500 }
    );
  }
}
