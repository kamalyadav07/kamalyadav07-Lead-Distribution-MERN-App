import api from './api'; // Import the centralized api instance

// Upload a new leads file
export const uploadLeads = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the name in the backend multer config

    const res = await api.post('/leads/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
};

// Fetch all distributed leads, grouped by agent
export const getDistributedLeads = async () => {
    const res = await api.get('/leads');
    return res.data;
};