import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Judge from '../models/Judge';
import authConfig from '../../config/auth';
import Coordinator from '../models/Coordinator';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const { email, password } = req.body;

    const coordinator = await Coordinator.findOne({ where: { email } });
    const judge = await Judge.findOne({ where: { email } });

    if (
      (!judge || !(await judge.checkPassword(password))) &&
      (!coordinator || !(await coordinator.checkPassword(password)))
    ) {
      return res.status(401).json({ error: 'Usuário e/ou senha incorretos.' });
    }

    if (judge) {
      const { id, name, judge_type } = judge;
      return res.json({
        judge: {
          name,
          judge_type,
        },
        token: jwt.sign({ id, coord: false }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    }

    const { id, name } = coordinator;
    return res.json({
      judge: {
        id,
        name,
      },
      token: jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
