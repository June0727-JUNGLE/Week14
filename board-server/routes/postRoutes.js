const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
/*인증된 사용자만*/
//게시글 작성
router.post('/', verifyToken, postController.createPost);
// 게시글 수정
router.put('/:id', verifyToken, postController.updatePost);
//게시글 삭제
router.delete('/:id', verifyToken, postController.deletePost);
//게시글 좋아요
router.post('/:id/like', verifyToken, postController.toggleLike);



module.exports = router;