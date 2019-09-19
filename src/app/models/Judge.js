import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class Judge extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        coordinator: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    this.addHook("beforeSave", async judge => {
      if (judge.password) {
        judge.password_hash = await bcrypt.hash(judge.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Judge;
