module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('modalidades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('modalidades');
  },
};
