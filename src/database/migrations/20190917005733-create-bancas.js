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
        type: Sequelize.INTEGER,
      },
      qtd_arbitro: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sexo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      data_evento: {
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
