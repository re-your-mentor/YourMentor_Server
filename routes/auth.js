const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// POST /auth/join
router.post('/join', join);

// POST /auth/login
router.post('/login', login);

// GET /auth/logout
router.get('/logout', verifyToken, logout);

//-----------------[ 카카오 로그인 ]-----------------
// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', { session: false }, async (err, user, info) => {
    try {
      if (err) {
        console.error('카카오 로그인 에러:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: '카카오 로그인 실패' });
      }

      // 프로필 이미지 URL 추출
      const kakaoProfileImage = user._json?.kakao_account?.profile?.profile_image_url;
      
      // 이미지 다운로드 및 저장
      let savedImagePath = null;
      if (kakaoProfileImage) {
        savedImagePath = await downloadAndProcessImage(kakaoProfileImage);
      }

      // JWT 토큰 생성
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // 사용자 정보 업데이트 (프로필 이미지 포함)
      await User.update(
        { 
          lastLoginAt: new Date(),
          profile_pic: savedImagePath || user.profile_pic // 새 이미지가 있으면 저장, 없으면 기존 이미지 유지
        },
        { where: { id: user.id } }
      );

      // 업데이트된 사용자 정보 조회
      const updatedUser = await User.findByPk(user.id, {
        attributes: ['id', 'email', 'nick', 'profile_pic', 'provider']
      });

      // 프론트엔드로 응답
      res.json({
        success: true,
        token,
        user: updatedUser
      });

    } catch (error) {
      console.error('카카오 로그인 처리 중 에러:', error);
      res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
  })(req, res, next);
});

module.exports = router;