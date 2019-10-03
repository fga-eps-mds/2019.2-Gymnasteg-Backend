import { Router } from 'express';
import JudgeManagement from './app/controllers/JudgeManagement';
import SessionController from './app/controllers/SessionController';
import ModalityController from './app/controllers/ModalityController';
import StandController from './app/controllers/StandController';
import CoordinatorController from './app/controllers/CoordinatorController';
import AthleteController from './app/controllers/AthleteController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Word' });
});

routes.get('/modalities', ModalityController.index);
routes.get('/modalities/:id', ModalityController.show);
routes.post('/modalities', ModalityController.store);
routes.put('/modalities', ModalityController.update);

routes.post('/coordinators', CoordinatorController.store);

routes.get('/stands', StandController.index);
routes.get('/stands/:id', StandController.show);
routes.post('/stands', StandController.store);
routes.put('/stands', StandController.update);

routes.get('/judges', JudgeManagement.index);
routes.post('/createJudge', JudgeManagement.create);
routes.post('/sessions', SessionController.store);

routes.put('/users', JudgeManagement.update);

routes.get('/athletes', AthleteController.index);
routes.get('/athletes/:id', AthleteController.show);
routes.post('/athletes', AthleteController.store);
routes.put('/athletes', AthleteController.update);

export default routes;
