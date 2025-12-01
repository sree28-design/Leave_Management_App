import React, { useState } from 'react';
import axios from 'axios';

const LeaveForm = ({ user, onLeaveApplied }) => {
  const [formData, setFormData] = useState({
    leaveType: 'casualLeave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/leaves/apply', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Leave application submitted successfully!');
      setFormData({
        leaveType: 'casualLeave',
        startDate: '',
        endDate: '',
        reason: ''
      });
      
      if (onLeaveApplied) {
        onLeaveApplied();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const days = calculateDays();
  const availableDays = user?.leaveBalance?.[formData.leaveType] || 0;

  return (
    <div className="card">
      <h3>Apply for Leave</h3>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type</label>
          <select
            name="leaveType"
            className="form-control"
            value={formData.leaveType}
            onChange={handleChange}
            required
          >
            <option value="casualLeave">Casual Leave</option>
            <option value="medicalLeave">Medical Leave</option>
          </select>
          <small style={{ color: '#666' }}>
            Available: {availableDays} days
          </small>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate}
            required
          />
        </div>

        {days > 0 && (
          <div className="form-group">
            <strong>Total Days: {days}</strong>
            {days > availableDays && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                Insufficient leave balance!
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label>Reason</label>
          <textarea
            name="reason"
            className="form-control"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            placeholder="Enter reason for leave..."
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || days > availableDays || days <= 0}
        >
          {loading ? 'Submitting...' : 'Apply for Leave'}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;