import Sequelize, { Model } from 'sequelize';

class StandAthlete extends Model {
  static init(sequelize) {
    super.init(
      {
        fk_stand_id: Sequelize.INTEGER,
        fk_athlete_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Stand, { foreignKey: 'fk_stand_id' });
    this.belongsTo(models.Athlete, { foreignKey: 'fk_athlete_id' });
  }
}

export default StandAthlete;
