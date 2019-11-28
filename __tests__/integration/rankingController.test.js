import request from 'supertest';
import jwt from 'jsonwebtoken';
import authConfig from '../../src/config/auth';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('RankingController', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('show', () => {
    it('Must return a status of 200.', async () => {
      const modality = await factory.create('Modality');
      const judge = await factory.create('JudgeWithPassword');
      const coordinator = await factory.create('Coordinator');
      const athlete = await factory.create('Athlete');
      const { id } = await factory.create('Stand', {
        judges: [judge.dataValues.id],
        athlete: [athlete.dataValues.id],
        fk_modality_id: modality.dataValues.id,
        fk_coordinator_id: coordinator.dataValues.id,
      });

      const token = jwt.sign(
        { id: coordinator.dataValues.id, coord: true },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      const response = await request(app)
        .get(`/ranking/stand/${id}`)
        .set('Authentication', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('Must return a status of 200.', async () => {
      const { id } = await factory.create('Coordinator');

      const token = jwt.sign({ id, coord: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      const response = await request(app)
        .get('/ranking/stand/a')
        .set('Authentication', `Bearer ${token}`);

      expect(response.body.error).toBe('Falha na validação das informações!');
    });
  });
});
