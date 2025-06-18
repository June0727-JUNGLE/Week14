import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('로그인 시도:', { username, password });
      const response = await authAPI.login(username, password);
      console.log('로그인 응답:', response.data);
      const { token } = response.data;
      
      // JWT 토큰에서 사용자 정보 추출 (간단한 방식)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // 사용자 정보 저장
      const userData = {
        id: payload.id,
        username: payload.username
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      console.error('에러 상세:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      console.log('회원가입 시도:', { username, password });
      const response = await authAPI.register(username, password);
      console.log('회원가입 응답:', response.data);
      return true;
    } catch (error) {
      console.error('회원가입 실패:', error);
      console.error('에러 상세:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
  }
  return context;
};
