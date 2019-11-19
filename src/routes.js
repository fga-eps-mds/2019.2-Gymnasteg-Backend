import { Router } from 'express';
import JudgeManagement from './app/controllers/JudgeManagement';
import SessionController from './app/controllers/SessionController';
import ModalityController from './app/controllers/ModalityController';
import StandController from './app/controllers/StandController';
import CoordinatorController from './app/controllers/CoordinatorController';
import AthleteController from './app/controllers/AthleteController';
import RankingController from './app/controllers/RankingController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/modalities', ModalityController.index);
routes.get('/modalities/:id', ModalityController.show);
routes.post('/modalities', ModalityController.store);
routes.put('/modalities', ModalityController.update);

routes.post('/coordinators', CoordinatorController.store);
routes.get(
  '/coordinators/:id',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Acesso Negado.',
  }),
  CoordinatorController.show
);
routes.get(
  '/coordinators',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Acesso Negado.',
  }),
  CoordinatorController.index
);
routes.put(
  '/coordinators',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Acesso Negado.',
  }),
  CoordinatorController.update
);

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
routes.delete(
  '/stands/:id',
  AuthMiddleware({
    isCoordinatorRoute: true,
    authenticationErrorMessage: 'Requisição negada.',
  }),
  StandController.destroy
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
routes.get(
  '/judgeData/',
  AuthMiddleware({
    isCoordinatorRoute: false,
    authenticationErrorMessage:
      'Coordenadores não possuem bancas para avaliar.',
  }),
  JudgeManagement.show
);

routes.delete(
  '/judges/:id',
  AuthMiddleware({
    isCoordinatorRoute: true,
  }),
  JudgeManagement.destroy
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
routes.delete(
  '/athletes/:id',
  AuthMiddleware({
    isCoordinatorRoute: true,
    onlyNeedsValidTokens: true,
  }),
  AthleteController.destroy
);

routes.get(
  '/ranking/stand/:id_stand',
  AuthMiddleware({
    isCoordinatorRoute: true,
    onlyNeedsValidTokens: true,
  }),
  RankingController.show
);

export default routes;
