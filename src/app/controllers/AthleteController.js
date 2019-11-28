import * as Yup from 'yup';
import Athlete from '../models/Athlete';
import Stand from '../models/Stand';
import Coordinator from '../models/Coordinator';
import Judge from '../models/Judge';

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
      return res.status(400).json({ error: 'Atleta não existe!' });
    }

    return res.json(athlete);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      gender: Yup.string()
        .matches(/^(M|F)$/)
        .required(),
      date_born: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação das informações.',
      });
    }

    const athleteExist = await Athlete.findOne({
      where: { email: req.body.email },
    });
    const coordinatorExist = await Coordinator.findOne({
      where: { email: req.body.email },
    });

    const judgeExist = await Judge.findOne({
      where: { email: req.body.email },
    });

    if (athleteExist || coordinatorExist || judgeExist) {
      return res.status(400).json({
        error: 'E-mail já cadastrado!',
      });
    }

    const athlete = await Athlete.create(req.body);

    return res.json(athlete);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().required(),
      email: Yup.string().required(),
      gender: Yup.string().required(),
      date_born: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações.' });
    }

    const { id } = req.body;

    const athlete = await Athlete.findByPk(id);

    if (!athlete) {
      return res.json({ error: 'Atleta não existe.' });
    }

    if (req.body.email !== athlete.dataValues.email) {
      const athleteExist = await Athlete.findOne({
        where: { email: req.body.email },
      });

      const coordinatorExist = await Coordinator.findOne({
        where: { email: req.body.email },
      });

      const judgeExist = await Judge.findOne({
        where: { email: req.body.email },
      });

      if (athleteExist || coordinatorExist || judgeExist) {
        return res.status(400).json({
          error: 'E-mail já cadastrado!',
        });
      }
    }

    const { name, email, gender, date_born } = await athlete.update(req.body);

    return res.status(200).json({
      id,
      name,
      email,
      gender,
      date_born,
    });
  }

  async destroy(req, res) {
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

    const athlete = await Athlete.findByPk(id);

    if (!athlete) {
      return res.status(400).json({ error: 'Atleta não existe.' });
    }

    await athlete.destroy();

    return res.status(200).json({ message: 'Exclusão foi bem sucedida.' });
  }
}

export default new AthleteController();
