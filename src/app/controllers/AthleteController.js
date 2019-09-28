import * as Yup from 'yup';
import Athlete from '../models/Athlete';
import Stand from '../models/Stand';

class AthleteController {
  async index(req, res) {
    const athlete = await Athlete.findAll({
      attributes: ['id', 'name', 'email', 'gender', 'date_born'],
      include: [
        {
          model: Stand,
          as: 'stands',
          through: { attributes: [] },
        },
      ],
    });

    return res.json(athlete);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações.' });
    }

    const { id } = req.params;
    const athlete = await Athlete.findByPk(id, {
      include: [
        {
          model: Stand,
          as: 'stands',
          through: { attributes: [] },
        },
      ],
    });

    if (!athlete) {
      return res.status(400).json({ error: 'Atleta não existe.' });
    }

    return res.json(athlete);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      gender: Yup.string().required(),
      date_born: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação das informações.',
      });
    }

    const { stand, ...data } = req.body;

    const athlete = await Athlete.create(data);

    try {
      await athlete.setStands(stand);
    } catch (err) {
      await athlete.destroy();
      return res.status(500).json({ error: 'Falha' });
    }

    return res.json(athlete);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      gender: Yup.string().required(),
      date_born: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações' });
    }

    const { id } = req.body;

    const athlete = await Athlete.findByPk(id);

    if (!athlete) {
      return res.json({ error: 'Atleta não exite.' });
    }

    const { name, email, gender, date_born } = await athlete.update(req.body);

    return res.json({
      id,
      name,
      email,
      gender,
      date_born,
    });
  }
}

export default new AthleteController();
