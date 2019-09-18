import { Model, Sequelize } from 'sequelize';

class Banca extends Model {
  static init(sequelize) {
    super.init(
      {
        num_banca: Sequelize.INTEGER,
        dataEvento: Sequelize.DATEONLY,
        horario: Sequelize.TIME,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Modalidade, { foreignKey: 'fk_modalidade_id' });
  }
}

export default Banca;
