const express = require('express');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Apply for leave
router.post('/apply', auth, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user._id;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check if user has enough leave balance
    const user = await User.findById(userId);
    if (user.leaveBalance[leaveType] < days) {
      return res.status(400).json({ 
        message: `Insufficient ${leaveType} balance. Available: ${user.leaveBalance[leaveType]} days` 
      });
    }

    // Create leave application
    const leave = new Leave({
      userId,
      leaveType,
      startDate: start,
      endDate: end,
      days,
      reason
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's leave applications
router.get('/my-leaves', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id })
      .populate('approvedBy', 'username')
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all leave applications (for managers)
router.get('/all', auth, requireManager, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('userId', 'username email department')
      .populate('approvedBy', 'username')
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject leave (for managers)
router.put('/:leaveId/status', auth, requireManager, async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, comments } = req.body;

    const leave = await Leave.findById(leaveId).populate('userId');
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave application already processed' });
    }

    // Update leave status
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.comments = comments;

    // If approved, deduct from user's leave balance
    if (status === 'approved') {
      const user = await User.findById(leave.userId._id);
      user.leaveBalance[leave.leaveType] -= leave.days;
      await user.save();
    }

    await leave.save();

    res.json({
      message: `Leave application ${status} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leave balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      leaveBalance: user.leaveBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;