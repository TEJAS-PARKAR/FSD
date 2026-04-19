import React, { useState } from 'react';

const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const StarRating = ({ label, value, onChange, name }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating-group">
      <span className="star-rating-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hovered || value) ? 'active' : ''}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(name, star)}
              role="button"
              aria-label={`Rate ${star} out of 5`}
            >
              ⭐
            </span>
          ))}
        </div>
        {(hovered || value) > 0 && (
          <span className="star-value">{STAR_LABELS[hovered || value]}</span>
        )}
      </div>
    </div>
  );
};

export default StarRating;
