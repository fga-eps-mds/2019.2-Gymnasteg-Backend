import Judge from "../models/Judge";
import Database from "../../database";
import PasswordGenerator from "password-generator";

module.exports = {
  async create(req, res) {
    const { name, email } = req.body;
    try {
      await Database.connection.sync;
      const generatedPassword = PasswordGenerator(12, true);
      await Judge.create({ name, email, password: generatedPassword });
      return res.status(201).json({ password: generatedPassword });
    } catch (error) {
      return res.status(401).send();
    }
  }
};
