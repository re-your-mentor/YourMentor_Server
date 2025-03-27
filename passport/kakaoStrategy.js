const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: '/auth/kakao/callback',
    passReqToCallback: true, // req 객체를 콜백에 전달하기 위해 추가
  }, async (req, accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);

    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });

      if (exUser) {
        // 기존 사용자일 경우 JSON 형태로 사용자 정보 반환
        const userInfo = {
          id: exUser.id,
          email: exUser.email,
          nick: exUser.nick,
          profile_pic: exUser.profile_pic,
          provider: exUser.provider
        };
        return done(null, userInfo); // 세션 대신 사용자 정보 반환
      } else {
        // 새 사용자 생성
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email,
          password: null,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
          profile_pic: profile._json?.kakao_account?.profile?.profile_image_url || "default_profile_pic.jpg",
        });

        const userInfo = {
          id: newUser.id,
          email: newUser.email,
          nick: newUser.nick,
          profile_pic: newUser.profile_pic,
          provider: newUser.provider
        };
        console.log(userInfo);
        return done(null, userInfo); // 새 사용자 정보 반환
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};