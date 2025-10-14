const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createContestant, listContestants } = require('../controllers/contestantController');

const upload = multer({ dest: path.join(process.cwd(), 'server', 'uploads') });

router.get('/', listContestants);
router.post('/', authenticate('admin'), upload.single('image'), createContestant);

module.exports = router;

