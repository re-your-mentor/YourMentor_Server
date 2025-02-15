const path = require('path');
const Sequelize = require('sequelize');
const fs = require('fs');
const { Post, Hashtag, User, Like, Comment } = require('../models');

exports.uploadPost = async (req, res) => {
  try {
    // 필수 필드 검증
    if (!req.body.content || !req.body.title) {
      return res.status(400).json({ success: false, message: '게시글 제목과 본문은 필수사항 입니다.' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const userNick = user.nick;

    // 게시글 생성
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img || null,
      userId,
      user_nick: userNick,
    });

    // 해시태그 처리
    if (req.body.hashtags && Array.isArray(req.body.hashtags)) {
      const hashtagIndexes = req.body.hashtags.map(Number); // 문자열을 숫자로 변환
      console.log('Hashtag IDs:', hashtagIndexes);

      // 해시태그 조회
      const existingTags = await Hashtag.findAll({
        where: { id: { [Sequelize.Op.in]: hashtagIndexes } }, // 'in' 조건 사용
        logging: console.log, // SQL 쿼리 로그 출력
      });

      console.log('Found hashtags:', existingTags);

      // 게시글과 해시태그 관계 설정 (관계 테이블에 자동으로 추가됨)
      if (existingTags.length > 0) {
        await post.addHashtags(existingTags); // addHashtags는 자동으로 관계 테이블을 처리합니다.
      }
    }

    // 해시태그 포함하여 응답 반환
    const postWithHashtags = await Post.findByPk(post.id, {
      include: [{ model: Hashtag, through: { attributes: [] } }],
    });

    res.json({ success: true, post: postWithHashtags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 업로드 중 오류가 발생했습니다.' });
  }
};

// 게시물 세부 조회 ( 게시글 + 댓글 )
exports.getPostWithComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'nick', 'profile_pic'] },
        {
          model: Comment, include:
            [{ model: User, attributes: ['id', 'nick'] }], required: false
        },
        {
          model: Hashtag, attributes: ['id', 'name'],
          through: { attributes: [] }
        }, // 해시태그 정보 포함
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      post: {
        user_nick: post.User.nick,
        id: post.id,
        title: post.title,
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
          img: post.User.profile_pic,
        },
        hashtags: post.Hashtags.map(hashtag => ({ // 해시태그 정보 추가
          id: hashtag.id,
          name: hashtag.name,
        })),
        comments: post.Comments.map(comment => ({
          id: comment.id,
          reply_to: comment.reply_to,
          comment_nick: comment.post_nick,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.User.id,
            nick: comment.User.nick,
          },
        })),
      },
    });
  } catch (err) {
    console.error('Error fetching post with comments:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
    });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: Hashtag }], // 해시태그 관계 포함
    });

    if (!post) {
      return res.status(404).json({ 
        success: false, message: '수정할 게시글을 찾을 수 없습니다.' });
    }

    if (!req.user || post.userId !== req.user.id) {
      console.log(req.user, post.userId);
      return res.status(403).json({ 
        success: false, message: '게시글 수정 권한이 없습니다.' });
    }

    // 게시글 기본 정보 업데이트
    await post.update({
      title: req.body.title || post.title,
      content: req.body.content || post.content,
      img: req.body.img ? req.body.img : (post.img ? post.img : null),
    });

    // 해시태그 업데이트
    if (req.body.hashtags && Array.isArray(req.body.hashtags)) {
      // 기존 해시태그 관계 제거
      await post.setHashtags([]);

      // 새로운 해시태그 관계 설정
      const hashtags = await Hashtag.findAll({
        where: { id: req.body.hashtags }, // 요청으로 받은 해시태그 ID로 검색
      });
      await post.setHashtags(hashtags); // 새로운 해시태그 관계 설정
    }

    // 업데이트된 게시글 정보 반환 (해시태그 포함)
    const updatedPost = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: Hashtag }], // 해시태그 관계 포함
    });

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 수정 중 오류 발생' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // 게시글 조회
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ success: false, message: '삭제할 게시글을 찾을 수 없습니다.' });
    }

    // 토큰에서 추출한 사용자 정보 확인
    console.log('User from token:', req.user);
    console.log('Post UserId:', post.userId);

    // 타입 일치를 위해 Number로 변환
    if (!req.user || post.userId !== Number(req.user.id)) {
      return res.status(403).json({ success: false, message: '게시글 삭제 권한이 없습니다.' });
    }

    // 1. 해당 게시글의 모든 좋아요 삭제
    await Like.destroy({ where: { postId } });

    if (post.img) {
      const imagePath = path.join(__dirname, '..', 'uploads', post.img); // 이미지 파일 경로
      if (fs.existsSync(imagePath)) { // 파일이 존재하는지 확인
        fs.unlinkSync(imagePath); // 파일 삭제
        console.log(`이미지 파일 삭제됨: ${post.img}`);
      } else {
        console.log(`이미지 파일을 찾을 수 없음: ${post.img}`);
      }
    }

    // 2. 게시글 삭제
    await post.destroy();

    res.json({ success: true, message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
};