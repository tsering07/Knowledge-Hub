const express = require('express');
const router = express.Router();
const { getQuestions, getQuestionById, createQuestion, addAnswer } = require('../controllers/qaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, createQuestion);
router.post('/:id/answers', protect, addAnswer);

module.exports = router;
