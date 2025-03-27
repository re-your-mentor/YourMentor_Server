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
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      profile_pic: {
        type: Sequelize.STRING(100),
        defaultValue: "default_profile_pic.jpg"
      },
      hasRoom: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao'),
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
    // Hashtag 관계 (단일로 유지)
    db.User.belongsToMany(db.Hashtag, {
      through: 'UserHashtag',
      foreignKey: 'userId',
      as: 'hashtags' // 소문자로 통일
    });
  
    // 다른 관계들
    db.User.hasMany(db.Comment, { foreignKey: 'userId' });
    db.User.hasMany(db.Message, { foreignKey: 'userId' });
    db.User.belongsToMany(db.Room, {
      through: 'RoomUsers',
      as: 'joinedRooms',
      foreignKey: 'userId'
    });
    db.User.hasMany(db.Post, { foreignKey: 'userId' });
    db.User.hasMany(db.Like, { 
      foreignKey: 'userId', 
      sourceKey: 'id', 
      onDelete: 'CASCADE' 
    });
  }
};

module.exports = User;