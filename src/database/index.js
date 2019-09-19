import Sequelize from "sequelize";

import Judge from "../app/models/Judge";

import databaseConfig from "../config/database";

const models = [Judge];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
