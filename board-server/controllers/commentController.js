const { Comment, User } = require('../models');

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.id; //토큰에서 사용자 ID 추출

    const comment = await Comment.create({ content, userId, postId });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: '댓글 작성 실패', detail: err.message });
  }
};

// 특정 게시글 댓글 목록
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      include: { model: User, attributes: ['username'] },
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: '댓글 조회 실패', detail: err.message });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) return res.status(404).json({ error: '댓글 없음' });
    if (comment.userId !== userId) return res.status(403).json({ error: '권한 없음' });

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: '댓글 수정 실패', detail: err.message });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) return res.status(404).json({ error: '댓글 없음' });
    if (comment.userId !== userId) return res.status(403).json({ error: '권한 없음' });

    await comment.destroy();
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '댓글 삭제 실패', detail: err.message });
  }
};

//댓글 좋아요 기능
const { CommentLike } = require('../models');

exports.toggleCommentLike = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const existing = await CommentLike.findOne({ where: { commentId, userId } });

    if (existing) {
      await existing.destroy();
      return res.json({ message: '댓글 좋아요 취소' });
    } else {
      await CommentLike.create({ commentId, userId });
      return res.json({ message: '댓글 좋아요 추가' });
    }
  } catch (err) {
    res.status(500).json({ error: '댓글 좋아요 처리 실패', detail: err.message });
  }
};
