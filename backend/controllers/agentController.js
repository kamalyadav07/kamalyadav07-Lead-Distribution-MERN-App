const Agent = require('../models/Agent');

// Create a new agent
exports.createAgent = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const agentExists = await Agent.findOne({ email });

        if (agentExists) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        const agent = new Agent({ name, email, mobile, password });
        await agent.save();

        res.status(201).json({
            message: 'Agent created successfully',
            agent: { id: agent._id, name: agent.name, email: agent.email }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.find().select('-password');
        res.status(200).json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};