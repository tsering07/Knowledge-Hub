const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
router.get('/users', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
router.get('/stats', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalArticles = await Article.countDocuments();
        const publishedArticles = await Article.countDocuments({ status: 'published' });
        const draftArticles = await Article.countDocuments({ status: 'draft' });
        const totalQuestions = await Question.countDocuments();
        const solvedQuestions = await Question.countDocuments({ solved: true });

        // Users by role
        const viewers = await User.countDocuments({ role: 'viewer' });
        const contributors = await User.countDocuments({ role: 'contributor' });
        const editors = await User.countDocuments({ role: 'editor' });
        const admins = await User.countDocuments({ role: 'admin' });

        // Recent activity
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentArticles = await Article.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalArticles,
                publishedArticles,
                draftArticles,
                totalQuestions,
                solvedQuestions
            },
            usersByRole: {
                viewers,
                contributors,
                editors,
                admins
            },
            recentUsers,
            recentArticles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin only
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['viewer', 'contributor', 'editor', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent removing last admin
        if (user.role === 'admin' && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot remove the last admin' });
            }
        }

        user.role = role;
        await user.save();

        res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting self
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        // Prevent deleting last admin
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot delete the last admin' });
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete any article (admin)
// @route   DELETE /api/admin/articles/:id
// @access  Admin/Editor only
router.delete('/articles/:id', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
