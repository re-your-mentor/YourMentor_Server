const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient');

// 토큰 만료 시간 추출
exports.getTokenExpiration = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.exp; // exp 클레임 (초 단위 Unix 시간)
};

// 로그아웃 컨트롤러
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // 토큰 만료 시간 계산
    const expiration = getTokenExpiration(token);
    if (!expiration) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // 만료된 토큰은 블랙리스트에 추가할 필요 없음
    if (expiration <= Math.floor(Date.now() / 1000)) {
      return res.status(400).json({ message: 'Token has already expired' });
    }

    // 블랙리스트에 토큰 추가 (키: 토큰, 값: 1, TTL: 만료 시간까지의 초)
    const ttl = expiration - Math.floor(Date.now() / 1000); // 초 단위 TTL
    await redisClient.set(token, 1, 'EX', ttl);
    console.log('blackList check', token);

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Failed to log out' });
  }
};
