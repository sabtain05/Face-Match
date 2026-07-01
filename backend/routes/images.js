const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + ext);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload single image (for site owner)
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Get the URL path for the uploaded image
        const imageUrl = `/uploads/${req.file.filename}`;

        // Insert image record into database
        const [result] = await db.query(
            'INSERT INTO images (image_url) VALUES (?)',
            [imageUrl]
        );

        res.status(201).json({ 
            message: 'Image uploaded successfully',
            image: {
                id: result.insertId,
                url: imageUrl
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Get all images (for management)
router.get('/', async (req, res) => {
    try {
        const [images] = await db.query(
            'SELECT id, image_url, created_at FROM images ORDER BY created_at DESC'
        );
        res.json(images);
    } catch (error) {
        console.error('Fetch images error:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Delete image (for site owner)
router.delete('/:id', async (req, res) => {
    try {
        const imageId = req.params.id;

        // Get image info first
        const [images] = await db.query(
            'SELECT image_url FROM images WHERE id = ?',
            [imageId]
        );

        if (images.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete from database
        await db.query('DELETE FROM images WHERE id = ?', [imageId]);

        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', images[0].image_url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;