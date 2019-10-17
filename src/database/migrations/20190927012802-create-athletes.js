module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('athletes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },

      gender: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['M', 'F'],
      },

      date_born: {
        allowNull: false,
        type: Sequelize.DATEONLY,
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
    return queryInterface.dropTable('athletes');
  },
};
