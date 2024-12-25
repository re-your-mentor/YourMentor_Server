/**
 * @swagger
 * /user/{id}/follow:
 *   post:
 *     summary: 팔로우 처리
 *     description: 로그인한 유저가 다른 유저를 팔로우합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 팔로우할 유저의 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 팔로우 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: 유저를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
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
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error message
 */

/**
 * @swagger
 * /user/fix/{userId}:
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
 *           type: string
 *           example: newNick
 *       - name: password
 *         in: body
 *         description: 새 비밀번호 (선택 사항)
 *         required: false
 *         schema:
 *           type: string
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
 *                   example: User information updated successfully
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
 * /user/get/{userId}:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 특정 유저의 정보와 게시글, 팔로워 및 팔로우 수를 조회합니다.
 *     parameters:
 *       - name: userId
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
 *                   example: google
 *                 snsId:
 *                   type: string
 *                   example: sns12345
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_nick:
 *                         type: string
 *                         example: postNick
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
 *                 followerCount:
 *                   type: integer
 *                   example: 100
 *                 followingCount:
 *                   type: integer
 *                   example: 150
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
 * /user/get-all:
 *   get:
 *     summary: 모든 유저 조회
 *     description: 모든 유저의 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 유저 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   nick:
 *                     type: string
 *                     example: userNick
 *                   provider:
 *                     type: string
 *                     example: google
 *                   snsId:
 *                     type: string
 *                     example: sns12345
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching all users
 */
