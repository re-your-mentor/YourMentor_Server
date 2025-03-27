const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');

// 이미지 업로드 후 URL을 반환하는 컨트롤러 함수
exports.afterUploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '업로드한 파일이 존재하지 않습니다.' });
    }
    res.json({ success: true, img: `${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '이미지 업로드 처리 중 오류가 발생했습니다.' });
  }
};

exports.processImage = async (req, res, next) => {
  if (!req.file) return next(); // 파일 없으면 패스

  try {
    const fileExt = path.extname(req.file.originalname); // 확장자 추출
    const randomName = crypto.randomBytes(10).toString('hex'); // 랜덤 파일명
    const fileName = `${randomName}${fileExt}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    await sharp(req.file.buffer)
      .rotate() // EXIF 데이터를 기반으로 자동 회전 적용
      .resize({ width: 800 }) // 최대 너비 800px로 조정
      .jpeg({ quality: 70 }) // JPEG 변환 & 품질 70%
      .toFile(filePath); // 저장

    req.file.filename = fileName; // 저장된 파일명 추가
    req.file.path = filePath; // 경로 추가
    next();
  } catch (error) {
    console.error('이미지 처리 중 오류 발생:', error);
    return res.status(500).json({ error: '이미지 처리 실패' });
  }
};

exports.downloadAndProcessImage = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // 이미지 다운로드
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    // 파일 정보 설정
    const fileExt = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const randomName = crypto.randomBytes(10).toString('hex');
    const fileName = `${randomName}${fileExt}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    const publicPath = `/uploads/${fileName}`;

    // 이미지 처리 및 저장
    await sharp(response.data)
      .rotate() // EXIF 데이터 기반 자동 회전
      .resize({ width: 300, height: 300, fit: 'cover' }) // 프로필 이미지 크기 조정
      .jpeg({ quality: 80 }) // JPEG 변환 (80% 품질)
      .toFile(filePath);

    return publicPath;
  } catch (error) {
    console.error('이미지 다운로드 및 처리 실패:', error);
    return null;
  }
};