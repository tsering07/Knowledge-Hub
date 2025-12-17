const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    content: {
        type: String, // HTML content
        required: true,
    },
    tags: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    // NEW: Likes system
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // NEW: Bookmarks (users who bookmarked this)
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // NEW: Comments
    comments: [commentSchema],
    versions: [{
        content: String,
        updatedAt: Date,
        editor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }],
}, {
    timestamps: true,
});

// Text Index for Search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
