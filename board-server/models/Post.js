module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
  
    Post.associate = models => {
      // Post는 User에 속한다 (작성자)
      Post.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return Post;
  };  