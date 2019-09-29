module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      num_stand: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      qtd_judge: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      sex_modality: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      category_age: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      date_event: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },

      horary: {
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
    return queryInterface.dropTable('stands');
  },
};
