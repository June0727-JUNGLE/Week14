module.exports = (sequelize, DataTypes) => {
    const CommentLike = sequelize.define('CommentLike', {});
  
    CommentLike.associate = models => {
      CommentLike.belongsTo(models.User, { foreignKey: 'userId' });
      CommentLike.belongsTo(models.Comment, { foreignKey: 'commentId' });
    };
  
    return CommentLike;
  };