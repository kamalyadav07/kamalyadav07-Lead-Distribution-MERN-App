const express = require('express');
const router = express.Router();
// Add getDistributedLeads to the import
const { upload, uploadLeads, getDistributedLeads } = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), uploadLeads);

// Add this new GET route
router.get('/', authMiddleware, getDistributedLeads);

module.exports = router;