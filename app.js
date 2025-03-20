const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const socketIo = require('socket.io');
const setupChatSocket = require('./socketHandlers/chatHandler');
//const redis = require('redis');
//const RedisStore = require('connect-redis').default;
const { swaggerUi, specs } = require("./swagger/swagger");


dotenv.config();

// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
//   legacyMode: true,
// });
// redisClient.connect().catch(console.error);

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const chatRouter = require('./routes/chat');
const passportConfig = require('./passport');
const logger = require('./logger');


const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    secure: false,
  }
};

const app = express();
passportConfig();

app.set('port', process.env.PORT || 8000);
app.set('host', process.env.HOST);
app.set('view engine', 'html');
app.use(cors());

// nunjucks.configure('views', {
//   express: app,
//   watch: true,
// });

sequelize
  .sync({ force: false })
  .then(() => { 
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const syncDatabase = async () => {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0'); // ✅ sequelize 객체 사용
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};
app.use(cookieParser(process.env.COOKIE_SECRET));

if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/chat', chatRouter);

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:8000/
 * @description 기본 경로 (미배포)
 */

// 404 에러 핸들링
app.use((req, res, next) => {
  // Socket.IO 경로는 무시
  if (req.url.startsWith('/chats') || req.url.startsWith('/socket.io')) {
    return next();
  }
  
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  err.status = 404;
  next(err);
});

// 500 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : '🔒 스택 정보는 보안 상 개인에게 재공되지 않습니다.',
  });
});

//swagger 테스트
//console.log(JSON.stringify(specs, null, 2));

// syncDatabase().then(() => {
  const server = app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
  });
// });

const io = socketIo(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io", // 기본 경로로 변경
});

// 네임스페이스 생성
const chatNamespace = io.of('/chats'); 

// chatHandler에 네임스페이스 전달
require('./socketHandlers/chatHandler')(chatNamespace);

// 404 에러 핸들러는 Socket.IO 경로를 제외하도록 수정
app.use((req, res, next) => {
  // Socket.IO 경로는 건너뛰기
  if (req.url.startsWith('/chats')) {
    return next();
  }
  
  // 그 외 경로에 대한 404 처리
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  err.status = 404;
  next(err);
});


// 미배포 환경에서 내부망 통신에 사용
// const server = app.listen(app.get('port'),app.get('host'), () => {
//   console.log(`Server running on port ${app.get('port')}`);
// });