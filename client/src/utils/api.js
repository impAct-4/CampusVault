import axios from 'axios';
import { auth } from '../config/firebase';
// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add a request interceptor to attach Firebase JWT token
api.interceptors.request.use(async (config) => {
    try {
        // Get the current user
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Get the Firebase ID token
            const token = await currentUser.getIdToken();
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    catch (error) {
        console.error('Error getting Firebase token:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Add a response interceptor to handle errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
        // Unauthorized - user's token is invalid or expired
        console.error('Unauthorized access. Please log in again.');
        // You might want to redirect to login here
    }
    else if (error.response?.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden.');
    }
    else if (error.response?.status === 404) {
        // Not found
        console.error('Resource not found.');
    }
    else if (error.response?.status >= 500) {
        // Server error
        console.error('Server error occurred.');
    }
    return Promise.reject(error);
});
export default api;
