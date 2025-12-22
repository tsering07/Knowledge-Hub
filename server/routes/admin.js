const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
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

// @desc    Get users by role
// @route   GET /api/admin/users/role/:role
// @access  Admin only
router.get('/users/role/:role', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });
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

        // Get users lists by role
        const viewersList = await User.find({ role: 'viewer' })
            .select('username email createdAt')
            .sort({ createdAt: -1 });
        
        const contributorsList = await User.find({ role: 'contributor' })
            .select('username email createdAt')
            .sort({ createdAt: -1 });

        // Recent activity
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentArticles = await Article.find()
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Recently edited articles (articles with version history)
        const recentlyEditedArticles = await Article.find({ 'versions.0': { $exists: true } })
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ updatedAt: -1 })
            .limit(10);

        // Total views across all articles
        const totalViews = await Article.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalArticles,
                publishedArticles,
                draftArticles,
                totalQuestions,
                solvedQuestions,
                totalViews: totalViews[0]?.total || 0
            },
            usersByRole: {
                viewers,
                contributors,
                editors,
                admins
            },
            viewersList,
            contributorsList,
            recentUsers,
            recentArticles,
            recentlyEditedArticles
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

        // Create notification for role change
        await Notification.create({
            recipient: user._id,
            type: 'role_change',
            message: `Your role has been changed to ${role}. Your permissions have been updated.`
        });

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

// @desc    Get all articles (admin)
// @route   GET /api/admin/articles
// @access  Admin/Editor only
router.get('/articles', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'username email')
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update article status (publish/unpublish)
// @route   PUT /api/admin/articles/:id/status
// @access  Admin/Editor only
router.put('/articles/:id/status', protect, authorize('admin', 'editor'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['published', 'draft'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.status = status;
        await article.save();

        res.json({ message: `Article ${status === 'published' ? 'published' : 'unpublished'} successfully`, article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
