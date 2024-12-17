// passport 모듈과 카카오 로그인 전략을 불러옵니다.
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;  // passport-kakao 라이브러리에서 카카오 로그인 전략을 불러옵니다.

const User = require('../models/user');  // 사용자 모델을 불러옵니다.

module.exports = () => {
  // passport.use는 카카오 전략을 사용하여 카카오 로그인을 처리하도록 설정합니다.
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,  // 카카오 개발자 사이트에서 발급받은 애플리케이션 ID (KAKAO_ID 환경변수)
    callbackURL: '/auth/kakao/callback',  // 카카오 인증 후 리다이렉트될 URL
  }, async (accessToken, refreshToken, profile, done) => {
    // 카카오 로그인 인증 후 실행될 콜백 함수입니다.
    console.log('kakao profile', profile);  // 카카오에서 전달된 사용자 프로필 정보를 로그로 출력

    try {
      // 기존에 카카오 계정으로 가입한 사용자가 있는지 확인
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },  // snsId와 provider를 이용해 기존 사용자가 있는지 확인
      });

      if (exUser) {
        // 이미 가입된 사용자가 있다면, 그 사용자를 세션에 전달하여 로그인 처리
        done(null, exUser);  // done 함수는 인증이 완료되었음을 나타냅니다. 첫 번째 인자는 에러, 두 번째 인자는 사용자 정보
      } else {
        // 기존 사용자가 없으면 새로운 사용자를 생성
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email,  // 카카오 계정의 이메일을 가져옵니다. (없을 수 있으므로 optional chaining 사용)
          nick: profile.displayName,  // 카카오 프로필에서 표시된 이름을 사용자의 닉네임으로 설정
          snsId: profile.id,  // 카카오에서 제공한 고유 ID를 snsId로 저장
          provider: 'kakao',  // 카카오 로그인임을 나타내기 위해 provider 값을 'kakao'로 설정
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
