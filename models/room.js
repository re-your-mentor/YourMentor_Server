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
    db.Room.belongsTo(db.User, { 
      foreignKey: 'userId',
      as: 'creator', // ✅ 추가된 부분
    });
    db.Room.hasMany(db.Message, { foreignKey: 'roomId' });
    db.Room.belongsToMany(db.Hashtag, { 
      through: 'ChatroomHashtag', // 중간 테이블 이름
      foreignKey: 'roomId',       // Room을 참조하는 외래키
      as: 'hashtags'             // 쿼리에서 사용할 alias
    });
  }
};

module.exports = Room;
