const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents } = require('../controllers/agentController');
const authMiddleware = require('../middleware/authMiddleware');

// We apply the authMiddleware to all routes in this file.
// Any request to /api/agents/... must have a valid token.
router.use(authMiddleware);

// Route to create a new agent
router.post('/', createAgent);

// Route to get all agents
router.get('/', getAllAgents);

module.exports = router;