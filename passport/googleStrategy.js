const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');  // 사용자 모델을 불러옵니다.

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email'],  // 필요한 스코프를 배열로 추가
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);  
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'google' },
      });

      if (exUser) {
        done(null, exUser); 
      } else {
        const newUser = await User.create({
          email: profile.emails[0].value,  // Google 프로필에서 이메일 추출
          nick: profile.displayName,       // Google 프로필에서 닉네임 추출
          snsId: profile.id,               // Google에서 제공한 고유 ID
          provider: 'google',
          profile_pic: profile.photos[0].value || "default_profile_pic.jpg",  // 프로필 사진
        });


        done(null, newUser);  // 새로운 사용자 정보를 세션에 저장

      }
    } catch (error) {
      // 에러가 발생하면 에러를 콘솔에 출력하고 done 함수로 에러를 전달
      console.error(error);
      done(error);
    }
  }));
};
