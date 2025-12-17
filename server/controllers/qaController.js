const Question = require('../models/Question');

// @desc    Get questions
// @route   GET /api/qa
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({})
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single question
// @route   GET /api/qa/:id
// @access  Public
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'username')
            .populate('answers.author', 'username');

        if (question) {
            question.views += 1;
            await question.save();
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create question
// @route   POST /api/qa
// @access  Private
const createQuestion = async (req, res) => {
    const { title, body, tags } = req.body;

    try {
        const question = new Question({
            title,
            body,
            tags,
            author: req.user._id,
        });

        const createdQuestion = await question.save();
        res.status(201).json(createdQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Add answer
// @route   POST /api/qa/:id/answers
// @access  Private
const addAnswer = async (req, res) => {
    const { content } = req.body;

    try {
        const question = await Question.findById(req.params.id);

        if (question) {
            const answer = {
                content,
                author: req.user._id,
            };

            question.answers.push(answer);
            await question.save();
            res.status(201).json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getQuestions, getQuestionById, createQuestion, addAnswer };
