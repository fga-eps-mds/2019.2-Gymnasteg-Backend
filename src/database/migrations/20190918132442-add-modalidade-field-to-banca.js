module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bancas', 'fk_modalidade_id', {
      type: Sequelize.INTEGER,
      references: { model: 'modalidades', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('bancas', 'fk_modalidade_id');
  },
};
