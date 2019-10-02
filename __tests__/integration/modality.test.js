import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('Modality', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('The get/modalities route should return the list of modalities registered.', async () => {
    const response = await request(app)
      .get('/modalities')
      .send();
    expect(response.status).toBe(200);
  });

  it('The get/modalities/:id route must return a modality registered with the id entered', async () => {
    const { id } = await factory.create('Modality');

    const response = await request(app)
      .get(`/modalities/${id}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('The get/modalities/:id route should return id validation error message', async () => {
    const response = await request(app)
      .get('/modalities/-1')
      .send();

    expect(response.body.error).toBe('Falha de Validação!');
  });

  it('The get/modalities/:id route should return error modality does not exist', async () => {
    const response = await request(app)
      .get('/modalities/900')
      .send();

    expect(response.body.error).toBe('Modalidade não existe!');
  });

  it('The post/modalities route must return a modality registration confirmation id', async () => {
    const modality = await factory.attrs('Modality');

    const response = await request(app)
      .post('/modalities')
      .send(modality);

    expect(response.body).toHaveProperty('id');
  });

  it('The get/modalities/:id route should return id validation error message', async () => {
    const modality = await factory.attrs('Modality', {
      type: '',
    });

    const response = await request(app)
      .post('/modalities')
      .send(modality);

    expect(response.body.error).toBe('Falha de Validação!');
  });

  it('The put/modalities route should return an object with updated information', async () => {
    const { id, url_image } = await factory.create('Modality');

    const modality = {
      id,
      type: 'Teste',
      url_image,
    };

    const response = await request(app)
      .put('/modalities')
      .send(modality);

    expect(response.body.type).toBe(modality.type);
  });

  it('The put/modalities route should return id validation error message', async () => {
    const modality = {};

    const response = await request(app)
      .put('/modalities')
      .send(modality);

    expect(response.body.error).toBe('Falha de Validação!');
  });

  it('The put/modalities route should return error modality does not exist', async () => {
    const modality = {
      id: 1,
      type: 'asdasd',
      url_image: 'asdlaksdk',
    };

    const response = await request(app)
      .put('/modalities')
      .send(modality);

    expect(response.body.error).toBe('Modalidade não existe!');
  });
});
