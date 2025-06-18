import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          게시판
        </Typography>
        
        <Box>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" component="span" sx={{ mr: 2 }}>
                {user.username}님 환영합니다
              </Typography>
              <Button color="inherit" component={Link} to="/write">
                글쓰기
              </Button>
              <Button color="inherit" onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                로그인
              </Button>
              <Button color="inherit" component={Link} to="/register">
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
