import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

describe('Coordinator', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('A rota post/coordenadores dever retornar um id de confirmação de cadastro', async () => {
    const response = await request(app)
      .post('/coordinators')
      .send({
        email: 'alan@alan.com',
        name: 'Alan',
        password: 'alaan',
      });

    expect(response.body).toHaveProperty('id');
  });
});
