// passport 모듈과 로그인 전략들을 불러옵니다.
const passport = require('passport');
const local = require('./localStrategy');  // 로컬 로그인 전략
const kakao = require('./kakaoStrategy');  // 카카오 로그인 전략
const User = require('../models/user');  // 사용자 모델 불러오기

module.exports = () => {
  // serializeUser: 사용자가 로그인 성공 후, 세션에 저장할 데이터를 설정합니다.
  passport.serializeUser((user, done) => {
    console.log('serialize');  // serialize 호출됨을 확인하는 로그
    done(null, user.id);  // 세션에 저장할 사용자 정보를 설정 (여기서는 user.id만 저장)
  });

  // deserializeUser: 세션에서 사용자 정보를 조회할 때 호출됩니다.
  passport.deserializeUser((id, done) => {
    console.log('deserialize');  // deserialize 호출됨을 확인하는 로그
    User.findOne({
      where: { id },  // 세션에 저장된 사용자 ID로 사용자를 찾음
      include: [{ // 사용자와 관련된 '팔로워'와 '팔로잉' 정보도 함께 불러옵니다.
        model: User,  // 팔로워를 찾기 위해 User 모델을 참조
        attributes: ['id', 'nick'],  // 팔로워의 ID와 닉네임만 불러옴
        as: 'Followers',  // 팔로워를 'Followers'라는 별칭으로 설정
      }, {
        model: User,  // 팔로잉을 찾기 위해 User 모델을 참조
        attributes: ['id', 'nick'],  // 팔로잉의 ID와 닉네임만 불러옴
        as: 'Followings',  // 팔로잉을 'Followings'라는 별칭으로 설정
      }],
    })
      .then(user => {
        console.log('user', user);  // 불러온 사용자 정보를 로그로 출력
        done(null, user);  // 사용자 정보를 세션에 저장
      })
      .catch(err => done(err));  // 오류 발생 시, 에러를 전달
  });

  // 로컬 로그인 전략과 카카오 로그인 전략을 불러와서 패스포트에 설정
  local();  // 로컬 전략을 사용한 로그인 설정
  kakao();  // 카카오 전략을 사용한 로그인 설정
};
