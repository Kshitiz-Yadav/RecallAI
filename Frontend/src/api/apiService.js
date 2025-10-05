import api from './client';

// Authentication API calls
export async function signInAsync(email, password) {
    const response = await api.post('/Auth/login', { email, password });
    return response.data.object;
}

export async function signUpAsync(email, password) {
    const response = await api.post('/Auth/register', { email, password });
    return response.data.object;
}

// Healthcheck API call
export async function healthCheckAsync() {
    const response = await api.get('/Healthcheck/health');
    return response.data.object;
}

const CLIENT = {
    // File management API calls
    async fileUploadAsync(formData) {
        try {

            const response = await api.post('/FilesManagement/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getAllFilesAsync() {
        try {
            const response = await api.get('/FilesManagement/filesSummary');
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getFileAsync(fileId) {
        try {
            const response = await api.get(`/FilesManagement/file?fileId=${fileId}`);
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async deleteFileAsync(fileId) {
        try {
            const response = await api.delete(`/FilesManagement/file?fileId=${fileId}`);
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Chat history API calls
    async getChatHistoryAsync(skip = 0, top = 0) {
        try {
            const response = await api.get(`/ChatHistory?skip=${skip}&top=${top}`);
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Resource usage API calls
    async getMonthlyUsageAsync() {
        try {
            const response = await api.get('/Usage');
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getUsageLimitsAsync() {
        try {
            const response = await api.get('/Usage/limits');
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Chat API calls
    async askQuestionAsync(requestData) {
        try {
            const response = await api.post('/Chat', requestData);
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
}

const getErrorMessage = (error) => {
    return error?.response?.data?.message || error?.message || error || "An unknown error occurred";
}

export default CLIENT;