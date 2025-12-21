import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// NOTE: Remplacez par l'URL de votre backend (ex: http://192.168.1.XX:3000/api)
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            await SecureStore.setItemAsync('userToken', response.data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
    },
    getUser: async () => {
        const userData = await SecureStore.getItemAsync('userData');
        return userData ? JSON.parse(userData) : null;
    }
};

export const adminService = {
    getArticles: () => api.get('/admin/articles'),
    getProjects: () => api.get('/admin/projects'),
    getMessages: () => api.get('/admin/messages'),
    markMessageRead: (id) => api.patch(`/admin/messages/${id}/read`),
    createArticle: (data) => api.post('/admin/articles', data),
    updateArticle: (id, data) => api.put(`/admin/articles/${id}`, data),
    deleteArticle: (id) => api.delete(`/admin/articles/${id}`),
    createProject: (data) => api.post('/admin/projects', data),
    updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/admin/projects/${id}`),
};

export default api;
