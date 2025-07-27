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

const CLIENT = {
    // File management API calls
    async fileUploadAsync(formData){
        try{

            const response = await api.post('/FilesManagement/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }
        catch (error) {
            const errorMessage = error?.response?.data || error.message || error;
            throw new Error(errorMessage);
        }
    }
}

export default CLIENT;