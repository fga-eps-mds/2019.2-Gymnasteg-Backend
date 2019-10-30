module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('votes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      punctuation: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },

      fk_stand_id: {
        type: Sequelize.INTEGER,
        references: { model: 'stands', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },

      fk_judge_id: {
        type: Sequelize.INTEGER,
        references: { model: 'judges', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      fk_athlete_id: {
        type: Sequelize.INTEGER,
        references: { model: 'athletes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },

      type_punctuation: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('votes');
  },
};
