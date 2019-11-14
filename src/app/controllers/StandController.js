import * as Yup from 'yup';
import Stand from '../models/Stand';
import Athlete from '../models/Athlete';
import Judge from '../models/Judge';
import Modality from '../models/Modality';

class StandController {
  async index(req, res) {
    const stands = await Stand.findAll({
      attributes: [
        'id',
        'num_stand',
        'qtd_judge',
        'sex_modality',
        'category_age',
        'date_event',
        'horary',
        'fk_modality_id',
      ],
      include: [
        {
          model: Athlete,
          as: 'athletes',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        },
        {
          model: Judge,
          as: 'judges',
          attributes: ['id', 'name', 'email', 'judge_type'],
          through: { attributes: [] },
        },
        {
          model: Modality,
          as: 'modality',
          attributes: ['id', 'type'],
        },
      ],
    });

    return res.json(stands);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações' });
    }

    const { id } = req.params;
    const stand = await Stand.findByPk(id, {
      include: [
        {
          model: Athlete,
          as: 'athletes',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        },
        {
          model: Judge,
          as: 'judges',
          attributes: ['id', 'name', 'email', 'judge_type'],
          through: { attributes: [] },
        },
      ],
    });

    if (!stand) {
      return res.status(400).json({ error: 'Banca não existe' });
    }

    return res.json(stand);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      num_stand: Yup.number()
        .required()
        .positive()
        .integer(),
      qtd_judge: Yup.number()
        .required()
        .positive()
        .integer()
        .min(1),
      sex_modality: Yup.string().required(),
      category_age: Yup.string().required(),
      date_event: Yup.date().required(),
      horary: Yup.string().required(),
      fk_modality_id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação das informações',
      });
    }

    const { judges, athletes, ...data } = req.body;

    data.fk_coordinator_id = req.userId;

    const stand = await Stand.create(data);

    stand.setAthletes(athletes);
    stand.setJudges(judges);

    return res.json(stand);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      num_stand: Yup.number()
        .required()
        .positive()
        .integer(),
      qtd_judge: Yup.number()
        .required()
        .positive()
        .integer()
        .min(1),
      sex_modality: Yup.string().required(),
      category_age: Yup.string().required(),
      date_event: Yup.date().required(),
      horary: Yup.string().required(),
      fk_modality_id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações' });
    }

    const { id } = req.body;

    const stand = await Stand.findByPk(id);

    if (!stand) {
      return res.json({ error: 'Banca não existe' });
    }

    const {
      num_stand,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
    } = await stand.update(req.body);

    return res.json({
      id,
      num_stand,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
    });
  }
}

export default new StandController();
