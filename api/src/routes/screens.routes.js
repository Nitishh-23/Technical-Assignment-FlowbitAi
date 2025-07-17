const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const registry = require('../../registry.json');

// R3: Return the screens list for the logged-in tenant
router.get('/me/screens', protect, (req, res) => {
  const { customerId } = req.user;
  const tenantScreens = registry.filter(r => r.customerId === customerId);
  res.json(tenantScreens);
});

module.exports = router;