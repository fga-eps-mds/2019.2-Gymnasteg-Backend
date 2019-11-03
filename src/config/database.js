// require('../bootstrap');

module.exports = {
  dialect: 'postgres',
  host: 'db',
  username: 'username',
  password: 'pgpassword',
  database: 'db',
  operatorAliases: 'false',
  storage: './__tests__/database.sqlite',
  logging: false,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  }
};
