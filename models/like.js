const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init({
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Like',
      tableName: 'likes',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Like.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    db.Like.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });
  }

}

module.exports = Like;