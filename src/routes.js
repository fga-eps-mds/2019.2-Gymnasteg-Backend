import { Router } from 'express';
import JudgeManagement from './app/controllers/JudgeManagement';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import ModalityController from './app/controllers/ModalityController';
import StandController from './app/controllers/StandController';
import CoordinatorController from './app/controllers/CoordinatorController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Word' });
});

routes.get('/modality', ModalityController.index);
routes.get('/modality/:id', ModalityController.show);
routes.post('/modality', ModalityController.store);
routes.put('/modality', ModalityController.update);

routes.post('/coordinators', CoordinatorController.store);

routes.get('/stands', StandController.index);
routes.get('/stands/:id', StandController.show);
routes.post('/stands', StandController.store);
routes.put('/stands', StandController.update);

routes.post('/createJudge', JudgeManagement.create);
routes.post('/sessions', SessionController.store);

routes.put('/users', JudgeManagement.update);

export default routes;
