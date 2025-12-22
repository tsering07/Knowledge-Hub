const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['comment', 'comment_reply', 'like', 'helpful_yes', 'helpful_no', 'role_change', 'article_edit', 'new_article', 'question_answer'],
        required: true,
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
