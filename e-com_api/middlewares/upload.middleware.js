import multer from 'multer';

// Memory storage - Cloudinary par direct upload karenge
const storage = multer.memoryStorage();

// File filter - sirf images allow karein
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Product images upload (max 10 images, 5MB each)
export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB per image
    files: 10 // Max 10 images
  }
}).array('images', 10);

// Single image upload
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
}).single('image');