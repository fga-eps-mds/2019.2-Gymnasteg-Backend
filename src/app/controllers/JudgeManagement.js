import PasswordGenerator from 'password-generator';
import jwt from 'jsonwebtoken';

import Judge from '../models/Judge';
import Database from '../../database';
import Stand from '../models/Stand';
import authConfig from '../../config/auth';

module.exports = {
  async index(req, res) {
    const { token } = req.body;
    try {
      const decodedToken = jwt.verify(token, authConfig.secret);
      if (!decodedToken.coord) {
        return res
          .status(401)
          .send('Árbitros não podem listar os outros árbitros.');
      }
    } catch (err) {
      return res.status(401).send('Token inválido.');
    }

    const judges = await Judge.findAll({
      attributes: ['id', 'name', 'email', 'password', 'judge_type'],
      include: [
        {
          model: Stand,
          as: 'stands',
          through: { attributes: [] },
        },
      ],
    });
    return res.status(200).json(judges);
  },

  async create(req, res) {
    const { name, email, judge_type } = req.body;

    try {
      await Database.connection.sync;

      const generatedPassword = PasswordGenerator(12, true);

      const { id } = await Judge.create({
        name,
        email,
        password: generatedPassword,
        judge_type,
      });

      return res.status(201).json({ id, password: generatedPassword });
    } catch (error) {
      try {
        if (error.errors[0].validatorKey === 'not_unique') {
          return res.status(409).send('Árbitro já cadastrado.');
        }
        // eslint-disable-next-line
      } catch (error) {}

      return res.status(500).send('Não foi possível cadastrar o árbitro.');
    }
  },
  async update(req, res) {
    return res.json({ ok: true });
  },
};
