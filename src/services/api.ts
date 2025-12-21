import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://backend-sparknest-site.vercel.app/api';

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
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
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

    // Services
    getServices: () => api.get('/admin/services'),
    createService: (data) => api.post('/admin/services', data),
    updateService: (id, data) => api.put(`/admin/services/${id}`, data),
    deleteService: (id) => api.delete(`/admin/services/${id}`),

    // Technologies
    getTechnologies: () => api.get('/admin/technologies'),
    createTechnology: (data) => api.post('/admin/technologies', data),
    updateTechnology: (id, data) => api.put(`/admin/technologies/${id}`, data),
    deleteTechnology: (id) => api.delete(`/admin/technologies/${id}`),

    // Testimonials
    getTestimonials: () => api.get('/admin/testimonials'),
    createTestimonial: (data) => api.post('/admin/testimonials', data),
    updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
    deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),

    // Marketplace
    getMarketplaceItems: () => api.get('/admin/marketplace-items'),
    createMarketplaceItem: (data) => api.post('/admin/marketplace-items', data),
    updateMarketplaceItem: (id, data) => api.put(`/admin/marketplace-items/${id}`, data),
    deleteMarketplaceItem: (id) => api.delete(`/admin/marketplace-items/${id}`),
};

export default api;
