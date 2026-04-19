import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FeedbackCard from '../components/FeedbackCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COURSES = [
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
  'Data Structures', 'Web Development', 'Machine Learning',
  'Database Management', 'Operating Systems', 'Computer Networks',
];

const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#7c3aed'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a35', border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem',
      }}>
        <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ course: '', semester: '', minRating: '' });

  const fetchFeedbacks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.course) params.append('course', filters.course);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.minRating) params.append('minRating', filters.minRating);
      const res = await axios.get(`/api/feedback?${params.toString()}`);
      setFeedbacks(res.data.data);
    } catch {
      toast.error('Failed to load feedbacks');
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/feedback/stats');
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load statistics');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFeedbacks(), fetchStats()]);
      setLoading(false);
    };
    init();
  }, [fetchFeedbacks]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    fetchStats();
  };

  const avgRating = stats?.averages?.avgRating;

  // Pie chart data for rating distribution
  const pieData = stats?.ratingDistribution?.map((r) => ({
    name: `${r._id} Star${r._id > 1 ? 's' : ''}`,
    value: r.count,
  })) || [];

  // Bar chart data for course-wise
  const barData = stats?.courseWise?.slice(0, 6).map((c) => ({
    name: c._id.length > 12 ? c._id.slice(0, 12) + '…' : c._id,
    Feedbacks: c.count,
    'Avg Rating': parseFloat(c.avgRating.toFixed(2)),
  })) || [];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-badge">📊 Admin Panel</div>
        <h1 className="page-title">
          Feedback <span>Analytics Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Monitor student feedback, track performance metrics, and manage responses in real time.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.12)' }}>📋</div>
              <div className="stat-value" style={{ color: '#a855f7' }}>{stats?.totalFeedbacks ?? 0}</div>
              <div className="stat-label">Total Feedbacks</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>⭐</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                {avgRating ? avgRating.toFixed(1) : '—'}
              </div>
              <div className="stat-label">Avg Overall Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>🎓</div>
              <div className="stat-value" style={{ color: '#22d3ee' }}>
                {stats?.averages?.avgTeaching ? stats.averages.avgTeaching.toFixed(1) : '—'}
              </div>
              <div className="stat-label">Avg Teaching Quality</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>📡</div>
              <div className="stat-value" style={{ color: '#f59e0b' }}>
                {stats?.averages?.avgCommunication ? stats.averages.avgCommunication.toFixed(1) : '—'}
              </div>
              <div className="stat-label">Avg Communication</div>
            </div>
          </div>

          {/* Charts */}
          {stats?.totalFeedbacks > 0 && (
            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title">📈 Course-wise Feedback Count</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Feedbacks" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">🍩 Rating Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '0.78rem', color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">📊 Course Avg Ratings</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Avg Rating" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="filter-bar">
            <select
              className="form-select"
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
            >
              <option value="">All Courses</option>
              {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="form-select"
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            <select
              className="form-select"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Only</option>
              <option value="4">⭐⭐⭐⭐+ (4 & above)</option>
              <option value="3">⭐⭐⭐+ (3 & above)</option>
              <option value="1">⭐ 1 Star Only</option>
            </select>
            <button className="btn btn-outline" onClick={fetchFeedbacks} style={{ flexShrink: 0 }}>
              🔍 Filter
            </button>
          </div>

          {/* Feedback List */}
          <h2 className="section-title">
            📋 All Feedback <span>({feedbacks.length} entries)</span>
          </h2>

          {feedbacks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗂️</div>
              <div className="empty-title">No feedback found</div>
              <p>Try adjusting filters or check back after students submit feedback.</p>
            </div>
          ) : (
            <div className="feedback-grid">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb._id} feedback={fb} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
