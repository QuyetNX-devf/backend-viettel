const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

//@router POST api/auth/register
//@desc Register user
//@access Public

router.post('/register', async (req, res) => {
  const { username, password, address, phone, position, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing Username and/or password' });
  }
  try {
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'Username already taken' });
    const hashedPassWord = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassWord,
      address,
      phone,
      position,
      email,
    });
    await newUser.save();

    // return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: 'user created successfully',
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server error' });
  }
});

//@router POST api/auth/register
//@desc Register user
//@access Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email | !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing email and/or password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Sai email hoặc mật khẩu' });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: 'Sai email hoặc mật khẩu' });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Lỗi server, hoặc đang bảo trì !' });
  }
});

module.exports = router;
