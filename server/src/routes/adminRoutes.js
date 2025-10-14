const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { openVoting, closeVoting, endVoting, scheduleVoting, getSettings, clearScheduleMessage } = require('../controllers/adminController');

router.get('/settings', getSettings);
router.post('/open', authenticate('admin'), openVoting);
router.post('/close', authenticate('admin'), closeVoting);
router.post('/end', authenticate('admin'), endVoting);
router.post('/schedule', authenticate('admin'), scheduleVoting);
router.delete('/schedule-message', authenticate('admin'), clearScheduleMessage);

module.exports = router;

