// app/api/health-check/[recordId]/upload-photo/route.js
// API endpoint to upload a photo to a health check item

import { uploadPhotoToHealthCheckItem } from '../../../../../lib/healthCheck'
import { uploadBase64Image } from '../../../../../lib/cloudinary'

export async function POST(request, { params }) {
  try {
    const { recordId } = await params
    const body = await request.json()
    const { itemNumber, photo } = body

    console.log(`[HealthCheck API] Uploading photo for report ${recordId}, item ${itemNumber}`)

    if (!itemNumber) {
      return Response.json(
        { error: 'Missing item number' },
        { status: 400 }
      )
    }

    if (!photo || !photo.url) {
      return Response.json(
        { error: 'Missing photo data' },
        { status: 400 }
      )
    }

    // Upload base64 image to Cloudinary
    console.log('[HealthCheck API] Uploading to Cloudinary...')
    const publicUrl = await uploadBase64Image(photo.url, photo.filename || 'health-check-photo')
    console.log('[HealthCheck API] Cloudinary upload successful:', publicUrl)

    // Save to health_check_items
    const result = await uploadPhotoToHealthCheckItem(recordId, itemNumber, {
      url: publicUrl,
      filename: `CLOUDINARY_URL:${publicUrl}`,
    })

    console.log(`[HealthCheck API] Photo saved for item ${itemNumber}`)

    return Response.json({
      success: true,
      itemId: result.itemId,
      photoUrl: publicUrl,
    })

  } catch (error) {
    console.error('[HealthCheck API] Error uploading photo:', error)
    return Response.json(
      { error: 'Failed to upload photo', details: error.message },
      { status: 500 }
    )
  }
}
