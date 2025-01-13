// redisClient.js
const Redis = require('ioredis');

// Redis 클라이언트 생성
const redisClient = new Redis({
  host: '127.0.0.1', // Redis 서버 주소
  port: 6379,        // Redis 포트 (기본값: 6379)
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
