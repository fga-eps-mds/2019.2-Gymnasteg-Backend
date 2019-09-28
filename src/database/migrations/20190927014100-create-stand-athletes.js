module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standAthletes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },

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
