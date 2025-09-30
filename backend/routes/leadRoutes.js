const express = require('express');
const router = express.Router();
const { upload, uploadLeads } = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/leads/upload
// This route is protected and handles a single file upload with the field name 'file'
router.post('/upload', authMiddleware, upload.single('file'), uploadLeads);

module.exports = router;