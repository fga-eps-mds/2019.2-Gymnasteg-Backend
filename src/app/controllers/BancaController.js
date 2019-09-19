import * as Yup from 'yup';
import Banca from '../models/Banca';

class BancaController {
  async index(req, res) {
    const bancas = await Banca.findAll({
      attributes: [
        'id',
        'num_banca',
        'data_evento',
        'horario',
        'fk_modalidade_id',
      ],
    });

    return res.json(bancas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      num_banca: Yup.number()
        .required()
        .positive()
        .integer(),
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
      data_evento,
      horario,
      fk_modalidade_id,
    } = await Banca.create(req.body);

    return res.json({
      id,
      num_banca,
      data_evento,
      horario,
      fk_modalidade_id,
    });
  }
}

export default new BancaController();
