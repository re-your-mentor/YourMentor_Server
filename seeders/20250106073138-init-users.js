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
      const now = new Date();

      hashtags.push(
        { name: '안드로이드', createdAt: now, updatedAt: now },
        { name: '서버', createdAt: now, updatedAt: now },
        { name: 'iOS', createdAt: now, updatedAt: now },
        { name: '웹', createdAt: now, updatedAt: now },
        { name: '임베디드', createdAt: now, updatedAt: now },
        { name: 'Kotlin', createdAt: now, updatedAt: now },
        { name: 'Java', createdAt: now, updatedAt: now },
        { name: 'Swift', createdAt: now, updatedAt: now },
        { name: 'JavaScript', createdAt: now, updatedAt: now },
        { name: 'Arduino', createdAt: now, updatedAt: now }
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
      const now = new Date();
      hashtags.push(
        { name: '안드로이드', createdAt: now, updatedAt: now },
        { name: '서버', createdAt: now, updatedAt: now },
        { name: 'iOS', createdAt: now, updatedAt: now },
        { name: '웹', createdAt: now, updatedAt: now },
        { name: '임베디드', createdAt: now, updatedAt: now },
        { name: 'Kotlin', createdAt: now, updatedAt: now },
        { name: 'Java', createdAt: now, updatedAt: now },
        { name: 'Swift', createdAt: now, updatedAt: now },
        { name: 'JavaScript', createdAt: now, updatedAt: now },
        { name: 'Arduino', createdAt: now, updatedAt: now }
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

