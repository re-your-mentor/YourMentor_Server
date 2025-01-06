const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');

// 유저 정보 수정 (닉네임, 비밀번호 변경 가능)
exports.updateUser = async (req, res) => {
  const { userId } = req.params; // URL에서 유저 ID 추출
  const { nick, password, passwordAgain } = req.body; // 요청 본문에서 닉네임과 비밀번호 추출

  try {
    const user = await User.findByPk(userId); // 유저 조회
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const saltRounds = process.env.SALT_ROUND;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;

    if( (!nick == user.nick) || password )

    // 닉네임이 있을 경우 닉네임 수정
    if (nick) {
      user.nick = nick;
    }

    // 비밀번호가 있을 경우 비밀번호 해싱 후 수정
    if (password) {
      const saltRounds = process.env.SALT_ROUND;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    await user.save(); // 변경 사항 저장
    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user information' });
  }
};

// 유저 정보 조회 (Read)
exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('getUserInfo');
    // 유저 정보, 작성한 게시글, 팔로워/팔로우 수 조회
    const user = await User.findById(userId, {
      attributes: { exclude: ['password'] } // 비밀번호 제외
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 응답 데이터 포맷
    const responseData = {
      id: user.id,
      email: user.email,
      nick: user.nick,
      provider: user.provider,
      snsId: user.snsId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      posts: user.Posts, // 유저가 작성한 게시글
    };

    res.status(200).json(responseData); // 데이터 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user information' });
  }
};