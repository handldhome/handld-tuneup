// lib/cloudinary.js
// Cloudinary upload configuration and helpers for TuneUp photos

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 image to Cloudinary
 * @param {string} base64Data - Base64 data URL (e.g., "data:image/jpeg;base64,...")
 * @param {string} filename - Original filename (used for public_id)
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadBase64Image(base64Data, filename) {
  console.log('[Cloudinary] Uploading image:', filename);

  // Validate configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  try {
    // Extract just the filename without extension for cleaner public_id
    const cleanFilename = filename.replace(/\.[^/.]+$/, '');
    const timestamp = Date.now();
    const publicId = `${cleanFilename}-${timestamp}`;

    // Upload to Cloudinary with transformations
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'tuneup-photos',
      public_id: publicId,
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' }, // Max dimensions
        { quality: 'auto' }, // Auto quality optimization
        { fetch_format: 'auto' } // Auto format selection (WebP, etc.)
      ],
      // Additional options
      resource_type: 'image',
      overwrite: false,
    });

    console.log('[Cloudinary] Upload successful:', result.secure_url);
    console.log('[Cloudinary] Image size:', result.bytes, 'bytes');
    console.log('[Cloudinary] Format:', result.format);

    return result.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Upload failed:', error);
    console.error('[Cloudinary] Error details:', error.message);

    // Provide helpful error messages
    if (error.message?.includes('Invalid image file')) {
      throw new Error('Invalid image format. Please use JPEG, PNG, or WebP.');
    }
    if (error.message?.includes('File size too large')) {
      throw new Error('Image file size too large. Please compress the image before uploading.');
    }

    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicUrl - The public URL of the image to delete
 * @returns {Promise<void>}
 */
export async function deleteImage(publicUrl) {
  try {
    // Extract public_id from URL
    const urlParts = publicUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `tuneup-photos/${filename.split('.')[0]}`;

    console.log('[Cloudinary] Deleting image:', publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    console.log('[Cloudinary] Delete result:', result.result);
  } catch (error) {
    console.error('[Cloudinary] Delete failed:', error);
    // Don't throw - deletion failures shouldn't block other operations
  }
}
