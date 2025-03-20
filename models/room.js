const Sequelize = require('sequelize');

class Room extends Sequelize.Model {
  static initiate(sequelize) {
    Room.init({
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Room',
      tableName: 'rooms',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
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

module.exports = Room;
