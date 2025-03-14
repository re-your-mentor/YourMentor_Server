const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      content: { // 댓글 내용
        type: Sequelize.STRING(500), // 500자 제한
        allowNull: false,
      },
      reply_to: { // 대댓글일 경우 부모 댓글 ID
        type: Sequelize.INTEGER,
        allowNull: true, // 최상위 댓글은 `null`
        references: {
          model: 'comments', // 테이블 이름 (자기 참조)
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      postId: { // 댓글이 속한 게시글 ID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'posts', // 테이블 이름 (Post 모델에서 정의된 tableName)
          key: 'id',
        },
        onDelete: 'CASCADE', // 게시글 삭제 시 댓글도 삭제
      },
      userId: { // 댓글 작성자 ID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // 테이블 이름 (User 모델에서 정의된 tableName)
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }, {
      sequelize,
      timestamps: true, // 생성/수정 시간 기록
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments', // 댓글 테이블 이름
      paranoid: true, // soft delete 사용
      charset: 'utf8mb4', // 이모지 지원
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });
    db.Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });

    // 댓글과 대댓글의 자기 참조 관계
    db.Comment.hasMany(db.Comment, {
      as: 'Replies', // 자식 댓글에 대한 alias
      foreignKey: 'parentId',
      onDelete: 'CASCADE',
    });

    db.Comment.belongsTo(db.Comment, {
      as: 'Parent', // 부모 댓글에 대한 alias
      foreignKey: 'parentId',
    });
  }
}

module.exports = Comment;
