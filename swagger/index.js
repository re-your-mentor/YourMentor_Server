/**
 * @swagger
 * /:
 *   get:
 *     summary: "메인 페이지의 게시글 목록 가져오기"
 *     description: "페이지네이션과 정렬 기능을 포함한 최신/인기 게시글 목록을 가져옵니다."
 *     tags: [search]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "조회할 페이지 번호 (기본값: 1)"
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: "한 페이지당 게시글 개수 (기본값: 10, 최대: 50)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *           default: latest
 *         description: "정렬 방식 (latest: 최신순, popular: 인기순)"
 *     responses:
 *       200:
 *         description: "게시글 목록을 성공적으로 가져옴"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   description: "전체 게시글 개수"
 *                 totalPages:
 *                   type: integer
 *                   description: "총 페이지 개수"
 *                 currentPage:
 *                   type: integer
 *                   description: "현재 페이지 번호"
 *                 pageSize:
 *                   type: integer
 *                   description: "페이지당 게시글 개수"
 *                 sort:
 *                   type: string
 *                   enum: [latest, popular]
 *                   description: "정렬 방식"
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "게시글 ID"
 *                       title:
 *                         type: string
 *                         description: "게시글 제목"
 *                       content:
 *                         type: string
 *                         description: "게시글 내용"
 *                       img:
 *                         type: string
 *                         description: "첨부된 이미지 URL"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "게시글 작성 시간"
 *                       likesCount:
 *                         type: integer
 *                         description: "게시글 좋아요 수"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: "작성자 ID"
 *                           nick:
 *                             type: string
 *                             description: "작성자 닉네임"
 *                       hashtags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: "해시태그 ID"
 *                             name:
 *                               type: string
 *                               description: "해시태그 이름"
 *       500:
 *         description: "서버 오류 발생"
 */


/**
 * @swagger
 * /hashtag:
 *   get:
 *     summary: "해시태그로 검색된 게시글 가져오기"
 *     description: "특정 해시태그로 검색된 게시글을 가져옵니다."
 *     tags: [search]
 *     parameters:
 *       - name: hashtag
 *         in: query
 *         description: "검색할 해시태그"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "검색된 게시글을 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: "API 호출 성공 여부"
 *                 title:
 *                   type: string
 *                   description: "페이지 제목 (검색된 해시태그)"
 *                 twits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "게시글 ID"
 *                       content:
 *                         type: string
 *                         description: "게시글 내용"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "게시글 작성 시간"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: "작성자 ID"
 *                           nick:
 *                             type: string
 *                             description: "작성자 닉네임"
 *       400:
 *         description: "해시태그 파라미터가 누락됨"
 *       500:
 *         description: "서버 오류 발생"
 */

/**
 * @swagger
 * /img/{image_file_name}:
 *   get:
 *     summary: 업로드된 사진파일 조회
 *     description: 업로드한 사진을 서버로부터 전송받습니다.
 *     tags: [image]
 *     parameters:
 *       - name: no specific name
 *         in: path
 *         description: 업로드된 이미지 파일 + 확장자
 *         required: true
 *         schema:
 *           type: String
 *     responses:
 *       200:
 *         description: 성공 시 정상적으로 사진파일 확인 가능.
 *         content:
 *           application/json:
 *             schema:
 *               type: file
 *       500:
 *         description: 서버 에러
 */


/**
 * @swagger
 * /upload/img:
 *   post:
 *     summary: 이미지 업로드 (토큰 필요)
 *     description: 사진을 서버에 전송합니다.
 *     tags: [image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hashtags:
 *                 type: array
 *                 description: 해시태그 ID 배열
 *                 items:
 *                   type: integer
 *                 example: [1]
 *     responses:
 *       200:
 *         description: 사진 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 post:
 *                   type: object
 *                   properties:
 *                     img:
 *                       type: String
 *                       example: "exampleImage.jpg"
 *       500:
 *         description: 서버 에러
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */