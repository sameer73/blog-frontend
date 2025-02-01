// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Replace with your API URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ct-access'); // Retrieve the JWT from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token (status 401)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/refresh/`, {
                    refresh: localStorage.getItem('ct-refresh')
                });
  
                let res = response.data; 
                let accessToken = res['access']
                // Save the new access token in local storage
                localStorage.setItem('ct-access', res['access']);

                // Update the original request with the new token and retry it
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Optionally redirect to login or handle logout here
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;