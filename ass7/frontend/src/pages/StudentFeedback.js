import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

const COURSES = [
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
  'Data Structures', 'Web Development', 'Machine Learning',
  'Database Management', 'Operating Systems', 'Computer Networks',
];

const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const defaultForm = {
  studentName: '',
  rollNo: '',
  email: '',
  course: '',
  facultyName: '',
  semester: '',
  rating: 0,
  teachingQuality: 0,
  courseContent: 0,
  communication: 0,
  comments: '',
};

const StudentFeedback = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate ratings
    if (!form.rating || !form.teachingQuality || !form.courseContent || !form.communication) {
      toast.error('Please fill in all star ratings');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/feedback', form);
      toast.success('Feedback submitted successfully! 🎉');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(defaultForm);
      }, 4000);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error('Failed to submit feedback. Is the server running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-badge">📝 Student Portal</div>
        <h1 className="page-title">
          Share Your <span>Learning Experience</span>
        </h1>
        <p className="page-subtitle">
          Your feedback helps us improve the quality of education. Be honest and constructive!
        </p>
      </div>

      {submitted && (
        <div className="success-banner">
          <div className="success-icon">🎉</div>
          <div className="success-text">
            Thank you! Your feedback has been submitted successfully.
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Form will reset in a moment...
          </p>
        </div>
      )}

      <div className="card" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <h3 className="section-title">👤 Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Student Name *</label>
              <input
                className="form-input"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="e.g. Tejas Parkar"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                className="form-input"
                name="rollNo"
                value={form.rollNo}
                onChange={handleChange}
                placeholder="e.g. 22CS101"
                required
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Email Address *</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. tejas@college.edu"
                required
              />
            </div>
          </div>

          <div style={{ height: '1.5rem' }} />

          {/* Course Info */}
          <h3 className="section-title">📚 Course & Faculty Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Course *</label>
              <select
                className="form-select"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester *</label>
              <select
                className="form-select"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div className="form-group full-width">
              <label className="form-label">Faculty Name *</label>
              <input
                className="form-input"
                name="facultyName"
                value={form.facultyName}
                onChange={handleChange}
                placeholder="e.g. Prof. Sharma"
                required
              />
            </div>
          </div>

          <div style={{ height: '1.5rem' }} />

          {/* Ratings */}
          <h3 className="section-title">⭐ Rate Your Experience</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.25rem',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '1rem',
            }}
          >
            <StarRating
              label="Overall Rating *"
              name="rating"
              value={form.rating}
              onChange={handleRating}
            />
            <StarRating
              label="Teaching Quality *"
              name="teachingQuality"
              value={form.teachingQuality}
              onChange={handleRating}
            />
            <StarRating
              label="Course Content *"
              name="courseContent"
              value={form.courseContent}
              onChange={handleRating}
            />
            <StarRating
              label="Communication *"
              name="communication"
              value={form.communication}
              onChange={handleRating}
            />
          </div>

          <div style={{ height: '1rem' }} />

          {/* Comments */}
          <h3 className="section-title">💬 Additional Comments</h3>
          <div className="form-group">
            <textarea
              className="form-textarea"
              name="comments"
              value={form.comments}
              onChange={handleChange}
              placeholder="Share your thoughts — what went well? What can be improved?"
              maxLength={1000}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {form.comments.length}/1000
            </span>
          </div>

          <div className="form-submit-section">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '180px', fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              {loading ? '⏳ Submitting...' : '🚀 Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFeedback;
