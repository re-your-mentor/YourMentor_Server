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
 *     description: 게시글에 댓글을 추가합니다. (일반 댓글 또는 대댓글)
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
 *                 example: 15
 *               reply_to:
 *                 type: integer
 *                 nullable: true
 *                 description: null일 시 일반 댓글, 다른 숫자일 시 대댓글 처리
 *                 example: null
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "나요 나"
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully!"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 8
 *                     content:
 *                       type: string
 *                       example: "나요 나"
 *                     postId:
 *                       type: integer
 *                       example: 15
 *                     reply_to:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     user_nick:
 *                       type: string
 *                       example: "a"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-06T05:49:36.091Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-06T05:49:36.091Z"
 *       404:
 *         description: 게시글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found."
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create comment."
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: |
 *       자신의 댓글을 삭제합니다.
 *       - 일반 댓글(부모 댓글, reply_to = null) 삭제 시, 해당 댓글에 달린 모든 대댓글도 함께 삭제됩니다.
 *       - 대댓글(자식 댓글)은 단독으로 삭제됩니다.
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 및 대댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment and its replies deleted successfully!"
 *       403:
 *         description: 권한 없음 (작성자 불일치)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to delete this comment."
 *       404:
 *         description: 댓글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment not found." 
 *       500:
 *         description: 서버 에러
 *   securityDefinitions:
 *     bearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */