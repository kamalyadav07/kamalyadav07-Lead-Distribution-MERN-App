import axios from 'axios';

export const uploadLeads = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the name in the backend multer config

    const res = await axios.post('/api/leads/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
};