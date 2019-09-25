import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('A rota get/bancas deve retornar a lista de bancas cadastradas', async () => {
    const { id } = await factory.create('Modalidade');

    await factory.create('Banca', {
      fk_modalidade_id: id,
    });

    const response = await request(app)
      .get('/bancas')
      .send();

    expect(response.status).toBe(200);
  });

  it('A rota get/bancas/:id deve retornar um banca cadastrada pelo id', async () => {
    const { idModalidade } = await factory.create('Modalidade');

    const { id } = await factory.create('Banca', {
      fk_modalidade_id: idModalidade,
    });

    const response = await request(app)
      .get(`/bancas/${id}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('A rota get/bancas/:id deve retornar um status 400', async () => {
    const response = await request(app)
      .get(`/bancas/-1`)
      .send();

    expect(response.status).toBe(400);
  });

  it('A rota get/bancas/:id deve retornar status 400 por não existir banca com id informado', async () => {
    const response = await request(app)
      .get(`/bancas/1`)
      .send();

    expect(response.status).toBe(400);
  });

  it('A rota post/bancas deve retonar uma id de confirmação de cadastro de banca', async () => {
    const { id } = await factory.create('Modalidade');

    const banca = await factory.attrs('Banca', {
      fk_modalidade_id: id,
    });

    const response = await request(app)
      .post('/bancas')
      .send(banca);

    expect(response.body).toHaveProperty('id');
  });

  it('A rota post/bancas deve retonar mensagem de erro de validação de dados', async () => {
    const { id } = await factory.create('Modalidade');

    const banca = await factory.attrs('Banca', {
      num_banca: -1,
      fk_modalidade_id: id,
    });

    const response = await request(app)
      .post('/bancas')
      .send(banca);
    expect(response.body.error).toBe('Falha na validação das informações');
  });

  it('A rota put/bancas deve atualizar uma banca com as informações passada via post', async () => {
    const modalidade = await factory.create('Modalidade');

    const {
      id,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    } = await factory.create('Banca', {
      fk_modalidade_id: modalidade.id,
    });

    const banca = {
      id,
      num_banca: 1,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    };

    const response = await request(app)
      .put('/bancas')
      .send(banca);

    expect(response.body.num_banca).toBe(1);
  });

  it('A rota put/bancas deve apresentar mensagem de erro de validação das informações', async () => {
    const modalidade = await factory.create('Modalidade');

    const {
      id,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    } = await factory.create('Banca', {
      fk_modalidade_id: modalidade.id,
    });

    const banca = {
      id,
      num_banca: -1,
      qtd_arbitro,
      sexo,
      data_evento,
      horario,
      fk_modalidade_id,
    };

    const response = await request(app)
      .put('/bancas')
      .send(banca);

    expect(response.body.error).toBe('Falha na validação das informações');
  });

  it('A rota put/bancas deve apresentar mensagem de erro de Banca não existe', async () => {
    const modalidade = await factory.create('Modalidade');

    const banca = await factory.attrs('Banca', {
      id: -1,
      fk_modalidade_id: modalidade.id,
    });

    const response = await request(app)
      .put('/bancas')
      .send(banca);

    expect(response.body.error).toBe('Banca não existe');
  });
});
