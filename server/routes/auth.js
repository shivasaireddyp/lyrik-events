const express = require('express');
const { registerUser, loginUser, verifyEmail, resendVerification } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post("/resend-verification", resendVerification);

router.get('/me', protect, (req, res) => { 
  res.json(req.user);
});

module.exports = router;