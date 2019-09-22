import { Router } from 'express';
import JudgeManagement from './app/controllers/JudgeManagement';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import ModalidadeController from './app/controllers/ModalidadeController';
import BancaController from './app/controllers/BancaController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Word' });
});

routes.get('/modalidades', ModalidadeController.index);
routes.get('/modalidades/:id', ModalidadeController.show);
routes.post('/modalidades', ModalidadeController.store);
routes.put('/modalidades', ModalidadeController.update);

routes.get('/bancas', BancaController.index);
routes.get('/bancas/:id', BancaController.show);
routes.post('/bancas', BancaController.store);
routes.put('/bancas', BancaController.update);
routes.post('/createJudge', JudgeManagement.create);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', JudgeManagement.update);

export default routes;
