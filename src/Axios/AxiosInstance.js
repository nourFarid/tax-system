import axios from 'axios';
import store from '../Redux/store';
import { getAuthUser } from '../Hooks/Services/Storage'; 

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7150/api/',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthUser();
        // const state = store.getState();
        // const token = state.auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;