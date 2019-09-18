module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'username',
  password: 'pgpassword',
  database: 'db',
  operatorAliases: 'false',
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
