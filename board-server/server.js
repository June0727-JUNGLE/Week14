const app = require('./app');
const db = require('./models');

const PORT = 3001;

db.sequelize.sync().then(() => {
  console.log('📦 DB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
});