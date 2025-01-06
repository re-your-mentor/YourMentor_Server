const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');  // 사용자 모델을 불러옵니다.

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
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
          email: profile._json?.kakao_account?.email,  // 카카오 계정의 이메일을 가져옵니다. (없을 수 있으므로 optional chaining 사용)
          nick: profile.displayName,  // 카카오 프로필에서 표시된 이름을 사용자의 닉네임으로 설정
          snsId: profile.id,  // 카카오에서 제공한 고유 ID를 snsId로 저장
          provider: 'google', 
          profile_pic: profile._json.picture || "default_profile_pic.jpg",
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
