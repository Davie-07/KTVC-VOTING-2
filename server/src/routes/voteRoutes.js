const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { castVote, getLiveResults } = require('../controllers/voteController');

router.post('/', authenticate('student'), castVote);
router.get('/live', getLiveResults);

module.exports = router;

