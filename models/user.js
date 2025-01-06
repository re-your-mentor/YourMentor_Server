const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(60),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      profile_pic:{
        type: Sequelize.STRING,
        defaultValue: "default_profile_pic.jpg"
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao'),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'userId' }); // 댓글은 유저와 1:N 관계
    db.User.hasMany(db.Message, { foreignKey: 'userId' }); // 유저는 여러 메시지를 보냄
    db.User.hasMany(db.Room, { foreignKey: 'userId' }); // 유저는 여러 방을 생성할 수 있음
  }
};

module.exports = User;
