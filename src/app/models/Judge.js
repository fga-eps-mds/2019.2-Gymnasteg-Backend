import Sequelize, { Model } from 'sequelize';

class Judge extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        coordinator: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Stand, {
      through: 'standJudges',
      as: 'stands',
      foreignKey: 'fk_judge_id',
    });
  }

  checkPassword(password) {
    return password === this.password;
  }
}

export default Judge;
