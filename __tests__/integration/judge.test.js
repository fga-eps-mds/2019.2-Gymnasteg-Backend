import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('JudgeController', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Duplicated Judge prevention.', () => {
    it('Should return status 409 when a Judge has already been registered.', async () => {
      const judge = (await factory.build('Judge')).dataValues;
      judge.id = undefined;

      await request(app)
        .post('/createJudge')
        .send(judge);
      const response = await request(app)
        .post('/createJudge')
        .send(judge);

      expect(response.status).toBe(409);
    });
  });

  describe('Judges listing', () => {
    it('Should return status 401 if no token is provided.', async () => {
      const response = await request(app).get('/judges');

      expect(response.status).toBe(401);
    });

    it('Should return status 401 if a token for a judge is provided.', async () => {
      const judge = await factory.create('JudgeWithPassword');
      const session = await request(app)
        .post('/sessions')
        .send({ email: judge.email, password: judge.password });
      const response = await request(app)
        .get('/judges')
        .send({ token: session.body.token });

      expect(response.status).toBe(401);
    });

    it('Should return status 200 if a token for a coordinator is provided.', async () => {
      const coordinator = (await factory.create('Coordinator')).dataValues;

      const session = await request(app)
        .post('/sessions')
        .send({
          email: coordinator.email,
          password: coordinator.password,
        });
      const response = await request(app)
        .get('/judges')
        .send({ token: session.body.token });

      expect(response.status).toBe(200);
    });

    it('Should return all existing judges.', async () => {
      const coordinator = (await factory.create('Coordinator')).dataValues;
      const session = await request(app)
        .post('/sessions')
        .send({
          email: coordinator.email,
          password: coordinator.password,
        });
      await factory.createMany('JudgeWithPassword', 3);

      const response = await request(app)
        .get('/judges')
        .send({ token: session.body.token });

      expect(response.body.length).toBe(3);
    });
  });

  describe('Invalid e-mail rejection', () => {
    function testEmailRejection(description, emailFuzzer) {
      it(description, async () => {
        const judge = (await factory.build('Judge')).dataValues;
        judge.id = undefined;
        judge.email = emailFuzzer(judge.email);

        const response = await request(app)
          .post('/createJudge')
          .send(judge);

        expect(response.status).toBe(500);
      });
    }

    testEmailRejection('Should reject emails missing an @.', email => {
      return email.replace('@', '');
    });

    testEmailRejection(
      'Should reject emails missing a dot after the @.',
      email => {
        function replaceLast(find, replace, string) {
          const lastIndex = string.lastIndexOf(find);

          if (lastIndex === -1) {
            return string;
          }

          const beginString = string.substring(0, lastIndex);
          const endString = string.substring(lastIndex + find.length);

          return beginString + replace + endString;
        }

        return replaceLast('.', '', email);
      }
    );
  });

  it('Should generate a password that is at least 12 characters long.', async () => {
    const judge = (await factory.build('Judge')).dataValues;
    judge.id = undefined;

    const response = await request(app)
      .post('/createJudge')
      .send(judge);

    expect(response.body.password.length).toBeGreaterThanOrEqual(12);
  });
});
