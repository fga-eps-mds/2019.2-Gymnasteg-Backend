import * as Yup from 'yup';
import Vote from '../models/Vote';
import Judge from '../models/Judge';

class RankingController {
  async show(req, res) {
    const schema = Yup.object().shape({
      id_stand: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res
        .status(401)
        .json({ error: 'Falha na validação das informações!' });
    }

    const { id_stand } = req.params;

    const votes = await Vote.findAll({
      where: {
        fk_stand_id: id_stand,
      },
      include: [
        {
          model: Judge,
          as: 'judge',
          attributes: ['name'],
        },
      ],
      attributes: ['punctuation', 'type_punctuation', 'fk_athlete_id'],
    });

    return res.json(votes);
  }
}

export default new RankingController();
