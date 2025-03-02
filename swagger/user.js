/**
 * @swagger
 * /user/edit/nick:
 *   put:
 *     summary: 유저 닉네임 수정 (토큰 필요)
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
 *               edit_nick:
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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /user/edit/profile:
 *   put:
 *     summary: 유저 프로필 사진 수정 (토큰 필요)
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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Bearer 토큰을 통해 인증합니다."
 */


/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 특정 유저의 정보와 게시글을 조회합니다. 페이징 및 정렬 기능을 제공합니다.
 *     tags: [user]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: 조회할 유저의 ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: page
 *         in: query
 *         description: 페이지 번호 
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         description: 페이지당 게시글 수 
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sort
 *         in: query
 *         description: 정렬 기준 
 *         required: false
 *         schema:
 *           type: string
 *           example: latest
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile_pic:
 *                   type: string
 *                   example: default_profile_pic.jpg
 *                 nick:
 *                   type: string
 *                   example: userNick
 *                 email:
 *                    type: String
 *                    example: "example@gmail.com"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-01-01T00:00:00Z"
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: hashtag1
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: This is a post content.
 *                       views:
 *                         type: integer
 *                         example: 100
 *                       likesCount:
 *                         type: integer
 *                         example: 10
 *                       hashtags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: hashtag1
 *                       createdAt:
 *                         type: string
 *                         example: 2024-01-01T00:00:00Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
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
 *                   example: Error getting user information
 *                 error:
 *                   type: string
 *                   example: Error details...
 */

/**
 * @swagger
 * /user/withdraw:
 *   delete:
 *     summary: 유저 삭제 (토큰 필요)
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

// 유저 해시테그 추가
/**
 * @swagger
 * /user/tag:
 *   post:
 *     summary: 유저 테그 추가 (토큰 필요) (중복 걸러낼 수 있음.)
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
 *               hashtags:
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
 *     summary: 유저 테그 삭제 (토큰 필요)
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
 */