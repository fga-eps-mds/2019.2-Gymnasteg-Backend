import * as Yup from 'yup';

import Modalidade from '../models/Modalidade';

class ModalidadeController {
  async index(req, res) {
    const modalidades = await Modalidade.findAll({
      attributes: ['id', 'tipo'],
    });
    return res.json(modalidades);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      tipo: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, tipo } = await Modalidade.create(req.body);
    return res.json({
      id,
      tipo,
    });
  }
}

export default new ModalidadeController();
