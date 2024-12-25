/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /auth/join:
 *   post:
 *     summary: 회원가입
 *     description: 새 사용자를 등록하고 JWT 토큰을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               nick:
 *                 type: string
 *                 example: nickname
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nick:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: 이미 존재하는 사용자
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 사용자가 로그인하고 JWT 토큰을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nick:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃
 *     description: 현재 세션을 로그아웃합니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /auth/kakao:
 *   get:
 *     summary: 카카오 로그인 요청
 *     description: 카카오 OAuth 인증을 시작합니다.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 카카오 로그인 페이지로 리다이렉트
 */

/**
 * @swagger
 * /테스트:
 *   get:
 *     summary: 테스트
 *     description: 테스트.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 성공 시 홈 페이지로 리다이렉트
 */

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
 *     description: 카카오 OAuth 인증 완료 후 콜백 처리.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 성공 시 홈 페이지로 리다이렉트
 */