import { Model } from 'sequelize';

class Banca extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
  }
}

export default Banca;
