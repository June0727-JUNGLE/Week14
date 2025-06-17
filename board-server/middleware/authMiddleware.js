const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <토큰>" 에서 토큰만 추출

  try {
    const decoded = jwt.verify(token, 'secret-key'); // 토큰 검증
    req.user = decoded; // 요청 객체에 사용자 정보 저장
    next(); // 통과
  } catch (err) {
    res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
};

module.exports = verifyToken;
