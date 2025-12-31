// app/api/reports/[id]/upload-photo/route.js
// API endpoint to upload a single photo to a task result

import { uploadPhotoToTask } from '../../../../../lib/airtable-tuneup';
import { uploadBase64Image } from '../../../../../lib/cloudinary';

export async function POST(request, { params }) {
  try {
    const { id: reportId } = await params;
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

    // Step 1: Upload base64 image to Cloudinary to get public URL
    console.log('[API] Uploading to Cloudinary...');
    const publicUrl = await uploadBase64Image(photo.url, photo.filename);
    console.log('[API] Cloudinary upload successful:', publicUrl);

    // Step 2: Save public URL to Airtable
    const photoForAirtable = {
      url: publicUrl,
      filename: photo.filename,
    };

    const result = await uploadPhotoToTask(reportId, taskNumber, photoForAirtable);

    console.log(`[API] Photo saved to Airtable for task ${taskNumber}`);

    return Response.json({
      success: true,
      taskId: result.taskId,
      photoUrl: publicUrl,
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
