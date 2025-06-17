module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    User.associate = models => {
      // 추후 관계 설정용 (지금은 비워둬도 됨)
    };
  
    return User;
  };