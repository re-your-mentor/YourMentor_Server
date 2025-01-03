/**
 * @swagger
 * tags:
 *   name: Post
 *   description: 게시글 API
 */

/**
 * @swagger
 * /post/img:
 *   post:
 *     summary: 이미지 업로드
 *     description: 이미지를 업로드하고, 업로드된 이미지의 URL을 반환.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "/img/example12345.png"
 *                   maxSize: 5MB
 *       500:
 *         description: 서버 에러
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: 게시글 작성
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
 *                 description: 게시글 작성자의 닉네임
 *                 example: "제목"
 *                 maxLength: 50
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *                 example: "이 게시글의 내용입니다."
 *                 maxLength: 2000
 *               url:
 *                 type: string
 *                 description: 업로드된 이미지 URL
 *                 example: "example12345.png"
 *                 maxSize: 5MB
 *     responses:
 *       200:
 *         description: 게시글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_nick:
 *                       type: string
 *                       example: "닉네임"
 *                     content:
 *                       type: string
 *                       example: "이 게시글의 내용입니다."
 *                     img:
 *                       type: string
 *                       example: "/img/example12345.png"
 *                     UserId:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: 서버 에러
 * 
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: 게시글 수정
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
 *               content:
 *                 type: string
 *                 description: 수정할 게시글 내용
 *                 maxLength: 2000
 *                 example: "수정된 내용입니다."
 *               url:
 *                 type: string
 *                 description: 수정할 이미지 URL
 *                 maxSize: 5MB
 *                 example: "/img/edited_example12345.png"
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "수정된 내용입니다."
 *                     img:
 *                       type: string
 *                       example: "/img/edited_example12345.png"
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 *  
 *   delete:
 *     summary: 게시글 삭제
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
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */
