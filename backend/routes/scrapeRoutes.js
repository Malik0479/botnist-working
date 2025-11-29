const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const checkLimits = require('../middleware/checkLimits');
const scrapeController = require('../controllers/scrapeController');

// 1. CREATE & START (Saves to DB automatically)
router.post('/start', requireAuth, checkLimits, scrapeController.scrapeUrl);

// 2. READ (History)
router.get('/history', requireAuth, scrapeController.getHistory);
router.get('/job/:hash', requireAuth, scrapeController.getJobDetails);

// 3. DELETE (New!)
router.delete('/bot/:hash', requireAuth, scrapeController.deleteBot);

module.exports = router;