module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "pgpassword",
  database: "postgres",
  operatorAliases: "false",
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true
  }
};
