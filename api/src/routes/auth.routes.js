const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, customerId, role) => {
  return jwt.sign({ id, customerId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      customerId: user.customerId,
      role: user.role,
      token: generateToken(user._id, user.customerId, user.role),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

module.exports = router;