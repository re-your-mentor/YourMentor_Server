const jwt = require('jsonwebtoken');

// 로그인 확인 미들웨어를 JWT 기반으로 수정
exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

// JWT 토큰을 검증하는 미들웨어
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'에서 토큰 부분만 추출

  if (!token) {
    return res.status(403).json({
      message: '토큰이 필요합니다.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 인증된 사용자 정보를 req.user에 저장
    next();
  } catch (error) {
    // 유효하지 않은 토큰 처리
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: '유효하지 않은 토큰입니다.',
        error: error.message, // 오류 메시지
      });
    }

    // 만료된 토큰 처리
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '토큰이 만료되었습니다.',
        error: error.message, // 오류 메시지
      });
    }

    // 기타 서버 오류 처리
    console.error(error); // 콘솔에 에러 출력
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
      error: error.message,  // 오류 메시지
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined, // 프로덕션 환경에서는 스택 트레이스를 숨김
    });
  }
};