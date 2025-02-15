/**
 * @swagger
 * /user/edit/nick:
 *   put:
 *     summary: 유저 닉네임 수정
 *     description: 유저의 닉네임을 수정합니다.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: Integer
 *                 description: 유저 아이디
 *               user_nick:
 *                 type: String
 *                 description: "바뀐 유저 닉네임"
 *     responses:
 *       200:
 *         description: 유저 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User information updated successfully"
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user information
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /user/edit/profile:
 *   put:
 *     summary: 유저 프로필 사진 수정
 *     description: 유저의 프로필 사진을 수정합니다.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_pic:
 *                 type: String
 *                 description: "바꿀 프로필 사진"
 *     responses:
 *       200:
 *         description: 유저 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User information updated successfully"
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user information
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */


/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 특정 유저의 정보와 게시글 조회.
 *     tags: [user]
 *     parameters:
 *       - name: id(userId)
 *         in: path
 *         description: 조회할 유저의 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 nick:
 *                   type: string
 *                   example: userNick
 *                 provider:
 *                   type: string
 *                   example: kakao
 *                 snsId:
 *                   type: string
 *                   example: sns12345
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_nick:
 *                         type: string
 *                         example: userNick
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: Post content example
 *                       img:
 *                         type: string
 *                         example: /img/sample.jpg
 *                       createdAt:
 *                         type: string
 *                         example: 2024-11-28T12:00:00Z
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user information
 */

/**
 * @swagger
 * /user/withdraw:
 *   delete:
 *     summary: 유저 삭제
 *     description: 유저를 삭제 처리합니다 (db 상에서 데이터는 그대로 남음. soft delete)
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 이메일
 *               password:
 *                 type: string
 *                 description: 사용자 확인용
 *     responses:
 *       200:
 *         description: 삭제 성공.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: String
 *                   example: "User account deleted successfully"
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
 * /user/tag:
 *   post:
 *     summary: 유저 테그 추가 (중복 걸러낼 수 있음.)
 *     description: 유저의 관심 테그를 추가합니다.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 유저 아이디
 *               hashtag:
 *                 type: array
 *                 description: 헤시테그의 숫자를 배열로 받습니다.
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 유저 테그 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: dev@example.com
 *                     nick:
 *                       type: string
 *                       example: Dev User
 *                 addedHashtags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: python
 *                   example:
 *                     - id: 2
 *                       name: python
 *                     - id: 3
 *                       name: java
 *                     - id: 4
 *                       name: typescript
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user information
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: Bearer token을 통해 인증합니다.
 */

/**
 * @swagger
 * /user/tag:
 *   delete:
 *     summary: 유저 테그 삭제 (중복 걸러낼 수 있음.)
 *     description: 유저의 관심 테그를 삭제합니다.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 유저 아이디
 *               hashtag:
 *                 type: array
 *                 description: 헤시테그의 숫자를 배열로 받습니다.
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 유저 테그 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: dev@example.com
 *                     nick:
 *                       type: string
 *                       example: Dev User
 *                 addedHashtags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: python
 *                   example:
 *                     - id: 2
 *                       name: python
 *                     - id: 3
 *                       name: java
 *                     - id: 4
 *                       name: typescript
 *       400:
 *         description: 헤시테그 목록에 있지 않는 헤시테그
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '삭제할 해시태그가 유저의 해시태그 목록에 없습니다.'
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user information
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: Bearer token을 통해 인증합니다.
 */