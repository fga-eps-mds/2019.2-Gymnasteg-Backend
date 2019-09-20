import * as Yup from 'yup';
import Banca from '../models/Banca';

class BancaController {
  async index(req, res) {
    const bancas = await Banca.findAll({
      attributes: [
        'id',
        'num_banca',
        'qtd_arbitro',
        'sexo',
        'data_evento',
        'horario',
        'fk_modalidade_id',
      ],
    });

    return res.json(bancas);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Falha de Validação' });
    }

    const { id } = req.params;
    const banca = await Banca.findByPk(id);

    if (!banca) {
      return res.status(400).json({ error: 'Banca não existe' });
    }

    return res.json(banca);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      num_banca: Yup.number()
        .required()
        .positive()
        .integer(),
      qtd_arbitro: Yup.number()
        .required()
        .positive()
        .integer()
        .min(1),
      sexo: Yup.string().required(),
      data_evento: Yup.date()
        .required()
        .min(new Date()),
      horario: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const {
      id,
      num_banca,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    } = await Banca.create(req.body);

    return res.json({
      id,
      num_banca,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      num_banca: Yup.number()
        .required()
        .positive()
        .integer(),
      qtd_arbitro: Yup.number()
        .required()
        .positive()
        .integer()
        .min(1),
      sexo: Yup.string().required(),
      data_evento: Yup.date()
        .required()
        .min(new Date()),
      horario: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: `Falha na validação ${new Date()}` });
    }

    const {
      id,
      num_banca,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    } = await Banca.update(req.body);

    return res.json({
      id,
      num_banca,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    });
  }
}

export default new BancaController();
