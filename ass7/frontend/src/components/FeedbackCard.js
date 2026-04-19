import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const getRatingClass = (rating) => {
  if (rating >= 4) return 'high';
  if (rating >= 3) return 'mid';
  return 'low';
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const renderStars = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

const FeedbackCard = ({ feedback, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await axios.delete(`/api/feedback/${feedback._id}`);
      toast.success('Feedback deleted');
      onDelete(feedback._id);
    } catch {
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <div className="feedback-student-info">
          <div className="student-avatar">{getInitials(feedback.studentName)}</div>
          <div>
            <div className="student-name">{feedback.studentName}</div>
            <div className="student-meta">
              {feedback.rollNo} · {feedback.email}
            </div>
          </div>
        </div>
        <div className="feedback-rating-display">
          <span className={`rating-badge ${getRatingClass(feedback.rating)}`}>
            ★ {feedback.rating}/5
          </span>
        </div>
      </div>

      <div className="feedback-tags">
        <span className="tag tag-course">{feedback.course}</span>
        <span className="tag tag-semester">Sem {feedback.semester}</span>
        <span className="tag tag-course" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.2)' }}>
          👨‍🏫 {feedback.facultyName}
        </span>
      </div>

      <div className="feedback-sub-ratings">
        <div className="sub-rating-item">
          <div className="sub-rating-label">Teaching</div>
          <div className="sub-rating-value">{'★'.repeat(feedback.teachingQuality)}</div>
        </div>
        <div className="sub-rating-item">
          <div className="sub-rating-label">Content</div>
          <div className="sub-rating-value">{'★'.repeat(feedback.courseContent)}</div>
        </div>
        <div className="sub-rating-item">
          <div className="sub-rating-label">Communication</div>
          <div className="sub-rating-value">{'★'.repeat(feedback.communication)}</div>
        </div>
      </div>

      {feedback.comments && (
        <div className="feedback-comment">"{feedback.comments}"</div>
      )}

      <div className="feedback-card-footer">
        <span className="feedback-date">📅 {formatDate(feedback.createdAt)}</span>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
