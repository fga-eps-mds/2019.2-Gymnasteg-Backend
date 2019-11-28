import request from 'supertest';
import jwt from 'jsonwebtoken';
import authConfig from '../../src/config/auth';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('JudgeManagement', () => {
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

  describe('Judges listing', () => {
    describe('Authentication', () => {
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
          .set('Authentication', `Bearer ${session.body.token}`);

        expect(response.status).toBe(401);
      });

      it('Should return status 401 if the provided token is invalid.', async () => {
        const response = await request(app)
          .get('/judges')
          .set('Authentication', `Bearer asaksaksjasmkamzkakasj`);

        expect(response.status).toBe(401);
      });

      it('Should return status 200 if a token for a coordinator is provided.', async () => {
        const coordinatorToken = await getCoordinatorSession();
        const response = await request(app)
          .get('/judges')
          .set('Authentication', `Bearer ${coordinatorToken}`);

        expect(response.status).toBe(200);
      });
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
        .set('Authentication', `Bearer ${session.body.token}`);

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
          .send(judge)
          .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

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

  describe('Authentication', () => {
    it('Should return status 401 if no token is provided.', async () => {
      const judge = (await factory.build('Judge')).dataValues;
      judge.id = undefined;

      const response = await request(app)
        .post('/createJudge')
        .send(judge);

      expect(response.status).toBe(401);
    });

    it('Should return status 401 if a token for a judge is provided.', async () => {
      const judge = await factory.create('JudgeWithPassword');
      const session = await request(app)
        .post('/sessions')
        .send({ email: judge.email, password: judge.password });

      const judgeToCreate = (await factory.build('Judge')).dataValues;
      judgeToCreate.id = undefined;

      const response = await request(app)
        .post('/createJudge')
        .send(judgeToCreate)
        .set('Authentication', `Bearer ${session.body.token}`);

      expect(response.status).toBe(401);
    });

    it('Should return status 401 if the provided token is invalid.', async () => {
      const judge = (await factory.build('Judge')).dataValues;
      judge.id = undefined;

      const response = await request(app)
        .post('/createJudge')
        .send(judge)
        .set('Authentication', `Bearer asaksaksjasmkamzkakasj`);

      expect(response.status).toBe(401);
    });

    it('Should return status 201 if a token for a coordinator is provided.', async () => {
      const judge = (await factory.build('Judge')).dataValues;
      judge.id = undefined;

      const response = await request(app)
        .post('/createJudge')
        .send(judge)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(201);
    });
  });

  it('Should generate a password that is at least 12 characters long.', async () => {
    const judge = (await factory.build('Judge')).dataValues;
    judge.id = undefined;

    const response = await request(app)
      .post('/createJudge')
      .send(judge)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.body.password.length).toBeGreaterThanOrEqual(12);
  });

  describe('Duplicated Judge prevention.', () => {
    it('Should return status 409 when a Judge has already been registered.', async () => {
      const judge = (await factory.build('Judge')).dataValues;
      judge.id = undefined;

      await request(app)
        .post('/createJudge')
        .send(judge)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);
      const response = await request(app)
        .post('/createJudge')
        .send(judge)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(409);
    });
  });

  describe('show', () => {
    it('Must return status 200 to successfully return a judge by id.', async () => {
      const { id } = await factory.create('JudgeWithPassword');

      const response = await request(app)
        .get(`/judges/${id}`)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return validation failure message because of the absence of get id.', async () => {
      const response = await request(app)
        .get('/judges/a')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return non-existent judge message.', async () => {
      const response = await request(app)
        .get('/judges/1')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Árbitro não existe!');
    });
  });

  describe('showJudge', () => {
    it('Must return a status of 200 for a judge to display by the judge session.', async () => {
      const { id } = await factory.create('JudgeWithPassword');

      const token = jwt.sign({ id, coord: false }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const response = await request(app)
        .get('/judgeData')
        .set('Authentication', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('update', () => {
    it('Must return status 200 to successfully upgrade the judge.', async () => {
      const { id, name, email, judge_type } = await factory.create(
        'JudgeWithPassword'
      );

      const response = await request(app)
        .put('/judges')
        .send({
          id,
          name,
          email,
          judge_type,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return error message in validating information.', async () => {
      const { id, name, email } = await factory.create('JudgeWithPassword');

      const response = await request(app)
        .put('/judges')
        .send({
          id,
          name,
          email,
          judge_type: 10,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return non-existent judge message.', async () => {
      const { name, email, judge_type } = await factory.attrs(
        'JudgeWithPassword'
      );

      const response = await request(app)
        .put('/judges')
        .send({
          id: 1,
          name,
          email,
          judge_type,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Árbitro não existe!');
    });

    it('Must return existing email message.', async () => {
      const { email } = await factory.create('JudgeWithPassword');
      const { id, name, judge_type } = await factory.create(
        'JudgeWithPassword'
      );

      const response = await request(app)
        .put('/judges')
        .send({
          id,
          name,
          email,
          judge_type,
        })
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('E-mail já cadastrado!');
    });
  });

  describe('destroy', () => {
    it('Must return status 200 for judge exclusion.', async () => {
      const { id } = await factory.create('JudgeWithPassword');

      const response = await request(app)
        .delete(`/judges/${id}`)
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.status).toBe(200);
    });

    it('Should return information validation failed message because of incorrect id.', async () => {
      const response = await request(app)
        .delete('/judges/a')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Falha na validação das informações.');
    });

    it('Must return non-existent judge message.', async () => {
      const response = await request(app)
        .delete('/judges/1')
        .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

      expect(response.body.error).toBe('Árbitro não existe!');
    });
  });
});
