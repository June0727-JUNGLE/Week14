module.exports = (sequelize, DataTypes) => {
    const PostLike = sequelize.define('PostLike', {});
  
    PostLike.associate = models => {
      PostLike.belongsTo(models.User, { foreignKey: 'userId' });
      PostLike.belongsTo(models.Post, { foreignKey: 'postId' });
    };
  
    return PostLike;
  };  