const { 
  User, 
  Post, 
  Comment, 
  Message, 
  Room, 
  Hashtag 
} = require('../models');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// 유저 정보 수정 (닉네임 및 비밀번호)
exports.updateUserNick = async (req, res) => {
  const userId = req.user.id;
  const { edit_nick } = req.body; // 요청 본문에서 닉네임 추출

  try {
    const user = await User.findByPk(userId); // 유저 조회
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 닉네임 업데이트
    user.nick = edit_nick; // 닉네임 필드를 업데이트
    await user.save(); // 변경 사항 저장

    res.status(200).json({ message: '유저 닉네임이 정상적으로 수정되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '닉네임 업로드 중 에러가 발생했습니다' });
  }
};

// 유저 정보 수정 (프로필 사진)
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id; // 토큰에서 userId 가져오기
  const { profile_pic } = req.body; // 요청 본문에서 사진 파일명 받기

  try {
    if (!profile_pic) {
      return res.status(400).json({ success: false, message: '프로필 이미지 파일명을 입력하세요.' });
    }

    // 사용자 조회 (소프트 삭제된 유저 제외)
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 업로드 폴더 경로 설정
    const uploadDir = path.join(__dirname, '..', 'upload'); // 'upload' 폴더의 경로
    const filePath = path.join(uploadDir, profile_pic); // 파일의 전체 경로

    console.log(uploadDir)
    console.log(filePath)

    // 'upload' 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 파일 존재 여부 확인
    if (fs.existsSync(filePath)) {
      console.log('파일 경로:', filePath); // 파일 경로 로깅
      return res.status(400).json({ success: false, message: '프로필 이미지 파일이 존재하지 않습니다.' });
    }

    // 프로필 이미지 URL 업데이트
    user.profile_pic = profile_pic;
    await user.save();

    res.json({ success: true, message: '프로필 이미지가 업데이트되었습니다.', profile_pic });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({ success: false, message: '프로필 업데이트 중 오류 발생' });
  }
};

// 유저 정보 조회 (Read)
exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, pageSize = 10, sort = 'latest' } = req.query;

  try {
    // 페이지네이션 설정
    const parsedPage = Math.max(1, parseInt(page));
    const parsedPageSize = Math.min(parseInt(pageSize) || 10, 50);
    const offset = (parsedPage - 1) * parsedPageSize;

    // 정렬 조건 설정
    let order;
    switch(sort) {
      case 'popular':
        order = [[Sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.postId = Post.id)'), 'DESC']];
        break;
      case 'views':
        order = [['views', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    // 유저 기본 정보 + 연결된 해시태그 조회
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Hashtag,
        as: 'hashtags',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. 먼저 전체 개수 조회 (간단한 쿼리)
    const totalCount = await Post.count({
      where: { userId }
    });

    // 2. 페이지 데이터 조회
    const posts = await Post.findAll({
      where: { userId },
      include: [{
        model: Hashtag,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.postId = Post.id)'), 'likesCount']
        ]
      },
      order,
      limit: parsedPageSize,
      offset: offset
      // subQuery: false 제거
    });

    // 응답 데이터 포맷
    const responseData = {
      user_id: user.id,
      profile_pic: user.profile_pic,
      nick: user.nick,
      email: user.email,
      createdAt: user.createdAt,
      hashtags: user.hashtags.map(tag => ({
        id: tag.id,
        name: tag.name
      })),
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        img: post.img,
        views: post.views,
        likesCount: post.get('likesCount'),
        hashtags: post.Hashtags,
        createdAt: post.createdAt
      })),
      pagination: {
        totalItems: totalCount, // 별도로 조회한 정확한 총 개수 사용
        totalPages: Math.ceil(totalCount / parsedPageSize),
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        currentItems: posts.length // 현재 페이지의 실제 아이템 수
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ 
      message: 'Error getting user information', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
// 유저 해시태그 추가
exports.userHashtagAdd = async (req, res) => {
  const userId = req.user.id;
  const { hashtags } = req.body;

  // 입력 검증
  if (!hashtags || !Array.isArray(hashtags)) {
    return res.status(400).json({ 
      success: false, 
      message: '유효한 해시태그 ID 배열이 필요합니다.' 
    });
  }

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Hashtag,
        as: 'hashtags',
        through: { attributes: [] },
        required: false
      }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    // 해시태그 데이터 확인
    if (!user.hashtags) {
      user.hashtags = []; // 기본값 설정
    }

    // 기존 해시태그 ID 추출
    const existingHashtagIds = user.hashtags.map(tag => tag.id);
    
    // 신규 해시태그 필터링
    const newHashtagIds = hashtags.filter(id => 
      !existingHashtagIds.includes(id) && Number.isInteger(id)
    );

    // 최대 5개 제한 검증
    if (existingHashtagIds.length + newHashtagIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: '해시태그는 최대 5개까지 추가할 수 있습니다.',
        currentCount: existingHashtagIds.length
      });
    }

    // 해시태그 추가
    if (newHashtagIds.length > 0) {
      const tagsToAdd = await Hashtag.findAll({
        where: { id: newHashtagIds }
      });
      await user.addHashtags(tagsToAdd);
    }

    // 성공 응답
    res.status(200).json({
      success: true,
      addedCount: newHashtagIds.length,
      currentTotal: existingHashtagIds.length + newHashtagIds.length
    });

  } catch (error) {
    console.error('Error in userHashtagAdd:', {
      error: error.message,
      stack: error.stack,
      userId,
      hashtags
    });
    
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// 유저 해시테그 삭제
exports.userHashtagDelete = async (req, res) => {
  const userId = req.user.id;
  const { hashtags } = req.body;

  try {
    // 유저 조회 - as 별칭 추가
    const user = await User.findOne({
      where: { id: userId },
      include: [{ 
        model: Hashtag, 
        as: 'hashtags', // 모델 정의와 동일한 소문자 사용
        through: { attributes: [] } 
      }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    // 빈 배열인 경우, 기존 해시태그를 유지하고 응답 반환
    if (!hashtags || hashtags.length === 0) {
      const currentHashtags = user.Hashtags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nick: user.nick,
        },
        currentHashtags,
      });
    }

    // 유저가 가진 해시태그 ID 추출
    const existingHashtagIds = user.Hashtags.map((tag) => tag.id);

    // 삭제할 해시태그 ID가 유저가 가진 해시태그에 포함되는지 검증
    const validHashtagIds = hashtags.filter((id) => existingHashtagIds.includes(id));

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

    // 삭제 후 유저의 현재 해시태그 목록 조회 (as 별칭 추가)
    const updatedUser = await User.findOne({
      where: { id: userId },
      include: [{ 
        model: Hashtag, 
        as: 'Hashtags',
        through: { attributes: [] } 
      }],
    });

    // 성공 응답
    res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nick: updatedUser.nick,
      },
      currentHashtags: updatedUser.Hashtags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    });
  } catch (error) {
    console.error('Error in userHashtagDelete:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};