import { Model, Sequelize } from 'sequelize';

class Coordinator extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        name: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Coordinator;
