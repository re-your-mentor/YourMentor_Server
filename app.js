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
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const { swaggerUi, swaggerSpec } = require('./swagger');

dotenv.config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  legacyMode: true,
});
redisClient.connect().catch(console.error);

const tokenRouter = require('./routes/token');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
passportConfig();

app.set('port', process.env.PORT || 8001);
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

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/token', tokenRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);

// 404 에러 핸들링
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info('hello');
  logger.error(error.message);
  next(error);
});

// 500 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : '🔒 스택 정보는 보안 상 제공되지 않습니다.',
  });
});

// const corsOptions = {
//   origin:'*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: false,
// };
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = ['http://10.80.162.216', 'http://10.80.162.216:3000', 'http://localhost:3000'];
    
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS policy: Origin not allowed'), false);
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// };



// app.use(cors(corsOptions));


// app.listen(app.get('port'), '0.0.0.0', () => {
//   console.log(`http://localhost:${app.get('port')}에서 대기중`);
// });

module.exports = app;

//로컬
// app.listen(app.get('port'), () => {
//   console.log(app.get('port'), '번 포트에서 대기중');
// });

//서버가 특정 IP를 통해서만 요청 받음
// const PORT = 3000;
// const HOST = '10.80.161.169';
// app.listen(PORT, HOST, () => {
//   console.log(`Server running at http://${HOST}:${PORT}`);
// });