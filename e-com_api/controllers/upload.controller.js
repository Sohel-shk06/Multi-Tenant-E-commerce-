import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/helpers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const uploadToCloudinary = (fileBuffer, folder = 'marketplace/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadImages = asyncHandler(async (req, res) => {
  // If single file uploaded (e.g. req.file)
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    return res.status(200).json(new ApiResponse(200, result, 'Image uploaded successfully'));
  }

  // If multiple files uploaded (e.g. req.files)
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);
    return res.status(200).json(new ApiResponse(200, results, 'Images uploaded successfully'));
  }

  throw new ApiError(400, 'No image file provided');
});
