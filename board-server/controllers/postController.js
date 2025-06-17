const { Post, User } = require('../models');

// 게시글 목록 조회
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: { model: User, attributes: ['username'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: '게시글 조회 실패' });
  }
};

// 게시글 작성
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // 인증된 사용자 정보에서 id 가져오기

    const newPost = await Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: '게시글 작성 실패', detail: err.message });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ error: '게시글 없음' });
    if (post.userId !== userId) return res.status(403).json({ error: '권한 없음' });

    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: '게시글 수정 실패', detail: err.message });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ error: '게시글 없음' });
    if (post.userId !== userId) return res.status(403).json({ error: '권한 없음' });

    await post.destroy();
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '게시글 삭제 실패', detail: err.message });
  }
};

//게시글 좋아요 기능
const { PostLike } = require('../models');

exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const existing = await PostLike.findOne({ where: { postId, userId } });

    if (existing) {
      // 이미 좋아요 눌렀으면 → 삭제
      await existing.destroy();
      return res.json({ message: '좋아요 취소' });
    } else {
      // 안 눌렀으면 → 생성
      await PostLike.create({ postId, userId });
      return res.json({ message: '좋아요 추가' });
    }
  } catch (err) {
    res.status(500).json({ error: '좋아요 처리 실패', detail: err.message });
  }
};