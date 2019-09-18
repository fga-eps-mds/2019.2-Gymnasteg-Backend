import { Router } from 'express';

import ModalidadeController from './app/controllers/ModalidadeController';
import BancaController from './app/controllers/BancaController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Word' });
});

routes.post('/modalidades', ModalidadeController.store);
routes.get('/modalidades', ModalidadeController.index);

routes.post('/bancas', BancaController.store);
routes.get('/bancas', BancaController.index);

export default routes;
