import { Model, Sequelize } from 'sequelize';

class Stand extends Model {
  static init(sequelize) {
    super.init(
      {
        num_stand: Sequelize.INTEGER,
        qtd_judge: Sequelize.INTEGER,
        sex_modality: Sequelize.ENUM('M', 'F'),
        category_age: Sequelize.STRING,
        date_event: Sequelize.DATEONLY,
        horary: Sequelize.TIME,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Modality, {
      foreignKey: 'fk_modality_id',
      as: 'modality',
    });
    this.belongsToMany(models.Athlete, {
      through: 'standAthletes',
      as: 'athletes',
      foreignKey: 'fk_stand_id',
    });
    this.belongsToMany(models.Judge, {
      through: 'standJudges',
      as: 'judges',
      foreignKey: 'fk_stand_id',
    });
  }
}

export default Stand;
