// passport와 bcrypt, User 모델을 불러옵니다.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  // 로컬 전략을 사용합니다.
const bcrypt = require('bcrypt');  // bcrypt는 비밀번호 비교를 위해 사용됩니다.

const User = require('../models/user');  // 사용자 모델을 불러옵니다.

module.exports = () => {
  // passport에 로컬 전략을 사용하여 로그인 인증을 설정합니다.
  passport.use(new LocalStrategy({
    usernameField: 'email',  // 로그인 시 'email' 필드를 사용자명으로 사용
    passwordField: 'password',  // 로그인 시 'password' 필드를 비밀번호로 사용
    passReqToCallback: false,  // 요청 객체를 콜백으로 전달하지 않음
  }, async (email, password, done) => {  // 이메일과 비밀번호를 받아 인증을 수행
    try {
      // 입력된 이메일로 사용자를 찾습니다.
      const exUser = await User.findOne({ where: { email } });
      
      if (exUser) {
        // 사용자가 존재하면 비밀번호를 비교합니다.
        const result = await bcrypt.compare(password, exUser.password);
        
        if (result) {
          // 비밀번호가 일치하면 인증 성공
          done(null, exUser);  // 인증된 사용자 정보 전달
        } else {
          // 비밀번호가 일치하지 않으면 오류 메시지 전달
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        // 사용자가 존재하지 않으면 오류 메시지 전달
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      // 에러가 발생하면 로그를 찍고, 에러를 콜백으로 전달
      console.error(error);
      done(error);
    }
  }));
};
