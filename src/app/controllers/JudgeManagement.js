import * as Yup from 'yup';
import PasswordGenerator from 'password-generator';

import Judge from '../models/Judge';
import Database from '../../database';
import Stand from '../models/Stand';
import Modality from '../models/Modality';
import Athlete from '../models/Athlete';
import Coordinator from '../models/Coordinator';

module.exports = {
  async index(req, res) {
    try {
      const judges = await Judge.findAll({
        attributes: ['id', 'name', 'email', 'password', 'judge_type'],
        include: [
          {
            order: ['date_event', 'DESC'],
            model: Stand,
            as: 'stands',
            attributes: [
              'id',
              'num_stand',
              'qtd_judge',
              'sex_modality',
              'category_age',
              'date_event',
              'horary',
            ],
            through: { attributes: [] },
            include: [
              {
                model: Modality,
                as: 'modality',
                attributes: ['type'],
              },
              {
                model: Judge,
                as: 'judges',
                attributes: ['name', 'judge_type'],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });
      return res.status(200).json(judges);
    } catch (err) {
      return res.status(500).send('Erro na requisição!');
    }
  },

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação de informações' });
    }

    const { id } = req.params;
    const judge = await Judge.findByPk(id);

    if (!judge) {
      return res.status(400).json({ error: 'Árbitro não existe!' });
    }

    return res.json(judge);
  },

  async showJudge(req, res) {
    const id = req.userId;

    try {
      const judge = await Judge.findByPk(id, {
        attributes: ['id', 'name', 'judge_type'],
        include: [
          {
            order: ['date_event', 'DESC'],
            model: Stand,
            as: 'stands',
            attributes: [
              'id',
              'num_stand',
              'qtd_judge',
              'sex_modality',
              'category_age',
              'date_event',
              'horary',
            ],
            through: { attributes: [] },
            include: [
              {
                model: Modality,
                as: 'modality',
                attributes: ['type'],
              },
              {
                model: Athlete,
                as: 'athletes',
                attributes: ['name', 'gender', 'date_born'],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      return res.json(judge);
    } catch (err) {
      return res.status(500).send('Erro na requisição!');
    }
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
    const schema = Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().required(),
      email: Yup.string().required(),
      judge_type: Yup.mixed()
        .oneOf(['Execution', 'Difficulty', 'Execution and Difficulty'])
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json('Falha na validação das informações');
    }

    const { id } = req.body;

    const judge = await Judge.findByPk(id);

    if (!judge) {
      return res.json({ error: 'Árbitro não existe' });
    }

    if (req.body.email !== judge.dataValues.email) {
      const judgeExist = await Judge.findOne({
        where: { email: req.body.email },
      });

      const athleteExist = await Athlete.findOne({
        where: { email: req.body.email },
      });

      const coordinatorExist = await Coordinator.findOne({
        where: { email: req.body.email },
      });

      if (athleteExist || coordinatorExist || judgeExist) {
        return res.status(400).json({
          error: 'E-mail já cadastrado!',
        });
      }
    }

    const { name, email, judge_type, password } = await judge.update(req.body);

    return res.json({
      id,
      name,
      email,
      judge_type,
      password,
    });
  },

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações' });
    }

    const { id } = req.params;

    const judge = await Judge.findByPk(id);

    if (!judge) {
      return res.json({ error: 'Árbitro não existe.' });
    }

    await judge.destroy();

    return res.status(200).json({ message: 'Exclusão foi bem sucedida.' });
  },
};
