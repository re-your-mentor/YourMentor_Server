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

const io = app.use(cors({
  origin: '*', // 모든 도메인 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.set('port', process.env.PORT || 8000);
app.set('host', process.env.HOST);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

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
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.error(error.message);
  next(error);
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

const server = app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});

// 미배포 환경에서 내부망 통신에 사용
// const server = app.listen(app.get('port'),app.get('host'), () => {
//   console.log(`Server running on port ${app.get('port')}`);
// });
