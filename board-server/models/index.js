const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//모델 불러오기
db.User = require('./User')(sequelize, Sequelize.DataTypes); //user 정보 저장
db.Post = require('./Post')(sequelize, Sequelize.DataTypes); //게시글 정보 저장
db.Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
db.PostLike = require('./PostLike')(sequelize, Sequelize.DataTypes); //게시글 좋아요 정보 저장
db.CommentLike = require('./CommentLike')(sequelize, Sequelize.DataTypes); //댓글 좋아요 정보 저장


//관계 설정
Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.User.hasMany(db.PostLike, { foreignKey: 'userId' });
db.Post.hasMany(db.PostLike, { foreignKey: 'postId' });
db.PostLike.belongsTo(db.User, { foreignKey: 'userId' });
db.PostLike.belongsTo(db.Post, { foreignKey: 'postId' });

db.User.hasMany(db.CommentLike, { foreignKey: 'userId' });
db.Comment.hasMany(db.CommentLike, { foreignKey: 'commentId' });
db.CommentLike.belongsTo(db.User, { foreignKey: 'userId' });
db.CommentLike.belongsTo(db.Comment, { foreignKey: 'commentId' });


module.exports = db;