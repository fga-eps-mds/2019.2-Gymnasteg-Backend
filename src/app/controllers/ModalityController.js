import * as Yup from 'yup';

import Modality from '../models/Modality';

class ModalityController {
  async index(req, res) {
    const modality = await Modality.findAll({
      attributes: ['id', 'type'],
    });

    return res.json(modality);
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
    const modality = await Modality.findByPk(id);

    if (!modality) {
      return res.status(400).json({ error: 'Modalidade não existe' });
    }

    return res.json(modality);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, type } = await Modality.create(req.body);

    return res.json({
      id,
      type,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .integer()
        .required(),
      type: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error de Validação' });
    }

    const { id } = req.body;

    const modality = await Modality.findByPk(id);

    if (!modality) {
      return res.json({ error: 'Modalidade não existe' });
    }

    const { type } = await modality.update(req.body);
    return res.json({
      id,
      type,
    });
  }
}

export default new ModalityController();
