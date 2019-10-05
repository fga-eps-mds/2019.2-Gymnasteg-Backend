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
}

export default new CoordinatorController();
