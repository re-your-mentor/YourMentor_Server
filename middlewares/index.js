const jwt = require('jsonwebtoken');
//const redisClient = require('../redisClient');
const { getTokenExpiration } = require('../controllers/logout');

// JWT 토큰을 검증하는 미들웨어
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 블랙리스트 확인
    // const isBlacklisted = await redisClient.get(token).catch((err) => {
    //   console.error('Redis error:', err);
    //   return null; // 오류 발생 시 null 반환
    // });
    // if (isBlacklisted) {
    //   return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
    // }

    // 토큰 만료 시간 검증 (기존의 jwt.verify에 의해 처리됨)
    const expirationTime = getTokenExpiration(token);
    if (expirationTime <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token is expired' });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded; // 유저 정보 저장
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
