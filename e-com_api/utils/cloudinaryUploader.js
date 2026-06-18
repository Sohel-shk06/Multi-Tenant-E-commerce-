import cloudinary from '../config/cloudinary.js';

/**
 * Single image upload to Cloudinary
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `multi-tenant-ecommerce/${folder}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Multiple images upload to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, folder = 'products') => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => 
    uploadToCloudinary(file.buffer || file, folder)
  );
  
  return await Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Deleted from Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
  }
};