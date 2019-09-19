import Judge from "../models/Judge";
import Database from "../../database";

module.exports = {
  async create(req, res) {
    const { name, email } = req.body;
    try {
      await Database.connection.sync;
      await Judge.create({ name, email, password: "121212" });
      return res.status(201).json({ password: "1234" });
    } catch (error) {
      return res.status(500);
    }
  }
};
