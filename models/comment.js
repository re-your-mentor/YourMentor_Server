const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      content: { // 댓글 내용
        type: Sequelize.STRING(500), // 500자 제한
        allowNull: false,
      },
      parentId: { // 대댓글일 경우 부모 댓글 ID
        type: Sequelize.INTEGER,
        allowNull: true, // 최상위 댓글은 `null`
        references: {
          model: Comment,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      postId: { // 댓글이 속한 게시글 ID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Post', // 테이블 이름 (Post 모델이 정의되어 있어야 함)
          key: 'id',
        },
        onDelete: 'CASCADE', // 게시글 삭제 시 댓글도 삭제
      },
      userId: { // 댓글 작성자 ID
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // 테이블 이름 (User 모델이 정의되어 있어야 함)
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }, {
      sequelize,
      timestamps: true, // 댓글의 생성/수정 시간
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments', // 댓글 테이블 이름
      paranoid: true, // soft delete 사용
      charset: 'utf8mb4', // 이모지 지원
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    // 댓글과 게시글(Post)의 관계: 댓글은 하나의 게시글에 속함
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });

    // 댓글과 사용자(User)의 관계: 댓글은 하나의 사용자에 속함
    db.Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });

    // 댓글과 대댓글의 자기참조 관계
    db.Comment.hasMany(db.Comment, {
      as: 'Replies',
      foreignKey: 'parentId',
      onDelete: 'CASCADE',
    });

    db.Comment.belongsTo(db.Comment, {
      as: 'Parent',
      foreignKey: 'parentId',
    });
  }
}

module.exports = Comment;
