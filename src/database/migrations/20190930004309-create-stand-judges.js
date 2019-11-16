module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standJudges', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      fk_stand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'stands', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      fk_judge_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'judges', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('standJudges');
  },
};
