"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("judge", {
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },

      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING
      },

      coordinator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("judge");
  }
};
