const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 옵션 설정
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Auth 관련 API 문서',
  },
  servers: [
    {
      url: 'http://localhost:8001', // API 서버의 URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./swagger/auth.js', './swagger/comment.js', './swagger/page.js', './swagger/post.js', './swagger/token.js', './swagger/user.js'], // 주석이 달린 파일 경로 설정
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
