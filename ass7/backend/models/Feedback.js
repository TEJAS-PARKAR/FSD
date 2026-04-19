const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      enum: [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Computer Science',
        'Data Structures',
        'Web Development',
        'Machine Learning',
        'Database Management',
        'Operating Systems',
        'Computer Networks',
      ],
    },
    facultyName: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    teachingQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    courseContent: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    semester: {
      type: String,
      required: true,
      enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
