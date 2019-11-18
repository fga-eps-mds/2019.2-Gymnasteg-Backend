module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stands', 'fk_coordinator_id', {
      type: Sequelize.INTEGER,
      references: { model: 'coordinators', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('stands', 'fk_coordinator_id');
  },
};
