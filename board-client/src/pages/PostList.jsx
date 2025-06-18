import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box, CircularProgress,
  Card, CardContent, Grid, Chip, Divider, IconButton, Pagination
} from '@mui/material';
import { ThumbUp, Comment, Visibility, Add } from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postAPI.getPosts();
        setPosts(response.data);
      } catch (err) {
        console.error('게시글 로딩 실패:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 현재 페이지에 표시할 게시글
  const currentPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          게시글 목록
        </Typography>
        
        {isAuthenticated && (
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/write"
            startIcon={<Add />}
            sx={{ 
              borderRadius: '24px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
              }
            }}
          >
            글쓰기
          </Button>
        )}
      </Box>

      {posts.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {currentPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card 
                  sx={{ 
                    mb: 0.5,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography 
                          variant="h6" 
                          component={Link} 
                          to={`/post/${post.id}`} 
                          sx={{ 
                            textDecoration: 'none', 
                            color: 'text.primary',
                            fontWeight: 600,
                            '&:hover': {
                              color: 'primary.main',
                            }
                          }}
                        >
                          {post.title}
                        </Typography>
                        
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {post.User?.username || '알 수 없음'}
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1.5, height: 16 }} />
                          <Typography variant="body2">
                            {format(new Date(post.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          icon={<ThumbUp fontSize="small" />} 
                          label={post.PostLikes?.length || 0}
                          size="small"
                          sx={{ mr: 1, backgroundColor: 'rgba(63, 81, 181, 0.08)' }}
                        />
                        <Chip 
                          icon={<Comment fontSize="small" />} 
                          label="0"
                          size="small"
                          sx={{ backgroundColor: 'rgba(63, 81, 181, 0.08)' }}
                        />
                      </Box>
                    </Box>
                    
                    {post.content && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 1.5, 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.content}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                }
              }}
            />
          </Box>
        </>
      ) : (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            게시글이 없습니다.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            첫 번째 게시글을 작성해보세요!
          </Typography>
          {isAuthenticated && (
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/write"
              startIcon={<Add />}
              sx={{ mt: 3 }}
            >
              글쓰기
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default PostList;
