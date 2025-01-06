'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const env = process.env.NODE_ENV || 'development';
    const users = [];

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
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};

console.log(users);