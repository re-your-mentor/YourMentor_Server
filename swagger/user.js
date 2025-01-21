/**
 * @swagger
 * /user/edit/{userId}:
 *   put:
 *     summary: 유저 정보 수정
 *     description: 유저의 닉네임 및 비밀번호를 수정합니다.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: 수정할 유저의 ID
 *         required: true
 *         schema:
 *           type: integer
 *       - name: nick
 *         in: body
 *         description: 새 닉네임 (선택 사항)
 *         required: false
 *         schema:
 *           type: string(30)
 *           example: newNick
 *       - name: password
 *         in: body
 *         description: 새 비밀번호 (선택 사항)
 *         required: false
 *         schema:
 *           type: string(200)
 *           example: newPassword123
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
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 특정 유저의 정보와 게시글 조회.
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
 *     summary: 유저 삭제 (회원가입)
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