module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stands', 'fk_modality_id', {
      type: Sequelize.INTEGER,
      references: { model: 'modalities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('stands', 'fk_modality_id');
  },
};
