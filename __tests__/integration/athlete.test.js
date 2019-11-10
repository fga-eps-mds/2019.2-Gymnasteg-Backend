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
  });

  describe('update', () => {
    it("Should be able to update Athlete's data.", async () => {
      const athlete = await factory.create('Athlete');

      const athleteInfo = await request(app)
        .put(`/athletes/${athlete.dataValues.id}`)
        .send({ id: athlete.id })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);
    });
  });
});
