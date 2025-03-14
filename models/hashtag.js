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
      through: 'UserHashtag', // 중간 테이블
      foreignKey: 'hashtagId', // Hashtag를 참조하는 외래키
      as: 'Users'              // ✅ alias를 'Users'로 설정 (대문자 주의)
    });
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag', foreignKey: 'hashtagId' }); // 포스트와의 다대다 관계
    db.Hashtag.belongsToMany(db.Room, {
      through: 'ChatroomHashtag', // 동일한 중간 테이블
      foreignKey: 'hashtagId',    // Hashtag를 참조하는 외래키
      as: 'rooms'                 // 쿼리에서 사용할 alias (필요시)
    });
  }
};

module.exports = Hashtag;