import request from 'supertest';
import app from '../src/server';
import db from '../src/db/knex';

afterAll(async () => {
  console.log('Destroying DB connection...');
  await db.destroy();
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Addresses API', () => {
  const cleanupTestAddress = async (userId: number, street: string) => {
    await db('addresses').where({ user_id: userId, street }).delete();
  };

  const cleanupTestUser = async (email: string) => {
    const user = await db('users').where({ email }).first();
    if (user) {
      await db('addresses').where({ user_id: user.id }).delete();
      await db('users').where({ id: user.id }).delete();
    }
  };

  let testUserId: number;

  beforeAll(async () => {
    const testEmail = `addresstest_${Date.now()}@example.com`;
    await cleanupTestUser(testEmail);
    [testUserId] = await db('users').insert({
      name: 'addressuser',
      email: testEmail,
      password: `addrpass_${Date.now()}`,
      created_at: new Date().toISOString()
    });
  });

  afterAll(async () => {
    await cleanupTestUser(`addresstest_${testUserId}@example.com`);
  });

  describe('POST /addresses', () => {
    it('should create an address', async () => {
      const testStreet = `123 St ${Date.now()}`;
      await cleanupTestAddress(testUserId, testStreet);

      const res = await request(app)
        .post('/addresses')
        .send({
          user_id: testUserId,
          street: testStreet,
          city: 'City',
          state: 'TS',
          zip_code: '12345'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Address created successfully');

      await cleanupTestAddress(testUserId, testStreet);
    });
  });

  describe('GET /addresses/:userID', () => {
    it('should return an address', async () => {
      const testStreet = `123 St ${Date.now()}`;
      await cleanupTestAddress(testUserId, testStreet);

      await db('addresses').insert({
        user_id: testUserId,
        street: testStreet,
        city: 'City',
        state: 'TS',
        zip_code: '12345'
      });

      const res = await request(app).get(`/addresses/${testUserId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('street', testStreet);

      await cleanupTestAddress(testUserId, testStreet);
    });

    it('should return 404 for non-existent address', async () => {
      const nonExistentUserId = 9999;
      await db('addresses').where({ user_id: nonExistentUserId }).delete();

      const res = await request(app).get(`/addresses/${nonExistentUserId}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Address not found',
        timestamp: expect.any(String),
        path: `/addresses/${nonExistentUserId}`
      });
    });
  });

  describe('PATCH /addresses/:userID', () => {
    it('should update an address', async () => {
      const testStreet = `123 St ${Date.now()}`;
      const newStreet = `456 New St ${Date.now()}`;
      await cleanupTestAddress(testUserId, testStreet);

      await db('addresses').insert({
        user_id: testUserId,
        street: testStreet,
        city: 'City',
        state: 'TS',
        zip: '12345'
      });

      const res = await request(app)
        .patch(`/addresses/${testUserId}`)
        .send({
          user_id: testUserId, // Include required field
          street: newStreet,
          city: 'City',
          state: 'TS', // Include required field
          zip: '12345'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Address updated successfully');

      await cleanupTestAddress(testUserId, newStreet);
    });
  });
});