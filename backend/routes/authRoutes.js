const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/auth'); // To protect password update

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/reset-password', authController.resetPassword);
router.get('/google', authController.googleLogin);

// Update password requires being logged in (via the reset token)
router.post('/update-password', requireAuth, authController.updatePassword);

module.exports = router;