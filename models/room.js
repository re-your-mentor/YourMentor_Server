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
      },
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
    db.Room.belongsTo(db.User, { foreignKey: 'userId' }); // 한 방에는 하나의 유저가 생성자 역할
    db.Room.hasMany(db.Message, { foreignKey: 'roomId' }); // 하나의 방에는 여러 메시지가 있을 수 있음
  }
};

module.exports = Room;
