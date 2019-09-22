import { Model, Sequelize } from 'sequelize';

class Modalidade extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Modalidade;
