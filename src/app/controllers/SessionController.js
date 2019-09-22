import jwt from "jsonwebtoken";
import * as Yup from "yup";

import Judge from "../models/Judge";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

    const { email, password } = req.body;

    const judge = await Judge.findOne({ where: { email } });

    if (!judge || !(await judge.checkPassword(password))) {
      return res.status(401).json({ error: "Usuário e/ou senha incorretos." });
    }

    const { id, name, coordinator } = judge;

    return res.json({
      judge: {
        name,
        coordinator
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
