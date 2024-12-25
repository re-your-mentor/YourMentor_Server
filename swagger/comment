/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: 댓글 생성
 *     description: 게시글에 댓글을 추가합니다.
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *                 description: 게시글 ID
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "좋은 글입니다!"
 *               post_nick:
 *                 type: string
 *                 description: 게시글 작성자의 닉네임
 *                 example: "authorNick"
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 댓글 ID
 *                 content:
 *                   type: string
 *                 postId:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 post_nick:
 *                   type: string
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /comment/posts/{postId}:
 *   get:
 *     summary: 댓글 조회
 *     description: 특정 게시글에 대한 모든 댓글을 조회합니다.
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   nick:
 *                     type: string
 *                     nullable: true
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /comment/fix/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     description: 자신의 댓글 내용을 수정합니다.
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *                 example: "수정된 댓글입니다."
 *               post_nick:
 *                 type: string
 *                 description: 게시글 작성자의 닉네임
 *                 example: "updatedNick"
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 post_nick:
 *                   type: string
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /comment/delet/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 자신의 댓글을 삭제합니다.
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
