import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;

// --- Existing Auth Service functions ---
export const registerUser = (userData) => apiClient.post('/register', userData);
export const loginUser = (credentials) => apiClient.post('/login', credentials);
export const logoutUser = () => apiClient.post('/logout');
export const getCurrentUser = () => apiClient.get('/user');

// --- Existing Post and User Service functions ---
export const getPosts = (page = 1) => apiClient.get(`/feed?page=${page}`);
export const createPost = (postData) => apiClient.post('/posts', postData);
export const updatePost = (postId, postData) => apiClient.put(`/posts/${postId}`, postData);
export const deletePost = (postId) => apiClient.delete(`/posts/${postId}`);
export const getUserProfile = (userId) => apiClient.get(`/users/${userId}`);
export const getUserPosts = (userId, page = 1) => apiClient.get(`/users/${userId}/posts?page=${page}`);

// --- NEW Friendship Service functions ---
export const getFriends = () => apiClient.get('/friends');
export const getPendingRequests = () => apiClient.get('/friends/pending');
export const sendFriendRequest = (userId) => apiClient.post(`/friends/request/${userId}`);
export const acceptFriendRequest = (userId) => apiClient.post(`/friends/accept/${userId}`);
export const rejectFriendRequest = (userId) => apiClient.post(`/friends/reject/${userId}`);
export const unfriendUser = (userId) => apiClient.delete(`/friends/unfriend/${userId}`);
export const getFriendsPosts = (page = 1) => apiClient.get(`/feed/friends?page=${page}`);

// --- NEW Comment Service functions ---
export const getCommentsForPost = (postId, page = 1) => apiClient.get(`/posts/${postId}/comments?page=${page}`);
export const addCommentToPost = (postId, content) => apiClient.post(`/posts/${postId}/comments`, { content });
export const deleteComment = (commentId) => apiClient.delete(`/comments/${commentId}`);