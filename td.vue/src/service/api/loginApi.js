import api from './api.js';

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = (provider, code) => 
    api.postAsync(`/api/oauth/${provider}/completeLogin`, { code });

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};
