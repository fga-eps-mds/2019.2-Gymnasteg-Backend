import Sequelize, { Model } from 'sequelize';

class Athlete extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        gender: Sequelize.STRING,
        date_born: Sequelize.DATEONLY,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Athlete;
