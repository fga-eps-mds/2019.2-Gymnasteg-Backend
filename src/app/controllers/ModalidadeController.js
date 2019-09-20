import * as Yup from 'yup';

import Modalidade from '../models/Modalidade';

class ModalidadeController {
  async index(req, res) {
    const modalidades = await Modalidade.findAll({
      attributes: ['id', 'tipo'],
    });
    return res.json(modalidades);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Falha de Validação' });
    }

    const { id } = req.params;
    const modalidade = await Modalidade.findByPk(id);

    if (!modalidade) {
      return res.status(400).json({ error: 'Modalidade não existe' });
    }

    return res.json(modalidade);
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

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .integer()
        .required(),
      tipo: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error de Validação' });
    }

    const { id } = req.body;

    const modalidade = await Modalidade.findByPk(id);

    if (!modalidade) {
      return res.json({ error: 'Modalidade não existe' });
    }

    const { tipo } = await modalidade.update(req.body);
    return res.json({
      id,
      tipo,
    });
  }
}

export default new ModalidadeController();
