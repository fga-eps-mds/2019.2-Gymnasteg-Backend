import Sequelize from 'sequelize';

import Banca from '../app/models/Banca';
import Modalidade from '../app/models/Modalidade';

import databaseConfig from '../config/database';

const models = [Banca, Modalidade];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
