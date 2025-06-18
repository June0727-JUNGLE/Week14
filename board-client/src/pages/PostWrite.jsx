import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, TextField, Button, 
  Box, Alert
} from '@mui/material';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 인증 확인
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await postAPI.createPost(title, content);
      navigate('/');
    } catch (err) {
      console.error('게시글 작성 실패:', err);
      setError('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          게시글 작성
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="제목"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="content"
            label="내용"
            id="content"
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              등록
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostWrite;
