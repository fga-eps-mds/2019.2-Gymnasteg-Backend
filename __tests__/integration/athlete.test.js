import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('AthleteController', () => {
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

  describe('index', () => {
    it('Should return a list of all athletes with status 200.', async () => {
      await factory.createMany('Athlete', 10);
      const athletesList = await request(app)
        .get('/athletes')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(athletesList.body.length).toBe(10);
      expect(athletesList.status).toBe(200);
    });
  });

  describe('show', () => {
    it("Should return athlete's full information by their id with status 200.", async () => {
      const athlete = await factory.create('Athlete');
      const athleteInfo = await request(app)
        .get(`/athletes/${athlete.dataValues.id}`)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(athleteInfo.body).toMatchObject({
        date_born: expect.any(String),
        email: expect.any(String),
        gender: expect.any(String),
        id: expect.any(Number),
        name: expect.any(String),
        stands: expect.any(Array),
      });

      expect(athleteInfo.status).toBe(200);
    });

    it('Should return a validation failure message.', async () => {
      const response = await request(app)
        .get('/athletes/a')
        .send()
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return a non-existent athlete message.', async () => {
      const response = await request(app)
        .get('/athletes/1')
        .send()
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Atleta não existe!');
    });
  });

  describe('store', () => {
    it('Must return a successfully created athlete status of 200.', async () => {
      const athlete = await factory.attrs('Athlete');

      const response = await request(app)
        .post('/athletes')
        .send(athlete)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return validation failed message.', async () => {
      const athlete = await factory.attrs('Athlete', {
        gender: 'P',
      });

      const response = await request(app)
        .post('/athletes')
        .send(athlete)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return existing email message.', async () => {
      const { email } = await factory.create('JudgeWithPassword');
      const athlete = await factory.attrs('Athlete', {
        email,
      });

      const response = await request(app)
        .post('/athletes')
        .send(athlete)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('E-mail já cadastrado!');
    });
  });

  describe('update', () => {
    it("Should be able to update Athlete's data.", async () => {
      const { id, name, email, date_born } = await factory.create('Athlete');

      const response = await request(app)
        .put('/athletes')
        .send({
          id,
          name,
          email,
          date_born,
          gender: 'F',
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return the validation error message.', async () => {
      const { id } = await factory.create('Athlete');

      const response = await request(app)
        .put('/athletes')
        .send({
          id,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Athlete should return message does not exist.', async () => {
      const { email, name, gender, date_born } = await factory.create(
        'Athlete'
      );

      const response = await request(app)
        .put('/athletes')
        .send({
          id: 10,
          name,
          email,
          gender,
          date_born,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Atleta não existe.');
    });

    it('Must return existing email message.', async () => {
      const { id, name, gender, date_born } = await factory.create('Athlete');
      const { email } = await factory.create('JudgeWithPassword');

      const response = await request(app)
        .put('/athletes')
        .send({
          id,
          name,
          email,
          gender,
          date_born,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('E-mail já cadastrado!');
    });

    describe('destroy', () => {
      it('Must make athlete status 200 delete successfully.', async () => {
        const { id } = await factory.create('Athlete');

        const response = await request(app)
          .delete(`/athletes/${id}`)
          .send()
          .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

        expect(response.status).toBe(200);
      });

      it('Should return a validation failure message.', async () => {
        const response = await request(app)
          .delete(`/athletes/a`)
          .send()
          .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

        expect(response.body.error).toBe('Falha na validação das informações.');
      });

      it('Should return message that athlete does not exist.', async () => {
        const response = await request(app)
          .delete(`/athletes/1`)
          .send()
          .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

        expect(response.body.error).toBe('Atleta não existe.');
      });
    });
  });
});
