const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('StudyVerse API is running');
  });

  it('GET /api should return API info', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.endpoints).toBeDefined();
  });

  it('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/some-unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Authentication Routes', () => {
  it('POST /api/auth/login without body should return 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/auth/login with invalid phone should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: 'invalid', firebaseToken: 'some-token' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/profile without token should return 401', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/profile with invalid token should return 401', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Customer Routes', () => {
  it('GET /api/customers without token should return 401', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
  });

  it('POST /api/customers without token should return 401', async () => {
    const res = await request(app).post('/api/customers').send({ name: 'Test', phone: '9876543210' });
    expect(res.status).toBe(401);
  });
});

describe('Transaction Routes', () => {
  it('GET /api/transactions without token should return 401', async () => {
    const res = await request(app).get('/api/transactions/customer/some-id');
    expect(res.status).toBe(401);
  });

  it('POST /api/transactions without token should return 401', async () => {
    const res = await request(app).post('/api/transactions').send({});
    expect(res.status).toBe(401);
  });
});

describe('Payment Routes', () => {
  it('POST /api/payments/initiate without token should return 401', async () => {
    const res = await request(app).post('/api/payments/initiate').send({});
    expect(res.status).toBe(401);
  });
});

describe('Reminder Routes', () => {
  it('GET /api/reminders without token should return 401', async () => {
    const res = await request(app).get('/api/reminders');
    expect(res.status).toBe(401);
  });
});
