const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
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
      modelName: 'Post',
      tableName: 'posts',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag', foreignKey: 'postId' }); // 다대다 관계 설정
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'id' });
    db.Post.hasMany(db.Like, { foreignKey: 'postId', sourceKey: 'id', onDelete: 'CASCADE' });
  }
}

module.exports = Post;