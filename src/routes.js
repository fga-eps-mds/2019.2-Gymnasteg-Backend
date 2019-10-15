import { Router } from 'express';
import JudgeManagement from './app/controllers/JudgeManagement';
import SessionController from './app/controllers/SessionController';
import ModalityController from './app/controllers/ModalityController';
import StandController from './app/controllers/StandController';
import CoordinatorController from './app/controllers/CoordinatorController';
import AthleteController from './app/controllers/AthleteController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Word' });
});

routes.get('/modalities', ModalityController.index);
routes.get('/modalities/:id', ModalityController.show);
routes.post('/modalities', ModalityController.store);
routes.put('/modalities', ModalityController.update);

routes.post('/coordinators', CoordinatorController.store);

routes.get(
  '/stands',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Árbitros não podem listar todas as bancas.',
  }),
  StandController.index
);
routes.get(
  '/stands/:id',
  AuthMiddleware({
    onlyNeedsValidTokens: true,
  }),
  StandController.show
);
routes.post(
  '/stands',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Árbitros não podem criar bancas.',
  }),
  StandController.store
);
routes.put(
  '/stands',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Árbitros não podem alterar as bancas.',
  }),
  StandController.update
);

routes.get(
  '/judges',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Árbitros não podem listar os outros árbitros.',
  }),
  JudgeManagement.index
);
routes.post(
  '/createJudge',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Árbitros não podem criar outros árbitros.',
  }),
  JudgeManagement.create
);
routes.post('/sessions', SessionController.store);

routes.put('/users', JudgeManagement.update);

routes.get(
  '/athletes',
  AuthMiddleware({
    onlyNeedsValidTokens: true,
  }),
  AthleteController.index
);
routes.get(
  '/athletes/:id',
  AuthMiddleware({
    onlyNeedsValidTokens: true,
  }),
  AthleteController.show
);
routes.post(
  '/athletes',
  AuthMiddleware({
    onlyNeedsValidTokens: true,
  }),
  AthleteController.store
);
routes.put(
  '/athletes',
  AuthMiddleware({
    onlyNeedsValidTokens: true,
  }),
  AthleteController.update
);

export default routes;
