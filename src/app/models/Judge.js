import Sequelize, { Model } from "sequelize";

class Judge extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        coordinator: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    return this;
  }

  checkPassword(password) {
    return password === this.password;
  }
}

export default Judge;
