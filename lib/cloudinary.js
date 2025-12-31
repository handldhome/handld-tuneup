// lib/cloudinary.js
// Cloudinary upload helper for TuneUp photos

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 image to Cloudinary
 * @param {string} base64Data - Base64 data URL (e.g., "data:image/jpeg;base64,...")
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadBase64Image(base64Data, filename) {
  console.log('[Cloudinary] Uploading image:', filename);

  // Validate Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  try {
    // Clean filename for use as public_id
    const cleanFilename = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
    const timestamp = Date.now();
    const publicId = `${cleanFilename}-${timestamp}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'tuneup-photos',
      public_id: publicId,
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      resource_type: 'image',
      overwrite: false,
    });

    console.log('[Cloudinary] Upload successful');
    console.log('[Cloudinary] URL:', result.secure_url);
    console.log('[Cloudinary] Size:', result.bytes, 'bytes');

    return result.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Upload failed:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}
