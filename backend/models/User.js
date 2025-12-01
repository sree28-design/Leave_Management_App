const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'manager'],
    default: 'employee'
  },
  department: {
    type: String,
    required: true
  },
  leaveBalance: {
    casualLeave: {
      type: Number,
      default: 12
    },
    medicalLeave: {
      type: Number,
      default: 10
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);