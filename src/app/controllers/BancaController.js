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
