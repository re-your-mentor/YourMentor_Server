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
    db.Room.belongsTo(db.User, { 
      foreignKey: 'userId',
      as: 'creator', // ✅ 추가된 부분
    });
    db.Room.belongsToMany(db.Hashtag, { 
      through: 'ChatroomHashtag', // 중간 테이블 이름
      foreignKey: 'roomId',       // Room을 참조하는 외래키
      as: 'hashtags'             // 쿼리에서 사용할 alias
    });
    // 추가된 부분: 참여 사용자 관계 (N:M)
    db.Room.belongsToMany(db.User, {
      through: 'RoomUsers',
      foreignKey: 'roomId',
      as: 'members' // 컨트롤러에서 사용할 별칭
    });
  }
};

module.exports = User;