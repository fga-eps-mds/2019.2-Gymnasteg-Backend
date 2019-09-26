import request from 'supertest';
import app from '../../src/app';

describe('Coordinator', () => {
  it('A rota post/coordenadores dever retornar um id de confirmação de cadastro', async () => {
    const response = await request(app)
      .post('/coordinators')
      .send({
        email: 'alan@alan.com',
        name: 'Alan',
        password_hash: 'alaan',
      });

    expect(response.body).toHaveProperty('id');
  });
});
