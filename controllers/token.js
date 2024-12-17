const jwt = require('jsonwebtoken');
const { Domain, User } = require('../models');

exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    // 도메인 찾기
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attributes: ['nick', 'id'],  // 'attribute' -> 'attributes'로 수정
      },
    });

    // 도메인이 없으면 401 오류 반환
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }

    // JWT 생성
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1440m',
        issuer: 'nodebird',
      }
    );

    // 토큰 발급 성공 시 응답
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    // 서버 오류 처리
    console.error(error); // 콘솔에 에러 출력
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
      error: error.message,  // 오류 메시지
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined, // 프로덕션 환경에서는 스택 트레이스를 숨김
    });
  }
};

exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};
