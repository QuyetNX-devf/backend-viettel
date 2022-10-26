const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

// @router GET api/profile
// @desc GET profile
// @access Private
router.get('/', verifyToken, async (req, res) => {
  console.log(req.userId + 'userId');
  try {
    const profile = await User.findOne({ _id: req.userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'user notfound ...',
      });
    }
    res.json({
      success: true,
      profile: {
        address: profile.address || '',
        phone: profile.phone || '',
        position: profile.position || '',
        username: profile.username || '',
        email: profile.email || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'internal server error' });
  }
});

module.exports = router;
