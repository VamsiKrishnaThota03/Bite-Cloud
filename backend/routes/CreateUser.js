const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

router.post(
  '/createUser',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('location', 'Address is required').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { name, email, password, location } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, error: 'A user with this email already exists' });
      }
      const securePassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: securePassword, location });
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

router.post(
  '/loginuser',
  [
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const userData = await User.findOne({ email });
      const valid = userData && (await bcrypt.compare(password, userData.password));
      if (!valid) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }
      const authToken = jwt.sign({ user: { id: userData.id } }, jwtSecret, { expiresIn: '7d' });
      return res.json({ success: true, authToken });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

module.exports = router;
