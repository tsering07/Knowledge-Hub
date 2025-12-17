const Article = require('../models/Article');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({ status: 'published' })
            .populate('author', 'username')
            .populate('category', 'name icon')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own articles (drafts + published)
// @route   GET /api/articles/my
// @access  Private
const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user._id })
            .populate('author', 'username')
            .populate('category', 'name icon')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookmarked articles
// @route   GET /api/articles/bookmarked
// @access  Private
const getBookmarkedArticles = async (req, res) => {
    try {
        const articles = await Article.find({ bookmarks: req.user._id, status: 'published' })
            .populate('author', 'username')
            .populate('category', 'name icon')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search articles
// @route   GET /api/articles/search
// @access  Public
const searchArticles = async (req, res) => {
    const { q } = req.query;
    try {
        // MongoDB Text Search
        const articles = await Article.find(
            { $text: { $search: q }, status: 'published' },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .populate('author', 'username')
            .populate('category', 'name icon');

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate('author', 'username')
            .populate('category', 'name icon')
            .populate('versions.editor', 'username');

        if (article) {
            // Increment views
            article.views += 1;
            await article.save();
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private (Contributor/Editor)
const createArticle = async (req, res) => {
    const { title, content, tags, category, slug } = req.body;

    try {
        const newArticle = new Article({
            title,
            slug,
            content,
            tags,
            category,
            author: req.user._id,
            status: 'published', // Simplified for now, can be 'draft'
        });

        const createdArticle = await newArticle.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Author/Editor)
const updateArticle = async (req, res) => {
    const { title, content, tags, category, status } = req.body;

    try {
        const article = await Article.findById(req.params.id);

        if (article) {
            // Check permission: Owner or Editor
            if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'editor') {
                return res.status(403).json({ message: 'Not authorized to edit this article' });
            }

            // Add current content to versions history before updating
            article.versions.push({
                content: article.content,
                updatedAt: Date.now(),
                editor: req.user._id
            });

            article.title = title || article.title;
            article.content = content || article.content;
            article.tags = tags || article.tags;
            article.category = category || article.category;
            article.status = status || article.status;

            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin/Editor)
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (article) {
            // Check permission: Owner or Editor
            if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'editor') {
                return res.status(403).json({ message: 'Not authorized to delete this article' });
            }

            await article.deleteOne();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike article
// @route   POST /api/articles/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const index = article.likes.indexOf(req.user._id);
        if (index === -1) {
            article.likes.push(req.user._id);
        } else {
            article.likes.splice(index, 1);
        }

        await article.save();
        res.json({ likes: article.likes.length, liked: index === -1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bookmark/Unbookmark article
// @route   POST /api/articles/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const index = article.bookmarks.indexOf(req.user._id);
        if (index === -1) {
            article.bookmarks.push(req.user._id);
        } else {
            article.bookmarks.splice(index, 1);
        }

        await article.save();
        res.json({ bookmarked: index === -1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to article
// @route   POST /api/articles/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.comments.push({
            user: req.user._id,
            content: req.body.content
        });

        await article.save();
        
        const updatedArticle = await Article.findById(req.params.id)
            .populate('comments.user', 'username');
        
        res.json(updatedArticle.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/articles/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const comment = article.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'editor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        comment.deleteOne();
        await article.save();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user analytics
// @route   GET /api/articles/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get user's articles
        const articles = await Article.find({ author: userId })
            .populate('category', 'name')
            .sort({ views: -1 });

        // Calculate stats
        const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalLikes = articles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);
        const totalComments = articles.reduce((sum, a) => sum + (a.comments?.length || 0), 0);
        const totalBookmarks = articles.reduce((sum, a) => sum + (a.bookmarks?.length || 0), 0);
        const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : 0;

        // Category distribution
        const categoryStats = {};
        articles.forEach(article => {
            const catName = article.category?.name || 'Uncategorized';
            if (!categoryStats[catName]) {
                categoryStats[catName] = { views: 0, articles: 0 };
            }
            categoryStats[catName].views += article.views || 0;
            categoryStats[catName].articles += 1;
        });

        // Generate daily views data (simulated based on total views distribution)
        const dailyViews = [];
        const daysCount = parseInt(days);
        for (let i = 0; i < Math.min(daysCount, 30); i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            // Distribute views across days with some variance
            const baseViews = Math.floor(totalViews / daysCount);
            const variance = Math.floor(baseViews * 0.3 * (Math.random() - 0.5));
            dailyViews.unshift({
                date: date.toISOString().split('T')[0],
                views: Math.max(0, baseViews + variance),
                visitors: Math.max(0, Math.floor((baseViews + variance) * 0.7))
            });
        }

        res.json({
            stats: {
                totalViews,
                totalLikes,
                totalComments,
                totalBookmarks,
                engagementRate,
                totalArticles: articles.length,
                publishedArticles: articles.filter(a => a.status === 'published').length
            },
            topArticles: articles.slice(0, 10).map(a => ({
                _id: a._id,
                title: a.title,
                slug: a.slug,
                views: a.views || 0,
                likes: a.likes?.length || 0,
                comments: a.comments?.length || 0,
                category: a.category?.name || 'Uncategorized',
                createdAt: a.createdAt,
                content: a.content
            })),
            categoryStats: Object.entries(categoryStats).map(([name, data]) => ({
                name,
                views: data.views,
                articles: data.articles,
                percentage: totalViews > 0 ? Math.round((data.views / totalViews) * 100) : 0
            })).sort((a, b) => b.views - a.views),
            dailyViews
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all articles stats (admin)
// @route   GET /api/articles/stats
// @access  Private
const getArticleStats = async (req, res) => {
    try {
        const totalArticles = await Article.countDocuments();
        const publishedArticles = await Article.countDocuments({ status: 'published' });
        const draftArticles = await Article.countDocuments({ status: 'draft' });
        
        const articles = await Article.find();
        const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalLikes = articles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);

        res.json({
            totalArticles,
            publishedArticles,
            draftArticles,
            totalViews,
            totalLikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
