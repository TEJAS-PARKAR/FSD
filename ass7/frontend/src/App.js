import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import StudentFeedback from './pages/StudentFeedback';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a35',
            color: '#f1f5f9',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/feedback" replace />} />
        <Route path="/feedback" element={<StudentFeedback />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
