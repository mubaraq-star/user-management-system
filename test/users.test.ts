import request from 'supertest';
import app from '../src/server';
import db from '../src/db/knex';

afterAll(async () => {
  console.log('Destroying DB connection...');
  await db.destroy(); // Cleanly close connection
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Users API', () => {
  // Helper function to clean up test data by email
  const cleanupTestUser = async (email: string) => {
    const user = await db('users').where({ email }).first();
    if (user) {
      await db('addresses').where({ user_id: user.id }).delete();
      await db('users').where({ id: user.id }).delete();
    }
  };

  describe('GET /users', () => {
    it('should return a list of users with pagination', async () => {
      const testEmail1 = `test1_${Date.now()}@example.com`;
      const testEmail2 = `test2_${Date.now()}@example.com`;
      await cleanupTestUser(testEmail1);
      await cleanupTestUser(testEmail2);

      await db('users').insert([
        { name: 'user1', email: testEmail1, password: `pass1_${Date.now()}`, created_at: new Date().toISOString() },
        { name: 'user2', email: testEmail2, password: `pass2_${Date.now()}`, created_at: new Date().toISOString() }
      ]);

      const res = await request(app)
        .get('/users')
        .query({ pageNumber: 0, pageSize: 10 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      await cleanupTestUser(testEmail1);
      await cleanupTestUser(testEmail2);
    });
  });

  describe('GET /users/count', () => {
    it('should return the total count of users', async () => {
      const testEmail = `testcount_${Date.now()}@example.com`;
      await cleanupTestUser(testEmail);

      await db('users').insert({
        name: 'testuser',
        email: testEmail,
        password: `passwordcount_${Date.now()}`, // Unique password
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/users/count');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(typeof res.body.total).toBe('number');

      await cleanupTestUser(testEmail);
    });
  });

  describe('POST /users/:id', () => {
    it('should create a user', async () => {
      const testEmail = `test_${Date.now()}@example.com`;
      await cleanupTestUser(testEmail);

      const uniquePassword = `password_${Date.now()}`;
      const res = await request(app)
        .post('/users/999') // :id ignored by controller
        .send({
          name: 'testuser',
          email: testEmail,
          password: uniquePassword
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
      expect(res.body).toHaveProperty('id');

      await cleanupTestUser(testEmail);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user with address', async () => {
      const testEmail = `test2_${Date.now()}@example.com`;
      await cleanupTestUser(testEmail);

      const uniquePassword = `password_${Date.now()}`;
      const [userId] = await db('users').insert({
        name: 'testuser',
        email: testEmail,
        password: uniquePassword,
        created_at: new Date().toISOString()
      });
      await db('addresses').insert({
        user_id: userId,
        street: '123 St',
        city: 'City',
        state: 'TS',
        zip
        : '12345'
      });

      const res = await request(app).get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'testuser');
      expect(res.body.address).toHaveProperty('street', '123 St');

      await cleanupTestUser(testEmail);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = 9999;
      await db('users').where({ id: nonExistentId }).delete();

      const res = await request(app).get(`/users/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'User not found',
        timestamp: expect.any(String),
        path: `/users/${nonExistentId}`
      });
    });
  });
});