import Sequelize, { Model } from 'sequelize';

class Judge extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        judge_type: Sequelize.ENUM(
          'Execution',
          'Difficulty',
          'Execution and Difficulty'
        ),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  checkPassword(password) {
    return password === this.password;
  }
}

export default Judge;
