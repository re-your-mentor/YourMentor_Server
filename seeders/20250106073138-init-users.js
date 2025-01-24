'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const env = process.env.NODE_ENV || 'development';
    const users = [];
    const hashtags = [];

    if (env === 'development') {
      users.push({
        email: 'dev@example.com',
        nick: 'Dev User',
        password: '$2b$12$z4kHSVmDfLiQ6GZ.4vYetOCd2zT478FdwdoU/mxeFX60AubByZ/y.',
        profile_pic: 'default_profile_pic.jpg',
        provider: 'local',
        snsId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 기본 해시태그 추가
      // 기본 해시태그 추가
      hashtags.push(
        { name: 'javascript', createdAt: new Date(), updatedAt: new Date() },
        { name: 'python', createdAt: new Date(), updatedAt: new Date() },
        { name: 'java', createdAt: new Date(), updatedAt: new Date() },
        { name: 'typescript', createdAt: new Date(), updatedAt: new Date() },
        { name: 'csharp', createdAt: new Date(), updatedAt: new Date() },
        { name: 'php', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ruby', createdAt: new Date(), updatedAt: new Date() },
        { name: 'go', createdAt: new Date(), updatedAt: new Date() },
        { name: 'rust', createdAt: new Date(), updatedAt: new Date() },
        { name: 'kotlin', createdAt: new Date(), updatedAt: new Date() },
        { name: 'swift', createdAt: new Date(), updatedAt: new Date() },
        { name: 'react', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vue', createdAt: new Date(), updatedAt: new Date() },
        { name: 'angular', createdAt: new Date(), updatedAt: new Date() },
        { name: 'svelte', createdAt: new Date(), updatedAt: new Date() },
        { name: 'html', createdAt: new Date(), updatedAt: new Date() },
        { name: 'css', createdAt: new Date(), updatedAt: new Date() },
        { name: 'sass', createdAt: new Date(), updatedAt: new Date() },
        { name: 'tailwindcss', createdAt: new Date(), updatedAt: new Date() },
        { name: 'bootstrap', createdAt: new Date(), updatedAt: new Date() },
        { name: 'webpack', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vite', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nodejs', createdAt: new Date(), updatedAt: new Date() },
        { name: 'express', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nestjs', createdAt: new Date(), updatedAt: new Date() },
        { name: 'django', createdAt: new Date(), updatedAt: new Date() },
        { name: 'flask', createdAt: new Date(), updatedAt: new Date() },
        { name: 'spring', createdAt: new Date(), updatedAt: new Date() },
        { name: 'laravel', createdAt: new Date(), updatedAt: new Date() },
        { name: 'graphql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'restapi', createdAt: new Date(), updatedAt: new Date() },
        { name: 'microservices', createdAt: new Date(), updatedAt: new Date() },
        { name: 'mysql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'postgresql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'mongodb', createdAt: new Date(), updatedAt: new Date() },
        { name: 'redis', createdAt: new Date(), updatedAt: new Date() },
        { name: 'sqlite', createdAt: new Date(), updatedAt: new Date() },
        { name: 'firebase', createdAt: new Date(), updatedAt: new Date() },
        { name: 'prisma', createdAt: new Date(), updatedAt: new Date() },
        { name: 'typeorm', createdAt: new Date(), updatedAt: new Date() },
        { name: 'docker', createdAt: new Date(), updatedAt: new Date() },
        { name: 'kubernetes', createdAt: new Date(), updatedAt: new Date() },
        { name: 'aws', createdAt: new Date(), updatedAt: new Date() },
        { name: 'azure', createdAt: new Date(), updatedAt: new Date() },
        { name: 'gcp', createdAt: new Date(), updatedAt: new Date() },
        { name: 'terraform', createdAt: new Date(), updatedAt: new Date() },
        { name: 'jenkins', createdAt: new Date(), updatedAt: new Date() },
        { name: 'githubactions', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nginx', createdAt: new Date(), updatedAt: new Date() },
        { name: 'linux', createdAt: new Date(), updatedAt: new Date() },
        { name: 'reactnative', createdAt: new Date(), updatedAt: new Date() },
        { name: 'flutter', createdAt: new Date(), updatedAt: new Date() },
        { name: 'android', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ios', createdAt: new Date(), updatedAt: new Date() },
        { name: 'xamarin', createdAt: new Date(), updatedAt: new Date() },
        { name: 'git', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vscode', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vim', createdAt: new Date(), updatedAt: new Date() },
        { name: 'intellij', createdAt: new Date(), updatedAt: new Date() },
        { name: 'figma', createdAt: new Date(), updatedAt: new Date() },
        { name: 'jest', createdAt: new Date(), updatedAt: new Date() },
        { name: 'cypress', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ai', createdAt: new Date(), updatedAt: new Date() },
        { name: 'machinelearning', createdAt: new Date(), updatedAt: new Date() },
        { name: 'blockchain', createdAt: new Date(), updatedAt: new Date() },
        { name: 'web3', createdAt: new Date(), updatedAt: new Date() },
      );
    }

    if (env === 'test') {
      users.push({
        email: 'test@example.com',
        nick: 'Test User',
        password: 'pass123',
        profile_pic: 'default_profile_pic.jpg',
        provider: 'local',
        snsId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 기본 해시태그 추가
      hashtags.push(
        { name: 'javascript', createdAt: new Date(), updatedAt: new Date() },
        { name: 'python', createdAt: new Date(), updatedAt: new Date() },
        { name: 'java', createdAt: new Date(), updatedAt: new Date() },
        { name: 'typescript', createdAt: new Date(), updatedAt: new Date() },
        { name: 'csharp', createdAt: new Date(), updatedAt: new Date() },
        { name: 'php', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ruby', createdAt: new Date(), updatedAt: new Date() },
        { name: 'go', createdAt: new Date(), updatedAt: new Date() },
        { name: 'rust', createdAt: new Date(), updatedAt: new Date() },
        { name: 'kotlin', createdAt: new Date(), updatedAt: new Date() },
        { name: 'swift', createdAt: new Date(), updatedAt: new Date() },
        { name: 'react', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vue', createdAt: new Date(), updatedAt: new Date() },
        { name: 'angular', createdAt: new Date(), updatedAt: new Date() },
        { name: 'svelte', createdAt: new Date(), updatedAt: new Date() },
        { name: 'html', createdAt: new Date(), updatedAt: new Date() },
        { name: 'css', createdAt: new Date(), updatedAt: new Date() },
        { name: 'sass', createdAt: new Date(), updatedAt: new Date() },
        { name: 'tailwindcss', createdAt: new Date(), updatedAt: new Date() },
        { name: 'bootstrap', createdAt: new Date(), updatedAt: new Date() },
        { name: 'webpack', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vite', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nodejs', createdAt: new Date(), updatedAt: new Date() },
        { name: 'express', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nestjs', createdAt: new Date(), updatedAt: new Date() },
        { name: 'django', createdAt: new Date(), updatedAt: new Date() },
        { name: 'flask', createdAt: new Date(), updatedAt: new Date() },
        { name: 'spring', createdAt: new Date(), updatedAt: new Date() },
        { name: 'laravel', createdAt: new Date(), updatedAt: new Date() },
        { name: 'graphql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'restapi', createdAt: new Date(), updatedAt: new Date() },
        { name: 'microservices', createdAt: new Date(), updatedAt: new Date() },
        { name: 'mysql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'postgresql', createdAt: new Date(), updatedAt: new Date() },
        { name: 'mongodb', createdAt: new Date(), updatedAt: new Date() },
        { name: 'redis', createdAt: new Date(), updatedAt: new Date() },
        { name: 'sqlite', createdAt: new Date(), updatedAt: new Date() },
        { name: 'firebase', createdAt: new Date(), updatedAt: new Date() },
        { name: 'prisma', createdAt: new Date(), updatedAt: new Date() },
        { name: 'typeorm', createdAt: new Date(), updatedAt: new Date() },
        { name: 'docker', createdAt: new Date(), updatedAt: new Date() },
        { name: 'kubernetes', createdAt: new Date(), updatedAt: new Date() },
        { name: 'aws', createdAt: new Date(), updatedAt: new Date() },
        { name: 'azure', createdAt: new Date(), updatedAt: new Date() },
        { name: 'gcp', createdAt: new Date(), updatedAt: new Date() },
        { name: 'terraform', createdAt: new Date(), updatedAt: new Date() },
        { name: 'jenkins', createdAt: new Date(), updatedAt: new Date() },
        { name: 'githubactions', createdAt: new Date(), updatedAt: new Date() },
        { name: 'nginx', createdAt: new Date(), updatedAt: new Date() },
        { name: 'linux', createdAt: new Date(), updatedAt: new Date() },
        { name: 'reactnative', createdAt: new Date(), updatedAt: new Date() },
        { name: 'flutter', createdAt: new Date(), updatedAt: new Date() },
        { name: 'android', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ios', createdAt: new Date(), updatedAt: new Date() },
        { name: 'xamarin', createdAt: new Date(), updatedAt: new Date() },
        { name: 'git', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vscode', createdAt: new Date(), updatedAt: new Date() },
        { name: 'vim', createdAt: new Date(), updatedAt: new Date() },
        { name: 'intellij', createdAt: new Date(), updatedAt: new Date() },
        { name: 'figma', createdAt: new Date(), updatedAt: new Date() },
        { name: 'jest', createdAt: new Date(), updatedAt: new Date() },
        { name: 'cypress', createdAt: new Date(), updatedAt: new Date() },
        { name: 'ai', createdAt: new Date(), updatedAt: new Date() },
        { name: 'machinelearning', createdAt: new Date(), updatedAt: new Date() },
        { name: 'blockchain', createdAt: new Date(), updatedAt: new Date() },
        { name: 'web3', createdAt: new Date(), updatedAt: new Date() },
      );
    }

    // users 테이블에 데이터 삽입 (중복 방지)
    for (const user of users) {
      const existingUser = await queryInterface.sequelize.query(
        `SELECT * FROM users WHERE email = :email`,
        {
          replacements: { email: user.email },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );

      if (existingUser.length === 0) {
        await queryInterface.bulkInsert('users', [user], {});
      }
    }

    console.log(hashtags); // `hashtags` 배열이 정의된 위치에서 출력
    await queryInterface.bulkInsert('hashtags', hashtags, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('hashtags', null, {});
  }
};