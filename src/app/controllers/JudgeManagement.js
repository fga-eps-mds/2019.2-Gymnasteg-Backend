import PasswordGenerator from 'password-generator';
import Judge from '../models/Judge';
import Database from '../../database';

module.exports = {
  async create(req, res) {
    const { name, email, judge_type } = req.body;
    try {
      await Database.connection.sync;
      const generatedPassword = PasswordGenerator(12, true);
      await Judge.create({
        name,
        email,
        password: generatedPassword,
        judge_type,
      });
      return res.status(201).json({ password: generatedPassword });
    } catch (error) {
      try {
        if (error.errors[0].validatorKey === 'not_unique') {
          return res.status(409).send('Árbitro já cadastrado.');
        }
      } catch (error) {}

      return res.status(500).send('Não foi possível cadastrar o árbitro.');
    }
  },
  async update(req, res) {
    return res.json({ ok: true });
  },
};
