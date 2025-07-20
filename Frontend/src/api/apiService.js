import api from './client';

// Authentication API calls
export async function signInAsync(email, password) {
    const response = await api.post('/Auth/login', { email, password });
    return response.data;
}

export async function signUpAsync(email, password) {
    const response = await api.post('/Auth/register', { email, password });
    return response.data;
}

// Healthcheck API call
export async function healthCheckAsync() {
    const response = await api.get('/Healthcheck/health');
    return response.data;
}