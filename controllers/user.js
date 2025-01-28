const { 
  User, 
  Post, 
  Comment, 
  Message, 
  Room, 
  Hashtag } = require('../models');
const bcrypt = require('bcrypt');
const { sync } = require('../models/hashtag');

// 유저 정보 수정 (닉네임)
exports.updateUserNick = async (req, res) => {
  const { user_nick, userId } = req.body; // 요청 본문에서 닉네임과 비밀번호 추출
  const nick = user_nick
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

// 유저 정보 수정 (프로필 사진)
exports.updateUserProfile = async (req, res) => {
  const { userId,   } = req.body; // 요청 본문에서 닉네임과 비밀번호 추출
}


// 유저 정보 조회 (Read)
exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('getUserInfo');
    // 유저 정보, 작성한 게시글 조회
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // 비밀번호 제외
      include: [{ model: Post, as: 'Posts' }] // Posts 포함
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 응답 데이터 포맷
    const responseData = {
      profile_pic: user.profile_pic,
      nick: user.nick,
      createdAt: user.createdAt,
      posts: user.Posts || [], // Posts가 없을 경우 빈 배열 반환
    };

    res.status(200).json(responseData); // 데이터 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error get user information' });
  }
};

// 유저 삭제 (탈퇴)
exports.deleteUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 조회 (raw: true 사용 X)
    const user = await User.findOne({ where: { email } });
    //console.log(user); // 조회된 사용자 출력

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // user 객체가 Sequelize 모델 인스턴스인지 확인
    // console.log(user instanceof User); // true여야 함
    // console.log(typeof user.destroy); // 'function'이어야 함

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 관련 데이터 삭제 (옵션)
    // await Post.destroy({ where: { userId: user.id } });
    // await Comment.destroy({ where: { userId: user.id } });
    // await Message.destroy({ where: { userId: user.id } });
    // await UserHashtag.destroy({ where: { userId: user.id } });

    // 사용자 계정 삭제 (soft delete)
    await user.destroy();

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// 헤시테그 추가
exports.userHashtagAdd = async (req, res) => {
  const { userId, hashtag } = req.body; // 요청 데이터에서 userId와 hashtag 배열 추출

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Hashtag, through: { attributes: [] } }], // 유저가 가진 해시태그 정보 포함
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    // 유저가 이미 가진 해시태그 ID 추출
    const existingHashtagIds = user.Hashtags.map((tag) => tag.id);

    // 중복되지 않은 새로운 해시태그 ID 필터링
    const newHashtagIds = hashtag.filter((id) => !existingHashtagIds.includes(id));

    // 유저가 가진 해시태그 수 + 새로운 해시태그 수가 5개를 초과하는지 검증
    if (existingHashtagIds.length + newHashtagIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: '해시태그는 최대 5개까지 추가할 수 있습니다.',
      });
    }

    // 새로운 해시태그 조회
    const hashtagsToAdd = await Hashtag.findAll({
      where: { id: newHashtagIds },
    });

    // 유저에 해시태그 추가
    await user.addHashtags(hashtagsToAdd);

    // 추가된 해시태그 정보
    const addedHashtags = hashtagsToAdd.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));

    // 성공 응답
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nick: user.nick,
      },
      addedHashtags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

exports.userHashtagDelete = async (req, res) => {
  const { userId, hashtagIds } = req.body; // 요청 데이터에서 userId와 삭제할 해시태그 ID 배열 추출

  try {
    // 유저 조회
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Hashtag, through: { attributes: [] } }], // 유저가 가진 해시태그 정보 포함
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    // 유저가 가진 해시태그 ID 추출
    const existingHashtagIds = user.Hashtags.map((tag) => tag.id);

    // 삭제할 해시태그 ID가 유저가 가진 해시태그에 포함되는지 검증
    const validHashtagIds = hashtagIds.filter((id) => existingHashtagIds.includes(id));

    if (validHashtagIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '삭제할 해시태그가 유저의 해시태그 목록에 없습니다.',
      });
    }

    // 삭제할 해시태그 조회
    const hashtagsToRemove = await Hashtag.findAll({
      where: { id: validHashtagIds },
    });

    // 유저에서 해시태그 삭제
    await user.removeHashtags(hashtagsToRemove);

    // 삭제된 해시태그 정보
    const removedHashtags = hashtagsToRemove.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));

    // 성공 응답
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nick: user.nick,
      },
      removedHashtags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

