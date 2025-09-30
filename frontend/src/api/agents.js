import api from './api'; // Import our new api instance

// Function to fetch all agents
export const getAgents = async () => {
    const res = await api.get('/agents'); // Use api.get instead of axios.get
    return res.data;
};

// Function to create a new agent
export const createAgent = async (agentData) => {
    const res = await api.post('/agents', agentData); // Use api.post
    return res.data;
};