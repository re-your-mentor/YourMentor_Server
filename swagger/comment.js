/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * post/{postId}/comment:
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
 *                 example: integer
 *               parentId:
 *                 type: integer
 *                 description: null 일시 일반댓글. 다른 숫자일 시 대댓글 처리.
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "좋은 글입니다!"
 *               user_nick:
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
 *                 postId:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 parentId:
 *                   type: integer
 *                   required: false
 *                 content:
 *                   type: string
 *                 user_nick:
 *                   type: string
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * post/{postId}/comment:
 *   get:
 *     summary: 댓글 조회
 *     description: 특정 게시글에 대한 모든 댓글을 조회.
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
 *                   commentId:
 *                     type: string
 *                   parentId:
 *                     type: integer
 *                     description: null 일시 일반댓글. 다른 숫자일 시 대댓글 처리.
 *                   content:
 *                     type: string
 *                   user_nick:
 *                     type: string
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * post/{postId}/comment/del/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 자신의 댓글을 삭제합니다. 일반 댓글(부모 댓글)이 삭제될 시(parentId == null 인것이 부모) 대댓글(자식 댓글) 까지 같이 삭제함.
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