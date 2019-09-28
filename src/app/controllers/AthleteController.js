import * as Yup from 'yup';
import Athlete from '../models/Athlete';

class AthleteController {
  async index(req, res) {
    const athlete = await Athlete.findAll({
      attributes: ['id', 'name', 'email', 'gender', 'date_born'],
    });

    return res.json(athlete);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação das informações.' });
    }

    const { id } = req.params;
    const athlete = await Athlete.findByPk(id);

    if (!athlete) {
      return res.status(400).json({ error: 'Atleta não existe.' });
    }

    return res.json(athlete);
  }
}

export default new AthleteController();
