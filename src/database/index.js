import Sequelize from 'sequelize';

import Stand from '../app/models/Stand';
import Modality from '../app/models/Modality';
import Coordinator from '../app/models/Coordinator';
import Judge from '../app/models/Judge';

import databaseConfig from '../config/database';

const models = [Stand, Modality, Judge, Coordinator];

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
