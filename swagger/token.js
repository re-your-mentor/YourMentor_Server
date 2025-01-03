/**
 * @swagger
 * tags:
 *   name: Token
 *   description: JWT 토큰 관리 API
 */

/**
 * @swagger
 * /token:
 *   post:
 *     summary: JWT 토큰 생성
 *     description: 클라이언트 시크릿을 사용해 JWT 토큰을 생성합니다.
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientSecret:
 *                 type: string
 *                 description: 클라이언트 시크릿 키
 *                 example: "your-client-secret"
 *     responses:
 *       200:
 *         description: 토큰 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "토큰이 발급되었습니다"
 *                 token:
 *                   type: string
 *                   description: 발급된 JWT 토큰
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 인증 실패 - 등록되지 않은 도메인
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "서버 에러"
 *                 error:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "Error message"
 *                 stack:
 *                   type: string
 *                   description: 스택 트레이스 (프로덕션 환경에서는 숨김)
 */

/**
 * @swagger
 * /test:
 *   get:
 *     summary: JWT 토큰 검증
 *     description: JWT 토큰을 검증하고, 검증된 데이터를 반환합니다.
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 토큰 검증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 사용자 ID
 *                   example: 1
 *                 nick:
 *                   type: string
 *                   description: 사용자 닉네임
 *                   example: "닉네임"
 *       401:
 *         description: 인증 실패 - 토큰이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 토큰입니다"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "서버 에러"
 */