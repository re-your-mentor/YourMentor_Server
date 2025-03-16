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
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    db.User.hasMany(db.Comment, { foreignKey: 'userId' });
    db.User.hasMany(db.Message, { foreignKey: 'userId' });
    db.User.belongsToMany(db.Room, {
      through: 'RoomUsers',
      as: 'joinedRooms', // 소문자로 통일 (권장)
      foreignKey: 'userId'
    });
    db.User.hasMany(db.Post, { foreignKey: 'userId' });
    db.User.belongsToMany(db.Hashtag, {
      through: 'UserHashtag', // 중간 테이블
      foreignKey: 'userId',   // User를 참조하는 외래키
      as: 'Hashtags'          // ✅ alias를 'Hashtags'로 설정 (대문자 주의)
    });
    db.User.hasMany(db.Like, { 
      foreignKey: 'userId', 
      sourceKey: 'id', 
      onDelete: 'CASCADE' 
    });
  }
};

module.exports = User;