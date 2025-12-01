import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveList = ({ user, refreshTrigger }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [refreshTrigger]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      const endpoint = user.role === 'manager' ? '/api/leaves/all' : '/api/leaves/my-leaves';
      
      console.log('Fetching leaves from:', endpoint);
      console.log('Token exists:', !!token);
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLeaves(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching leaves:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Optionally clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.response?.status === 403) {
        setError('Access denied. Insufficient permissions.');
      } else {
        setError(`Failed to fetch leave applications: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status, comments = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/leaves/${leaveId}/status`, 
        { status, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the list
      fetchLeaves();
    } catch (error) {
      setError('Failed to update leave status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card">
      <h3>{user.role === 'manager' ? 'All Leave Applications' : 'My Leave Applications'}</h3>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {leaves.length === 0 ? (
        <p>No leave applications found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {user.role === 'manager' && <th>Employee</th>}
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied Date</th>
              {user.role === 'manager' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                {user.role === 'manager' && (
                  <td>
                    <div>
                      <strong>{leave.userId?.username}</strong>
                      <br />
                      <small>{leave.userId?.department}</small>
                    </div>
                  </td>
                )}
                <td>
                  {leave.leaveType === 'casualLeave' ? 'Casual Leave' : 'Medical Leave'}
                </td>
                <td>{formatDate(leave.startDate)}</td>
                <td>{formatDate(leave.endDate)}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={getStatusClass(leave.status)}>
                    {leave.status.toUpperCase()}
                  </span>
                </td>
                <td>{formatDate(leave.appliedDate)}</td>
                {user.role === 'manager' && (
                  <td>
                    {leave.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-success"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                          onClick={() => handleStatusUpdate(leave._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                          onClick={() => {
                            const comments = prompt('Reason for rejection (optional):');
                            handleStatusUpdate(leave._id, 'rejected', comments || '');
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {leave.status !== 'pending' && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {leave.status === 'approved' ? 'Approved' : 'Rejected'}
                        {leave.approvedBy && (
                          <>
                            <br />
                            <small>by {leave.approvedBy.username}</small>
                          </>
                        )}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveList;