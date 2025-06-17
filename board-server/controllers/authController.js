const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 유저 존재 여부 확인
    const user = await User.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 틀렸습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, username: user.username },
      'secret-key',       // 나중엔 .env로 분리 추천
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패', detail: err.message });
  }
};
