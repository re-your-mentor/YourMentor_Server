/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat 관련 API 모음. (추가 예정)
 */

/**
 * @swagger
 * /chat/rooms:
 *   post:
 *     summary: 챗룸 방 만들기
 *     description: 사용자가 새로운 채팅방을 생성합니다. 사용자당 하나의 방만 생성 가능합니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: 채팅방 이름
 *                 example: "함께 공부해요"
 *               description:
 *                 type: string
 *                 description: 채팅방 설명
 *                 example: "개발자들을 위한 스터디 모임방입니다"
 *               hashtag:
 *                 type: array
 *                 description: 채팅방에 연결할 해시태그 ID 배열
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: 채팅방 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "함께 공부해요"
 *                     description:
 *                       type: string
 *                       example: "개발자들을 위한 스터디 모임방입니다"
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-20T06:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-20T06:30:00.000Z"
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         nick:
 *                           type: string
 *                           example: "devUser"
 *                         profile_pic:
 *                           type: string
 *                           example: "ca1739049b0bb36c045c.jpg"
 *                     hashtags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "안드로이드"
 *       400:
 *         description: 잘못된 요청 또는 이미 방을 가지고 있는 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data or You already have a room"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creating chat room"
 * securityDefinitions:
 *   BearerAuth:
 *     type: "apiKey"
 *     in: "header"
 *     name: "Authorization"
 *     description: "Bearer token을 통해 인증합니다."
 */


/**
 * @swagger
 * /chat/rooms:
 *   get:
 *     summary: 채팅방 목록 조회
 *     description: 사용자의 해시태그와 검색어를 기반으로 채팅방 목록을 조회합니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 표시할 채팅방 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (쉼표로 구분된 여러 검색어 입력 가능)
 *     responses:
 *       200:
 *         description: 채팅방 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "함께 공부해요"
 *                       description:
 *                         type: string
 *                         example: "개발자들을 위한 스터디"
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T06:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T06:30:00.000Z"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           nick:
 *                             type: string
 *                             example: "devUser"
 *                       hashtags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             title:
 *                               type: string
 *                               example: 
 *                 totalRooms:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching chat rooms"
 *     securityDefinitions:
 *       BearerAuth:
 *         type: "apiKey"
 *         in: "header"
 *         name: "Authorization"
 *         description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /chat/rooms/{id}:
 *   put:
 *     summary: 채팅방 정보 수정
 *     description: 채팅방의 이름, 설명, 해시태그를 수정합니다. 방 생성자만 수정할 수 있습니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 채팅방 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 수정할 채팅방 이름
 *                 example: "함께 공부해요"
 *               description:
 *                 type: string
 *                 description: 수정할 채팅방 설명
 *                 example: "개발자들을 위한 스터디"
 *               hashtag:
 *                 type: array
 *                 description: 수정할 해시태그 ID 배열
 *                 items:
 *                   type: integer
 *                 example: [2, 4, 6]
 *     responses:
 *       200:
 *         description: 채팅방 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "함께 공부해요"
 *                     description:
 *                       type: string
 *                       example: "개발자들을 위한 스터디 모임방입니다"
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-20T06:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-20T07:15:00.000Z"
 *                     creator:
 *                       type: object
 *                       properties:
 *                         nick:
 *                           type: string
 *                           example: "devUser"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         profile_pic:
 *                           type: string
 *                           example: "ca1739049b0bb36c045c.jpg"
 *                     hashtags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "JavaScript"
 *       400:
 *         description: 잘못된 요청
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
 *                   example: "방 ID가 제공되지 않았습니다."
 *       403:
 *         description: 권한 없음
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
 *                   example: "채팅방 수정 권한이 없습니다."
 *       404:
 *         description: 채팅방을 찾을 수 없음
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
 *                   example: "수정할 채팅방을 찾을 수 없습니다."
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating chat room"
 *     securityDefinitions:
 *       BearerAuth:
 *         type: "apiKey"
 *         in: "header"
 *         name: "Authorization"
 *         description: "Bearer token을 통해 인증합니다."
 */

/**
 * @swagger
 * /chat/rooms/{roomId}/join:
 *   post:
 *     summary: 채팅방 참여
 *     description: 사용자가 특정 채팅방에 참여합니다. 이미 참여 중인 경우 오류를 반환합니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 참여할 채팅방 ID
 *     responses:
 *       200:
 *         description: 채팅방 참여 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 roomId:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "함께 공부해요"
 *                 socketEvent:
 *                   type: string
 *                   example: "joinRoom"
 *                 message:
 *                   type: string
 *                   example: "채팅방 참여 성공. 소켓 연결을 진행해주세요."
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       nick:
 *                         type: string
 *                         example: "devUser"
 *       400:
 *         description: 잘못된 요청 (이미 참여 중인 경우)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이미 참여 중입니다"
 *       404:
 *         description: 채팅방 또는 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "채팅방을 찾을 수 없습니다"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *     securityDefinitions:
 *       BearerAuth:
 *         type: "apiKey"
 *         in: "header"
 *         name: "Authorization"
 *         description: "Bearer token을 통해 인증합니다."
 */