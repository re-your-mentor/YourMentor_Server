const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      post_nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'id' });
  }
}

module.exports = Post;
