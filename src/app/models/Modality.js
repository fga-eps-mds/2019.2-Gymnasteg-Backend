import { Model, Sequelize } from 'sequelize';

class Modality extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.STRING,
        url_image: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Modality;
