const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createContestant, listContestants, updateContestant, deleteContestant } = require('../controllers/contestantController');

const upload = multer({ dest: path.join(process.cwd(), 'server', 'uploads') });

router.get('/', listContestants);
router.post('/', authenticate('admin'), upload.single('image'), createContestant);
router.put('/:id', authenticate('admin'), upload.single('image'), updateContestant);
router.delete('/:id', authenticate('admin'), deleteContestant);

module.exports = router;

