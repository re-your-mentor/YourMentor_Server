const Sequelize = require('sequelize');

class Message extends Sequelize.Model {
  static initiate(sequelize) {
    Message.init({
      content: {
        type: Sequelize.STRING(300),
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Message',
      tableName: 'messages',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Message.belongsTo(db.User, { foreignKey: 'userId' });  // Message는 하나의 User에 속함
    db.Message.belongsTo(db.Room, { foreignKey: 'roomId' });  // Message는 하나의 Room에 속함
  }
}

module.exports = Message;
