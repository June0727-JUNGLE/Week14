const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');

// CORS 설정
app.use(cors());

//json 파싱
app.use(express.json());

/*라우터 연결*/

//게시글 작성 라우터 연결
const postRoutes = require('./routes/postRoutes');
app.use('/posts', postRoutes);

//회원가입 라우터 연결
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

//댓글 라우터 연결
const commentRoutes = require('./routes/commentRoutes');
app.use('/comments', commentRoutes);  // ← 댓글은 /posts/:postId/comments

//로그인 라우터 연결
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

//기본 라우트
app.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = app;