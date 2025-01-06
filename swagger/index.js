/**
 * @swagger
 * /:
 *   get:
 *     summary: "메인 페이지의 게시글 목록 가져오기"
 *     description: "메인 페이지에서 최신 게시글을 가져옵니다."
 *     responses:
 *       200:
 *         description: "게시글 목록을 성공적으로 가져옴"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: "API 호출 성공 여부"
 *                 twits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_nick:
 *                         type: string
 *                         description: "게시글 제목"
 *                       post_id:
 *                         type: integer
 *                         description: "게시글 ID"
 *                       title:
 *                         type: string
 *                         description: "페이지 제목"
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
 *       500:
 *         description: "서버 오류 발생"
 */

/**
 * @swagger
 * /hashtag:
 *   get:
 *     summary: "해시태그로 검색된 게시글 가져오기"
 *     description: "특정 해시태그로 검색된 게시글을 가져옵니다."
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