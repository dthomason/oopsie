import request from 'supertest';

import app from '../../app';

describe('GET /healthz', () => {
  it('returns 200 Ok', async () => {
    const response = await request(app).get('/healthz').expect(200);

    expect(response.body).toBe('Success!!');
  });
});
