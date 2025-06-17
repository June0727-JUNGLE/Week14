const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/authMiddleware');

// 댓글 작성 → POST /comments/post/:postId
router.post('/post/:postId', verifyToken, commentController.createComment);

// 댓글 목록 조회 → GET /comments/post/:postId
router.get('/post/:postId', commentController.getCommentsByPost);

// 댓글 수정 → PUT /comments/:id
router.put('/:id', verifyToken, commentController.updateComment);

// 댓글 삭제 → DELETE /comments/:id
router.delete('/:id', verifyToken, commentController.deleteComment);

// 댓글 좋아요 → POST /comments/:id/like
router.post('/:id/like', verifyToken, commentController.toggleCommentLike);

module.exports = router;