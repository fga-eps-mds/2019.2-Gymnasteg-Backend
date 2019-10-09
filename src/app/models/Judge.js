import Sequelize, { Model } from 'sequelize';

class Judge extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: {
          type: Sequelize.STRING,
          validate: {
            isEmail: true,
          },
        },
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
