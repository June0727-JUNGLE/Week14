const { User } = require('../models');

// 회원가입
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 유효성 검사 (간단하게만)
    if (!username || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호는 필수입니다.' });
    }

    // 유저 생성
    const newUser = await User.create({ username, password });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패', detail: err.message });
  }
};