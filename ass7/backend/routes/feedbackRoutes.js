const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route   POST /api/feedback
// @desc    Submit new feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const saved = await feedback.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { course, semester, minRating, maxRating } = req.query;
    const filter = {};

    if (course) filter.course = course;
    if (semester) filter.semester = semester;
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/feedback/stats
// @desc    Get statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();

    const avgStats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgTeaching: { $avg: '$teachingQuality' },
          avgContent: { $avg: '$courseContent' },
          avgCommunication: { $avg: '$communication' },
        },
      },
    ]);

    const ratingDistribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const courseWise = await Feedback.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalFeedbacks,
        averages: avgStats[0] || {},
        ratingDistribution,
        courseWise,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/feedback/:id
// @desc    Get single feedback
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin)
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback)
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
