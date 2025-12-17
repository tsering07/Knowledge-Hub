const express = require('express');
const router = express.Router();
const {
    getArticles,
    getMyArticles,
    getBookmarkedArticles,
    searchArticles,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    toggleLike,
    toggleBookmark,
    addComment,
    deleteComment,
    getAnalytics,
    getArticleStats,
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getArticles);
router.get('/search', searchArticles);

// Protected routes - must be before /:slug
router.get('/my', protect, getMyArticles);
router.get('/bookmarked', protect, getBookmarkedArticles);
router.get('/analytics', protect, getAnalytics);
router.get('/stats', protect, getArticleStats);

// Article by slug (public)
router.get('/:slug', getArticleBySlug);

// CRUD operations
router.post('/', protect, authorize('contributor', 'editor'), createArticle);
router.put('/:id', protect, authorize('contributor', 'editor'), updateArticle);
router.delete('/:id', protect, authorize('contributor', 'editor'), deleteArticle);

// Likes, Bookmarks, Comments
router.post('/:id/like', protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
