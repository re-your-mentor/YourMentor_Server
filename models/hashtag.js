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
    db.Hashtag.belongsToMany(db.User, {
      through: 'UserHashtag',
      foreignKey: 'hashtagId',
      as: 'taggedUsers' // 더 명확한 이름 사용
    });
    
    db.Hashtag.belongsToMany(db.Post, { 
      through: 'PostHashtag', 
      foreignKey: 'hashtagId',
      as: 'posts'
    });
    
    db.Hashtag.belongsToMany(db.Room, {
      through: 'ChatroomHashtag',
      foreignKey: 'hashtagId',
      as: 'rooms'
    });
  }
};

module.exports = Hashtag;