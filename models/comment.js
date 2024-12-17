const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      content: { // 댓글 내용
        type: Sequelize.STRING(500), // 500자 제한
        allowNull: false,
      },
      post_nick:{
        type: Sequelize.STRING(15),
        allowNull: false,
      }
      
    }, {
      sequelize,
      timestamps: true, // 댓글의 생성/수정 시간
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments', // 댓글 테이블 이름
      paranoid: true, 
      charset: 'utf8mb4', // 이모지 지원
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
   // 일대다 관계 설정: 댓글(Comment)은 하나의 게시글(Post)에 속함
   db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });

   // 일대다 관계 설정: 댓글(Comment)은 하나의 사용자(User)에 속할 수 있음
   db.Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });

  }
}

module.exports = Comment;
