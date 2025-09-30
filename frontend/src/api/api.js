import axios from 'axios';

// Create a new axios instance
const api = axios.create({
    baseURL: '/api', // The proxy will handle redirecting this to http://localhost:5000/api
});

/* Add a request interceptor to the axios instance.
  This function will be called before every request is sent.
*/
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // If a token exists, add it to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; // Return the modified config
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default api;