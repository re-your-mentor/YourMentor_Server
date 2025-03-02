const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "너의 맨토 (Ur_mento)",
      description:
        "프로젝트 설명 Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://3.148.49.139:8000", // 요청 URL
      },
    ],
  },
  apis: ["./routers/*.js", "./swagger/*"], //Swagger 파일 연동
}

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs }