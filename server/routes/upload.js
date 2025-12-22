const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const checkFileType = (file, cb) => {
    const filetypes = /pdf|doc|docx|txt|jpg|jpeg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/') || 
                     file.mimetype === 'application/pdf' || 
                     file.mimetype.includes('document') ||
                     file.mimetype === 'text/plain';

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb('Images and Docs only!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Upload file for articles
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create File record in DB
        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id,
        });
        await newFile.save();

        // Return file info
        res.json({
            url: `/${req.file.path.replace(/\\/g, '/')}`,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'File upload failed: ' + error.message });
    }
});

// Upload profile photo
router.post('/profile-photo', protect, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update user's profile photo
        const photoUrl = `/${req.file.path.replace(/\\/g, '/')}`;
        await User.findByIdAndUpdate(req.user._id, { profilePhoto: photoUrl });

        res.json({
            success: true,
            profilePhoto: photoUrl,
            message: 'Profile photo updated successfully'
        });
    } catch (error) {
        console.error('Profile Photo Upload Error:', error);
        res.status(500).json({ message: 'Profile photo upload failed: ' + error.message });
    }
});

// Get user profile (with photo)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { firstName, lastName, jobTitle, department, bio, phone, location } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, jobTitle, department, bio, phone, location },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
