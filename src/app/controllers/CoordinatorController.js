import * as Yup from 'yup';
import Coordinator from '../models/Coordinator';

class CoordinatorController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      name: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação!' });
    }

    const coordExists = await Coordinator.findOne({
      where: { email: req.body.email },
    });

    if (coordExists) {
      return res
        .status(400)
        .json({ error: 'Coordenador com esse e-mail já existe!' });
    }

    const { id, name, email } = await Coordinator.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required()
        .positive(),
    });
   /* 
    if (!(await schema.isValid(req.userId))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações' });
    }
*/
    const id = req.userId;
    
    const coordinator = await Coordinator.findByPk(id, {
      attributes: [
        'name',
        'email',
      ],
    });
    
    if (!coordinator) {
      return res.status(404).json({ error: 'Coordenador não existe' });
    }
    
    return res.json(coordinator);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .integer()
        .required(),
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha de Validação!' });
    }

    const { id } = req.body;

    const coordinator = await Coordinator.findByPk(id);

    if (!coordinator) {
      return res.json({ error: 'Coordenador não existe!' });
    }

    const { name, email, password } = await coordinator.update(req.body);
    return res.json({
      id,
      name,
      email,
      password,
    });
  }

}

export default new CoordinatorController();
