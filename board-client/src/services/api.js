import axios from 'axios';

const API_URL = 'http://localhost:3001';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password) => api.post('/users', { username, password }),
};

// 게시글 관련 API
export const postAPI = {
  getPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (title, content) => api.post('/posts', { title, content }),
  updatePost: (id, title, content) => api.put(`/posts/${id}`, { title, content }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
};

// 댓글 관련 API
export const commentAPI = {
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
  createComment: (postId, content) => api.post(`/comments/post/${postId}`, { content }),
  updateComment: (id, content) => api.put(`/comments/${id}`, { content }),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.post(`/comments/${id}/like`),
};

export default api;
