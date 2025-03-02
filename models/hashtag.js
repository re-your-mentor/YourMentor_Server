const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
  static initiate(sequelize) {
    Hashtag.init({
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true, // 해시태그는 중복되지 않도록 설정
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.User, { through: 'UserHashtag', foreignKey: 'hashtagId' }); // 유저와의 다대다 관계
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag', foreignKey: 'hashtagId' }); // 포스트와의 다대다 관계
    //db.Post.belongsToMany(db.Hashtag, { through: 'ChatroomHashtag', foreignKey: 'hashtagId' }); // 채팅방과의 다대다 관계
  }
};

module.exports = Hashtag;