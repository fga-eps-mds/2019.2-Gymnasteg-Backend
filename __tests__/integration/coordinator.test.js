import request from 'supertest';
import jwt from 'jsonwebtoken';
import authConfig from '../../src/config/auth';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('Coordinator', () => {
  beforeEach(async () => {
    await truncate();
  });

  async function getCoordinatorSession() {
    const coordinator = (await factory.create('Coordinator')).dataValues;

    const session = await request(app)
      .post('/sessions')
      .send({
        email: coordinator.email,
        password: coordinator.password,
      });

    return session.body.token;
  }

  describe('store', () => {
    it('Must return status 200 for successful registration of a coordinator.', async () => {
      const coordinator = await factory.attrs('Coordinator');

      const response = await request(app)
        .post('/coordinators')
        .send(coordinator);

      expect(response.status).toBe(200);
    });

    it('Should return validation failed message.', async () => {
      const coordinator = await factory.attrs('Coordinator', {
        name: null,
      });

      const response = await request(app)
        .post('/coordinators')
        .send(coordinator);

      expect(response.body.error).toBe('Falha na validação.');
    });

    it('Must return email message already registered.', async () => {
      const { email } = await factory.create('JudgeWithPassword');
      const coordinator = await factory.attrs('Coordinator', {
        email,
      });

      const response = await request(app)
        .post('/coordinators')
        .send(coordinator);

      expect(response.body.error).toBe('E-mail já cadastrado!');
    });
  });

  describe('show', () => {
    it('Must return status 200 for success to get coordinator information.', async () => {
      const { id } = await factory.create('Coordinator');

      const response = await request(app)
        .get(`/coordinators/${id}`)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return validation failure message.', async () => {
      const response = await request(app)
        .get('/coordinators/a')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return non-existent coordinator message.', async () => {
      const token = jwt.sign({ id: 1, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });
      const response = await request(app)
        .get('/coordinators/1')
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('Coordenador não existe!');
    });
  });

  describe('index', () => {
    it('Must return an array of registered coordinators.', async () => {
      await factory.createMany('Coordinator', 5);

      const response = await request(app)
        .get('/coordinators')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.length).toBe(6);
      expect(response.status).toBe(200);
    });
  });

  describe('update', () => {
    it('Should return a success status of 204 in coordinator update.', async () => {
      const { id, name, email, password } = await factory.create('Coordinator');

      const token = jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const response = await request(app)
        .put('/coordinators')
        .send({
          name,
          email,
          password,
          oldPassword: password,
        })
        .set('Authentication', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('Should return a validation error message.', async () => {
      const { id } = await factory.create('Coordinator');

      const token = jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const response = await request(app)
        .put('/coordinators')
        .send({
          name: 'Alan',
        })
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Should return coordinator message not found.', async () => {
      const token = jwt.sign({ id: 5, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const { name, email, password } = await factory.attrs('Coordinator');

      const response = await request(app)
        .put('/coordinators')
        .send({
          name,
          email,
          password,
          oldPassword: password,
        })
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('Coordenador não encontrado!');
    });

    it('Must return email message already registered.', async () => {
      const { email } = await factory.create('Coordinator');
      const { id, name, password } = await factory.create('Coordinator');

      const token = jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });
      const response = await request(app)
        .put('/coordinators')
        .send({
          name,
          email,
          password,
          oldPassword: password,
        })
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('E-mail já cadastrado!');
    });

    it('Should return a message that the current and new password differ from each other.', async () => {
      const { id, name, email, password } = await factory.create('Coordinator');

      const token = jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });
      const response = await request(app)
        .put('/coordinators')
        .send({
          name,
          email,
          password,
          oldPassword: '1111111',
        })
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('Senha incorreta!');
    });
  });
});
