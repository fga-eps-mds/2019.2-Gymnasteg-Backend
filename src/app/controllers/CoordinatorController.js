import Coordinator from '../models/Coordinator';

class CoordinatorController {
  async store(req, res) {
    const coordinator = await Coordinator.create(req.body);

    return res.json(coordinator);
  }
}

export default new CoordinatorController();
