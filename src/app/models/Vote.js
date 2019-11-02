import Sequelize, { Model } from 'sequelize';

class Vote extends Model {
  static init(sequelize) {
    super.init(
      {
        punctuation: Sequelize.DOUBLE,
        type_punctuation: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Stand, { foreignKey: 'fk_stand_id' });
    this.belongsTo(models.Judge, { foreignKey: 'fk_judge_id', as: 'judge' });
    this.belongsTo(models.Athlete, { foreignKey: 'fk_athlete_id' });
  }
}

export default Vote;
