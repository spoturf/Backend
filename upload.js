import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'turf_profiles',  // Set a folder in Cloudinary
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    // Return the uploaded image URL
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
