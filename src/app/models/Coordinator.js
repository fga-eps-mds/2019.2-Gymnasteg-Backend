import { Model, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class Coordinator extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        name: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async coordenador => {
      if (coordenador.password) {
        coordenador.password_hash = await bcrypt.hash(coordenador.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Coordinator;
