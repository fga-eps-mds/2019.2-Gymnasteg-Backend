import Sequelize, { Model } from 'sequelize';

class Athlete extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        gender: Sequelize.ENUM('M', 'F'),
        date_born: Sequelize.DATEONLY,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Stand, {
      through: 'standAthletes',
      as: 'stands',
      foreignKey: 'fk_athlete_id',
    });
  }
}

export default Athlete;
