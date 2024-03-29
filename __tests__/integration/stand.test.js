import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
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

  it('A rota get/bancas deve retornar a lista de bancas cadastradas', async () => {
    const { id } = await factory.create('Modality');

    await factory.create('Stand', {
      fk_modality_id: id,
    });

    const response = await request(app)
      .get('/stands')
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.status).toBe(200);
  });

  it('A rota get/bancas/:id deve retornar um banca cadastrada pelo id', async () => {
    const modality = await factory.create('Modality');

    const { id } = await factory.create('Stand', {
      fk_modality_id: modality.id,
    });

    const response = await request(app)
      .get(`/stands/${id}`)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.status).toBe(200);
  });

  it('A rota get/bancas/:id deve retornar um status 400', async () => {
    const response = await request(app)
      .get(`/stands/-1`)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.status).toBe(400);
  });

  it('A rota get/bancas/:id deve retornar status 400 por não existir banca com id informado', async () => {
    const response = await request(app)
      .get(`/stands/500`)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.status).toBe(400);
  });

  it('A rota post/bancas deve retonar uma id de confirmação de cadastro de banca', async () => {
    const { id } = await factory.create('Modality');
    const judge = await factory.create('JudgeWithPassword');
    const athlete = await factory.create('Athlete');

    const stand = await factory.attrs('Stand', {
      fk_modality_id: id,
      judges: [judge.id],
      athletes: [athlete.id],
    });

    const response = await request(app)
      .post('/stands')
      .send(stand)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.body).toHaveProperty('id');
  });

  it('A rota post/bancas deve retonar mensagem de erro de validação de dados', async () => {
    const { id } = await factory.create('Modality');

    const stand = await factory.attrs('Stand', {
      num_stand: -1,
      fk_modality_id: id,
    });

    const response = await request(app)
      .post('/stands')
      .send(stand)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);
    expect(response.body.error).toBe('Falha na validação das informações.');
  });

  it('A rota put/bancas deve atualizar uma banca com as informações passada via post', async () => {
    const modality = await factory.create('Modality');
    const judge = await factory.create('JudgeWithPassword');
    const athlete = await factory.create('Athlete');

    const {
      id,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
    } = await factory.create('Stand', {
      fk_modality_id: modality.id,
    });

    const stand = {
      id,
      num_stand: 1,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
      judges: [judge.id],
      athletes: [athlete.id],
    };

    const response = await request(app)
      .put('/stands')
      .send(stand)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.body.num_stand).toBe(1);
  });

  it('A rota put/bancas deve apresentar mensagem de erro de validação das informações', async () => {
    const modality = await factory.create('Modality');
    const judge = await factory.create('JudgeWithPassword');
    const athlete = await factory.create('Athlete');

    const {
      id,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
    } = await factory.create('Stand', {
      fk_modality_id: modality.id,
    });

    const stand = {
      id,
      num_judge: -1,
      qtd_judge,
      sex_modality,
      category_age,
      date_event,
      horary,
      fk_modality_id,
      judges: [judge.id],
      athletes: [athlete.id],
    };

    const response = await request(app)
      .put('/stands')
      .send(stand)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.body.error).toBe('Falha na validação das informações.');
  });

  it('A rota put/bancas deve apresentar mensagem de erro de Banca não existe', async () => {
    const modality = await factory.create('Modality');
    const judge = await factory.create('JudgeWithPassword');
    const athlete = await factory.create('Athlete');

    const stand = await factory.attrs('Stand', {
      id: -1,
      fk_modality_id: modality.id,
      judges: [judge.id],
      athletes: [athlete.id],
    });

    const response = await request(app)
      .put('/stands')
      .send(stand)
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(response.body.error).toBe('Banca não existe.');
  });

  it('A rota delete/stands deve excluir a banca cadastrada com um retorno de estado 200', async () => {
    const modality = await factory.create('Modality');
    const coordinator = await factory.create('Coordinator');
    const stand = await factory.create('Stand', {
      fk_coordinator_id: coordinator.id,
      fk_modality_id: modality.id,
    });

    const reponse = await request(app)
      .delete(`/stands/${stand.id}`)
      .send()
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(reponse.status).toBe(200);
  });

  it('A rota delete/stands deve retornar mensagem de error de validação por causa do id negativo', async () => {
    const response = await request(app)
      .delete('/stands/-5')
      .send()
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);
    expect(response.body.error).toBe('Falha na validação das informações.');
  });

  it('A rota delete/stands deve retornar uma messagem de banca não existente', async () => {
    const modality = await factory.create('Modality');
    const coordinator = await factory.create('Coordinator');
    await factory.create('Stand', {
      fk_coordinator_id: coordinator.id,
      fk_modality_id: modality.id,
    });

    const reponse = await request(app)
      .delete('/stands/1000')
      .send()
      .set('Authentication', `Bearer ${await getCoordinatorSession()}`);

    expect(reponse.body.error).toBe('Banca não existe.');
  });
});
