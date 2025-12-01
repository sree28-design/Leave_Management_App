import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import LeaveForm from './components/LeaveForm';
import LeaveList from './components/LeaveList';
import LeaveBalance from './components/LeaveBalance';

function App() {
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLeaveApplied = () => {
    // Trigger refresh of leave list
    setRefreshTrigger(prev => prev + 1);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Leave Management System</h1>
          <div className="nav-user">
            <span>Welcome, {user.username}</span>
            <span>({user.role})</span>
            <span>|</span>
            <span>{user.department}</span>
            <button 
              className="btn btn-primary" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <LeaveBalance user={user} />
        
        {user.role === 'employee' && (
          <LeaveForm 
            user={user} 
            onLeaveApplied={handleLeaveApplied} 
          />
        )}
        
        <LeaveList 
          user={user} 
          refreshTrigger={refreshTrigger} 
        />
      </div>
    </div>
  );
}

export default App;