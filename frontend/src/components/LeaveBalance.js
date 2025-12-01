import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveBalance = ({ user }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/leaves/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBalance(response.data.leaveBalance);
    } catch (error) {
      console.error('Failed to fetch leave balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="balance-card">
      <div className="balance-item">
        <h3>Casual Leave</h3>
        <div className="days">{balance?.casualLeave || 0}</div>
        <p>Days Available</p>
      </div>
      <div className="balance-item">
        <h3>Medical Leave</h3>
        <div className="days">{balance?.medicalLeave || 0}</div>
        <p>Days Available</p>
      </div>
    </div>
  );
};

export default LeaveBalance;