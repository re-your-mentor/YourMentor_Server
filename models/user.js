const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(100),
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
      profile_pic: {
        type: Sequelize.STRING(500),
        defaultValue: "default_profile_pic.jpg"
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao', 'google'),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'userId' });
    db.User.hasMany(db.Message, { foreignKey: 'userId' });
    db.User.hasMany(db.Room, { foreignKey: 'userId' });
    db.User.hasMany(db.Post, { foreignKey: 'userId' });
    db.User.belongsToMany(db.Hashtag, { through: 'UserHashtag', foreignKey: 'userId' }); // 다대다 관계 설정
  }
};

module.exports = User;