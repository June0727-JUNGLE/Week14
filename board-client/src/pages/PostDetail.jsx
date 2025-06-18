import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, Box, Button, Divider, 
  CircularProgress, TextField, Card, CardContent, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Avatar, Chip, Tooltip
} from '@mui/material';
import { 
  ThumbUp, Delete, Edit, ArrowBack, Send, 
  AccessTime, Person, Comment as CommentIcon 
} from '@mui/icons-material';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  // 게시글 및 댓글 불러오기
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        console.log('게시글 ID:', id);
        // 단일 게시글 API 호출
        const postResponse = await postAPI.getPostById(id);
        console.log('게시글 응답:', postResponse.data);
        setPost(postResponse.data);
        setEditTitle(postResponse.data.title);
        setEditContent(postResponse.data.content);
        
        // 댓글 불러오기
        const commentsResponse = await commentAPI.getCommentsByPost(id);
        console.log('댓글 응답:', commentsResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        console.error('에러 상세:', err.response ? err.response.data : err.message);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    try {
      await postAPI.deletePost(id);
      navigate('/');
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      setError('게시글 삭제에 실패했습니다.');
    }
    setDeleteDialogOpen(false);
  };

  // 게시글 수정
  const handleUpdatePost = async () => {
    try {
      await postAPI.updatePost(id, editTitle, editContent);
      setPost({ ...post, title: editTitle, content: editContent });
      setEditMode(false);
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      setError('게시글 수정에 실패했습니다.');
    }
  };

  // 게시글 좋아요
  const handleLikePost = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('좋아요 시도:', id);
      const likeResponse = await postAPI.likePost(id);
      console.log('좋아요 응답:', likeResponse.data);
      
      // 좋아요 상태 업데이트를 위해 게시글 다시 불러오기
      const updatedPostResponse = await postAPI.getPostById(id);
      console.log('업데이트된 게시글:', updatedPostResponse.data);
      setPost(updatedPostResponse.data);
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      console.error('에러 상세:', err.response ? err.response.data : err.message);
    }
  };

  // 댓글 작성
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!commentContent.trim()) return;
    
    try {
      console.log('댓글 작성 시도:', { postId: id, content: commentContent });
      const createResponse = await commentAPI.createComment(id, commentContent);
      console.log('댓글 작성 응답:', createResponse.data);
      
      const commentsResponse = await commentAPI.getCommentsByPost(id);
      console.log('댓글 목록 응답:', commentsResponse.data);
      setComments(commentsResponse.data);
      setCommentContent('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      console.error('에러 상세:', err.response ? err.response.data : err.message);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  // 댓글 수정 시작
  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  // 댓글 수정 저장
  const handleUpdateComment = async (commentId) => {
    try {
      console.log('댓글 수정 시도:', { commentId, content: editCommentContent });
      const updateResponse = await commentAPI.updateComment(commentId, editCommentContent);
      console.log('댓글 수정 응답:', updateResponse.data);
      
      // 댓글 목록 갱신
      const commentsResponse = await commentAPI.getCommentsByPost(id);
      setComments(commentsResponse.data);
      
      // 수정 모드 종료
      cancelEditComment();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      console.error('에러 상세:', err.response ? err.response.data : err.message);
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('댓글 좋아요 시도:', commentId);
      const likeResponse = await commentAPI.likeComment(commentId);
      console.log('댓글 좋아요 응답:', likeResponse.data);
      
      // 댓글 목록 갱신
      const commentsResponse = await commentAPI.getCommentsByPost(id);
      console.log('업데이트된 댓글 목록:', commentsResponse.data);
      
      // 댓글 목록 상태 업데이트
      setComments(commentsResponse.data);
      
      // 디버깅: 업데이트된 댓글 좋아요 수 확인
      const updatedComment = commentsResponse.data.find(c => c.id === commentId);
      console.log('업데이트된 댓글 좋아요 수:', updatedComment?.CommentLikes?.length);
    } catch (err) {
      console.error('댓글 좋아요 처리 실패:', err);
      console.error('에러 상세:', err.response ? err.response.data : err.message);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="error" variant="h6" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            startIcon={<ArrowBack />}
          >
            목록으로
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            게시글을 찾을 수 없습니다.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            startIcon={<ArrowBack />}
          >
            목록으로
          </Button>
        </Paper>
      </Container>
    );
  }

  // 사용자가 게시글 작성자인지 확인
  const isAuthor = isAuthenticated && user && parseInt(post.userId) === parseInt(user.id);
  console.log('권한 확인:', { isAuthenticated, userId: user?.id, postUserId: post.userId, isAuthor });

  // 사용자가 게시글에 좋아요를 눌렀는지 확인
  const hasLiked = isAuthenticated && user && 
    Array.isArray(post.PostLikes) && 
    post.PostLikes.some(like => parseInt(like.userId) === parseInt(user.id));

  return (
    <Container maxWidth="md">
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        목록으로
      </Button>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          mt: 2, 
          mb: 5, 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #3f51b5 0%, #5c6bc0 100%)',
          }
        }}
      >
        {/* 게시글 헤더 */}
        <Box sx={{ mb: 4 }}>
          {editMode ? (
            <TextField
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              label="제목"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                wordBreak: 'break-word'
              }}
            >
              {post.title}
            </Typography>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  mr: 1.5
                }}
              >
                {post.User?.username?.charAt(0).toUpperCase() || '?'}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {post.User?.username || '알 수 없음'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="body2">
                    {format(new Date(post.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {isAuthor && !editMode && (
              <Box>
                <Tooltip title="수정">
                  <IconButton 
                    onClick={() => setEditMode(true)} 
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton 
                    onClick={() => setDeleteDialogOpen(true)} 
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            
            {editMode && (
              <Box>
                <Button 
                  onClick={() => setEditMode(false)} 
                  sx={{ mr: 1 }}
                  variant="outlined"
                >
                  취소
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleUpdatePost}
                >
                  저장
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* 게시글 내용 */}
        {editMode ? (
          <TextField
            fullWidth
            multiline
            rows={12}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            label="내용"
            variant="outlined"
            sx={{ mb: 4 }}
          />
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {post.content}
          </Typography>
        )}
        
        {/* 좋아요 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button 
            variant={hasLiked ? "contained" : "outlined"}
            startIcon={<ThumbUp />}
            onClick={handleLikePost}
            size="large"
            sx={{ 
              px: 4, 
              py: 1,
              borderRadius: 6,
              transition: 'all 0.2s',
              ...(hasLiked ? {
                boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
              } : {})
            }}
          >
            좋아요 {Array.isArray(post.PostLikes) ? post.PostLikes.length : 0}
          </Button>
        </Box>
        
        <Divider sx={{ mt: 4, mb: 4 }} />
        
        {/* 댓글 섹션 */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <CommentIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            댓글 {comments.length}개
          </Typography>
        </Box>
        
        {/* 댓글 작성 폼 */}
        {isAuthenticated ? (
          <Box component="form" onSubmit={handleAddComment} sx={{ mb: 5 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="댓글을 작성해주세요"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                variant="contained"
                endIcon={<Send />}
                disabled={!commentContent.trim()}
                sx={{ 
                  px: 3,
                  borderRadius: 6
                }}
              >
                댓글 작성
              </Button>
            </Box>
          </Box>
        ) : (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: 4, 
              textAlign: 'center',
              borderRadius: 2,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(0, 0, 0, 0.01)'
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              댓글을 작성하려면 로그인이 필요합니다.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 6 }}
            >
              로그인
            </Button>
          </Paper>
        )}
        
        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          comments.map((comment) => {
            // 사용자가 댓글에 좋아요를 눌렀는지 확인
            const hasLikedComment = isAuthenticated && user && 
              Array.isArray(comment.CommentLikes) && 
              comment.CommentLikes.some(like => parseInt(like.userId) === parseInt(user.id));
              
            // 사용자가 댓글 작성자인지 확인
            const isCommentAuthor = isAuthenticated && user && parseInt(comment.userId) === parseInt(user.id);
            
            return (
              <Card 
                key={comment.id} 
                sx={{ 
                  mb: 2.5, 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.light',
                          mr: 1.5,
                          fontSize: '0.9rem'
                        }}
                      >
                        {comment.User?.username?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.User?.username || '알 수 없음'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {isCommentAuthor && !editingCommentId && (
                      <Box>
                        <Tooltip title="수정">
                          <IconButton 
                            size="small" 
                            onClick={() => startEditComment(comment)}
                            sx={{ mr: 0.5 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteComment(comment.id)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  
                  {editingCommentId === comment.id ? (
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        sx={{ mb: 2 }}
                        variant="outlined"
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          onClick={cancelEditComment} 
                          sx={{ mr: 1 }}
                          variant="outlined"
                        >
                          취소
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={() => handleUpdateComment(comment.id)}
                        >
                          저장
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mt: 1.5, 
                        mb: 2,
                        lineHeight: 1.6,
                        wordBreak: 'break-word'
                      }}
                    >
                      {comment.content}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      startIcon={<ThumbUp fontSize="small" />}
                      onClick={() => handleLikeComment(comment.id)}
                      color={hasLikedComment ? "primary" : "inherit"}
                      variant={hasLikedComment ? "contained" : "text"}
                      sx={{ 
                        borderRadius: 4,
                        px: 1.5,
                        ...(hasLikedComment ? {
                          boxShadow: '0 2px 8px rgba(63, 81, 181, 0.2)',
                        } : {})
                      }}
                    >
                      {Array.isArray(comment.CommentLikes) ? comment.CommentLikes.length : 0}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              borderColor: 'rgba(0, 0, 0, 0.08)',
              backgroundColor: 'rgba(0, 0, 0, 0.01)'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
            </Typography>
          </Paper>
        )}
      </Paper>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>게시글 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            취소
          </Button>
          <Button 
            onClick={handleDeletePost} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetail;
