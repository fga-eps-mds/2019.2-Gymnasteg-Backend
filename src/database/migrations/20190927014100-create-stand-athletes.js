module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standAthletes', {
      fk_stand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'stands', key: 'id' },
      },

      fk_athlete_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'athletes', key: 'id' },
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
    return queryInterface.dropTable('standAthletes');
  },
};
