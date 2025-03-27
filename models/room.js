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
        as: 'creator' // ✅ 방 생성자용 별칭
      });
    
      db.Room.belongsToMany(db.Hashtag, { 
        through: 'ChatroomHashtag',
        foreignKey: 'roomId',
        as: 'hashtags' // ✅ 해시태그 관계용 별칭
      });
    
      db.Room.belongsToMany(db.User, {
        through: 'RoomUsers',
        foreignKey: 'roomId',
        as: 'participants' // ⭐ 'members' 대신 새로운 별칭 사용
      });
    }
};

module.exports = Room;
