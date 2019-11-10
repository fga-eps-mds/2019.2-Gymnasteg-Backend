import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('SessionController', () => {
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

  it('Returns a token for a valid Coordinator account with status 200.', async () => {
    const coordinator = (await factory.create('Coordinator')).dataValues;

    const session = await request(app)
      .post('/sessions')
      .send({
        email: coordinator.email,
        password: coordinator.password,
      });

    expect(session.body).toHaveProperty('token');
    expect(session.status).toBe(200);
  });

  it('Returns a token for a valid Judge account with status 200.', async () => {
    const judge = (await factory.create('JudgeWithPassword')).dataValues;

    const session = await request(app)
      .post('/sessions')
      .send({
        email: judge.email,
        password: judge.password,
      });

    expect(session.body).toHaveProperty('token');
    expect(session.status).toBe(200);
  });

  it('Does not provide a token for invalid accounts with status 401.', async () => {
    const judge = (await factory.create('JudgeWithPassword')).dataValues;

    const session = await request(app)
      .post('/sessions')
      .send({
        email: judge.email,
        password: judge.password.slice(judge.password.length - 1),
      });

    expect(session.body).not.toHaveProperty('token');
    expect(session.status).toBe(401);
  });

  describe('Invalid e-mail rejection', () => {
    function testEmailRejection(description, emailFuzzer) {
      it(description, async () => {
        const judge = (await factory.build('Judge')).dataValues;
        judge.id = undefined;
        judge.email = emailFuzzer(judge.email);

        const response = await request(app)
          .post('/sessions')
          .send({ ...judge, token: await getCoordinatorSession() });

        expect(response.status).toBe(400);
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
});
