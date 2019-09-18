import Modalidade from '../models/Modalidade';

class ModalidadeController {
  async index(req, res) {
    const modalidades = await Modalidade.findAll({
      attributes: ['id', 'tipo'],
    });
    return res.json(modalidades);
  }

  async store(req, res) {
    const { id, tipo } = await Modalidade.create(req.body);
    return res.json({
      id,
      tipo,
    });
  }
}

export default new ModalidadeController();
