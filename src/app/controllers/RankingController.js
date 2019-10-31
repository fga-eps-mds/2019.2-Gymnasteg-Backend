import * as Yup from 'yup';
import Vote from '../models/Vote';
import Judge from '../models/Judge';

class RankingController {
  async show(req, res) {
    const schema = Yup.object().shape({
      id_athlete: Yup.number()
        .required()
        .positive(),
      id_stand: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(401)
        .json({ error: 'Falha na validação das informações!' });
    }

    const { id_stand, id_athlete } = req.params;

    try {
      const votes = await Vote.findAll({
        where: {
          fk_stand_id: id_stand,
          fk_athlete_id: id_athlete,
        },
        include: [
          {
            model: Judge,
            as: 'judge',
            attributes: ['name'],
          },
        ],
        attributes: ['punctuation', 'type_punctuation'],
      });

      return res.json(votes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro de requisição!' });
    }
  }
}

export default new RankingController();
