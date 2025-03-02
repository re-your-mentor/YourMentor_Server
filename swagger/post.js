/**
 * @swagger
 * tags:
 *   name: Post
 *   description: 게시글 API
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: 게시글 작성 (토큰 필요)
 *     description: 게시글을 작성하고 생성된 게시글 정보를 반환합니다.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *                 example: "제목"
 *                 maxLength: 50
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *                 example: "이 게시글의 내용입니다."
 *                 maxLength: 2000
 *               img:
 *                 type: string
 *                 description: 업로드된 이미지 이름(or null)
 *                 example: "example12345.png" 
 *               hashtags:
 *                 type: array
 *                 description: 해시태그 ID 배열
 *                 items:
 *                   type: integer
 *                 example: [1]
 *     responses:
 *       200:
 *         description: 게시글 작성 성공
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "게시글의 제목입니다"
 *                     content:
 *                       type: string
 *                       example: "게시글의 본문입니다"
 *                     img:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-06T01:13:38.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-06T01:13:38.000Z"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     Hashtags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "안드로이드"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-04T11:20:32.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-04T11:20:32.000Z"
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     summary: 게시글 세부 조회
 *     description: 1개의 게시글을 상세 조회합니다. (댓글 포함)
 *     tags: [Post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: 조회할 게시물의 아이디
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공 시 정상적으로 확인 가능.
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
 *                     user_nick:
 *                       type: string
 *                       example: "a"
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     title:
 *                       type: string
 *                       example: "서폿 말고 탑 구함"
 *                     content:
 *                       type: string
 *                       example: "우리 탑 빤스런함"
 *                     img:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-04T11:25:57.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-04T11:25:57.000Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nick:
 *                           type: string
 *                           example: "a"
 *                         img:
 *                           type: string
 *                           example: "default_profile_pic.jpg"
 *                     hashtags:
 *                       type: array
 *                       nullable: true
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "안드로이드"
 *                     comments:
 *                       type: array
 *                       nullable: true
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           reply_to:
 *                             type: integer
 *                             example : null
 *                           content:
 *                             type: string
 *                             example: "이 편지는 영국에서 최초로 시작되어..."
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-04T11:30:10.000Z"
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               nick:
 *                                 type: string
 *                                 example: "이름"
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: 게시글 수정 (토큰 필요)
 *     description: 특정 게시글의 내용을 수정합니다.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 게시글의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 제목
 *                 example: "수정할 제목"
 *               content:
 *                 type: string
 *                 description: 수정할 게시글 내용
 *                 example: "수정할 게시글 내용"
 *               img:
 *                 type: string
 *                 description: 수정할 이미지 파일
 *                 example: "a5e4e2634971fd28cfb4.jpg"
 *               hashtags:
 *                 type: array
 *                 description: 해시태그 ID 배열
 *                 items:
 *                   type: integer
 *                 example: [3]
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
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
 *                     id:
 *                       type: integer
 *                       example: 16
 *                     title:
 *                       type: string
 *                       example: "게시글의 수정된 제목입니다"
 *                     content:
 *                       type: string
 *                       example: "게시글의 수정된 본문입니다"
 *                     img:
 *                       type: string
 *                       example: "update_example12345.jpg"
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-04T11:34:42.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-04T11:42:44.000Z"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     Hashtags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "iOS"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-04T11:20:32.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-04T11:20:32.000Z"
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *  
 *   delete:
 *     summary: 게시글 삭제 (토큰 필요)
 *     description: 특정 게시글을 삭제합니다.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 게시글의 ID
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "게시글이 삭제되었습니다."
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   securityDefinitions:
 *     bearerAuth:
 *       type: "apiKey"
 *       in: "header"
 *       name: "Authorization"
 *       description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /post/{postId}/like:
 *   put:
 *     summary: 게시글 좋아요 (토큰 필요)
 *     description: 특정 게시글에 좋아요를 달아줍니다.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 좋아요를 달아줄 게시글의 ID
 *     responses:
 *       201:
 *         description: 게시글 수
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: String
 *                   example: "좋아요 추가됨"
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *  
 *   delete:
 *     summary: 게시글 좋아요 삭제 (토큰 필요)
 *     description: 특정 게시글의 좋아요를 삭제합니다.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 좋아요를 취소할 게시글의 ID
 *     responses:
 *       200:
 *         description: 게시글 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "좋아요 삭제됨"
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *   securityDefinitions:
 *     bearerAuth:
 *       type: "apiKey"
 *       in: "header"
 *       name: "Authorization"
 *       description: "Bearer token을 통해 인증합니다."
 */