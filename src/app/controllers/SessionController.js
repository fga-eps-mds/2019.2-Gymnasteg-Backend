import jwt from "jsonwebtoken";
import * as Yup from "yup";

import Judge from "../models/Judge";

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

    if (!judge) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    if (!(await judge.checkPassword(password))) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const { name } = judge;

    return res.json({ judge: { name, email } });
  }
}

export default new SessionController();
