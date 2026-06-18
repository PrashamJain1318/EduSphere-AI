import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Ensure local uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.mp4', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs, images, and videos are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Configure Cloudinary if credentials exist
let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
}

/**
 * Uploads a local file to Cloudinary, or returns local path if not configured
 * @param {string} localFilePath 
 * @param {string} resourceType - 'raw' for PDFs, 'image' for images, 'video' for videos
 * @returns {Promise<string>} Url of the file
 */
export const uploadToCloudinary = async (localFilePath, resourceType = 'auto') => {
  if (!localFilePath) return '';
  
  if (!isCloudinaryConfigured) {
    // Return standard server static URL path
    // e.g. /uploads/filename.ext
    const normalizedPath = localFilePath.replace(/\\/g, '/');
    return normalizedPath.startsWith('./') ? normalizedPath.substring(1) : '/' + normalizedPath;
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: 'edusphere',
    });
    // Remove local file after successful Cloudinary upload
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error('Failed to delete local temp file:', err);
    }
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Failed, using local file instead:', error);
    const normalizedPath = localFilePath.replace(/\\/g, '/');
    return normalizedPath.startsWith('./') ? normalizedPath.substring(1) : '/' + normalizedPath;
  }
};
