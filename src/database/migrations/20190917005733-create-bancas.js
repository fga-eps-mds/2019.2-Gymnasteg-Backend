module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bancas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      num_banca: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      horario: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('bancas');
  },
};
