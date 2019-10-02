import * as Yup from 'yup';

import Modality from '../models/Modality';

class ModalityController {
  async index(req, res) {
    const modality = await Modality.findAll({
      attributes: ['id', 'type', 'url_image'],
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
      return res.status(400).json({ error: 'Falha de Validação!' });
    }

    const { id } = req.params;
    const modality = await Modality.findByPk(id);

    if (!modality) {
      return res.status(400).json({ error: 'Modalidade não existe!' });
    }

    return res.json(modality);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      url_image: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha de Validação!' });
    }

    const { id, type, url_image } = await Modality.create(req.body);

    return res.json({
      id,
      type,
      url_image,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .integer()
        .required(),
      type: Yup.string().required(),
      url_image: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha de Validação!' });
    }

    const { id } = req.body;

    const modality = await Modality.findByPk(id);

    if (!modality) {
      return res.json({ error: 'Modalidade não existe!' });
    }

    const { type, url_image } = await modality.update(req.body);
    return res.json({
      id,
      type,
      url_image,
    });
  }
}

export default new ModalityController();
