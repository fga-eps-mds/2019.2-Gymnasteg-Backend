const bcrypt = require('bcryptjs');

module.exports = {
  up: async queryInterface => {
    return queryInterface.bulkInsert(
      'coordinators',
      [
        {
          id: 0,
          name: 'root',
          email: 'root@root.root',
          password_hash: await bcrypt.hash('root', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('coordinators', null, {});
  },
};
