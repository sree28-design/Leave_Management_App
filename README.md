# Leave Management System

A comprehensive leave management system built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows employees to apply for different types of leave and managers to approve/reject them.

## Features

### For Employees:
- Register and login to the system
- View available leave balance (Casual Leave and Medical Leave)
- Apply for different types of leave
- View history of leave applications
- Track status of applied leaves

### For Managers:
- All employee features
- View all leave applications from team members
- Approve or reject leave applications
- Add comments when rejecting leaves

### Leave Types:
- **Casual Leave**: 12 days per year
- **Medical Leave**: 10 days per year

## Technology Stack

- **Frontend**: React.js with vanilla CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v14 or higher)
2. **MongoDB** (Community Edition)
3. **npm** (comes with Node.js)

## Installation & Setup

### Method 1: Quick Start (Recommended)

1. **Clone or download** this project to your computer
2. **Start MongoDB** service on your system
3. **Double-click** `start.bat` in the project root directory
4. Wait for both servers to start and the browser to open automatically

### Method 2: Manual Setup

1. **Start MongoDB** service
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Frontend Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Usage

### First Time Setup:

1. **Register a Manager Account**:
   - Open http://localhost:3000
   - Click "Register"
   - Fill in details and select "Manager" as role
   - Login with your credentials

2. **Register Employee Accounts**:
   - Create additional accounts with "Employee" role
   - Each employee gets default leave balance:
     - Casual Leave: 12 days
     - Medical Leave: 10 days

### For Employees:

1. **Apply for Leave**:
   - Select leave type (Casual/Medical)
   - Choose start and end dates
   - Enter reason for leave
   - Submit application

2. **View Leave Status**:
   - Check your leave applications in "My Leave Applications"
   - See status: Pending, Approved, or Rejected

3. **Check Leave Balance**:
   - View available days for each leave type at the top of dashboard

### For Managers:

1. **Review Applications**:
   - See all employee leave applications
   - View employee details and leave history

2. **Approve/Reject Leaves**:
   - Click "Approve" or "Reject" buttons
   - Add comments when rejecting (optional)
   - Leave balance automatically updated when approved

## API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Leave Management:
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my-leaves` - Get user's leave applications
- `GET /api/leaves/all` - Get all leaves (managers only)
- `PUT /api/leaves/:id/status` - Update leave status (managers only)
- `GET /api/leaves/balance` - Get user's leave balance

## Database Schema

### User Model:
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'employee' | 'manager',
  department: String,
  leaveBalance: {
    casualLeave: Number (default: 12),
    medicalLeave: Number (default: 10)
  }
}
```

### Leave Model:
```javascript
{
  userId: ObjectId (ref: User),
  leaveType: 'casualLeave' | 'medicalLeave',
  startDate: Date,
  endDate: Date,
  days: Number,
  reason: String,
  status: 'pending' | 'approved' | 'rejected',
  appliedDate: Date,
  approvedBy: ObjectId (ref: User),
  comments: String
}
```

## Default Ports

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/leavemanagement

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Make sure MongoDB service is running
   - Check if MongoDB is installed and configured properly

2. **Port Already in Use**:
   - Kill processes using ports 3000 or 5000
   - Or modify port numbers in configuration files

3. **Dependencies Installation Failed**:
   - Delete `node_modules` folders
   - Run `npm install` again in both backend and frontend directories

4. **Frontend Can't Connect to Backend**:
   - Ensure backend server is running on port 5000
   - Check proxy setting in frontend package.json

### Reset Application:

To reset the application and clear all data:
1. Stop both servers
2. Connect to MongoDB and drop the `leavemanagement` database
3. Restart the application

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected API routes

## Future Enhancements

- Email notifications for leave applications
- Leave calendar view
- Multiple approval levels
- Leave carry-forward functionality
- Holiday management
- Reporting and analytics
- File attachment support for medical leaves

## Support

For any issues or questions, please check the troubleshooting section above or contact your system administrator.

---

**Note**: This is a demo application for learning purposes. For production use, additional security measures and features should be implemented.