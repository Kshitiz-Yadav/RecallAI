import api from './client';

const CLIENT = {
    // Authentication API calls
    async signInAsync(email, password, otp) {
        try {
            const response = await api.post('/Auth/login', { email, password, otp });
            return response.data.object;
        }
        catch (error) {
            throw error;
        }
    },

    async signUpAsync(email, password, otp) {
        try {
            const response = await api.post('/Auth/register', { email, password, otp });
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async verifyOtpAsync(email, password, otp) {
        try {
            const response = await api.post('/Auth/verify-otp', { email, password, otp });
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async sendOtpAsync(email, password, otp) {
        try {
            const response = await api.post('/Auth/send-otp', { email, password, otp });
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async resetPasswordAsync(email, password, otp) {
        try {
            const response = await api.post('/Auth/reset-password', { email, password, otp });
            return response.data.object;
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

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

export const getErrorMessage = (error) => {
    return error?.response?.data?.message || error?.message || error || "An unknown error occurred";
}

export default CLIENT;