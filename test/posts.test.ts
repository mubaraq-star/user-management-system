// import request from 'supertest';
// import app from '../src/server';
// import db from '../src/db/knex';

// afterAll(async () => {
//   console.log('Destroying DB connection...');
//   await db.destroy();
//   await new Promise(resolve => setTimeout(resolve, 100)); // Ensure closure
// });

// describe('Posts API', () => {
//   const cleanupTestPost = async (title: string) => {
//     const post = await db('posts').where({ title }).first();
//     if (post) {
//       await db('posts').where({ id: post.id }).delete();
//     }
//   };

//   const cleanupTestUser = async (email: string) => {
//     const user = await db('users').where({ email }).first();
//     if (user) {
//       await db('posts').where({ user_id: user.id }).delete();
//       await db('addresses').where({ user_id: user.id }).delete();
//       await db('users').where({ id: user.id }).delete();
//     }
//   };

//   let testUserId: number;

//   beforeAll(async () => {
//     const testEmail = `posttest_${Date.now()}@example.com`;
//     await cleanupTestUser(testEmail);
//     [testUserId] = await db('users').insert({
//       name: 'postuser',
//       email: testEmail,
//       password: `postpass_${Date.now()}`,
//       created_at: new Date().toISOString()
//     });
//   });

//   afterAll(async () => {
//     await cleanupTestUser(`posttest_${testUserId}@example.com`);
//   });

//   describe('POST /posts', () => {
//     it('should create a post', async () => {
//       const testTitle = `Test Post ${Date.now()}`;
//       await cleanupTestPost(testTitle);

//       const res = await request(app)
//         .post('/posts')
//         .send({
//           user_id: testUserId,
//           title: testTitle,
//           body: 'Post content'
//         });

//       expect(res.status).toBe(201);
//       expect(res.body).toHaveProperty('message', 'Post created successfully');
//       expect(res.body).toHaveProperty('id');

//       await cleanupTestPost(testTitle);
//     });
//   });

//   describe('GET /posts?userId={userId}', () => {
//     it('should return posts for a user', async () => {
//       const testTitle = `Test Post ${Date.now()}`;
//       await cleanupTestPost(testTitle);

//       await db('posts').insert({
//         user_id: testUserId,
//         title: testTitle,
//         body: 'Content',
//         created_at: new Date().toISOString()
//       });

//       const res = await request(app).get(`/posts?userId=${testUserId}`);
//       expect(res.status).toBe(200);
//       expect(Array.isArray(res.body)).toBe(true);
//       expect(res.body[0]).toHaveProperty('title', testTitle);

//       await cleanupTestPost(testTitle);
//     });

//     it('should return 400 if userId is missing', async () => {
//       const res = await request(app).get('/posts');
//       expect(res.status).toBe(400);
//       expect(res.body).toHaveProperty('message', 'userId query parameter is required');
//     });
//   });

//   describe('DELETE /posts/:id', () => {
//     it('should delete a post', async () => {
//       const testTitle = `Test Post ${Date.now()}`;
//       await cleanupTestPost(testTitle);

//       const [postId] = await db('posts').insert({
//         user_id: testUserId,
//         title: testTitle,
//         body: 'Content',
//         created_at: new Date().toISOString()
//       });

//       const res = await request(app).delete(`/posts/${postId}`);
//       expect(res.status).toBe(204);
//     });

//     it('should return 404 for non-existent post', async () => {
//       const nonExistentId = 9999;
//       await db('posts').where({ id: nonExistentId }).delete();

//       const res = await request(app).delete(`/posts/${nonExistentId}`);
//       expect(res.status).toBe(404);
//       expect(res.body).toHaveProperty('message', 'Post not found');
//     });
//   });
// });



import request from 'supertest';
import app from '../src/server';
import db from '../src/db/knex';

afterAll(async () => {
  console.log('Destroying DB connection...');
  await db.destroy();
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Posts API', () => {
  const cleanupTestPost = async (title: string) => {
    const post = await db('posts').where({ title }).first();
    if (post) {
      await db('posts').where({ id: post.id }).delete();
    }
  };

  const cleanupTestUser = async (email: string) => {
    const user = await db('users').where({ email }).first();
    if (user) {
      await db('posts').where({ user_id: user.id }).delete();
      await db('addresses').where({ user_id: user.id }).delete();
      await db('users').where({ id: user.id }).delete();
    }
  };

  let testUserId: number;

  beforeAll(async () => {
    const testEmail = `posttest_${Date.now()}@example.com`;
    await cleanupTestUser(testEmail);
    [testUserId] = await db('users').insert({
      name: 'postuser',
      email: testEmail,
      password: `postpass_${Date.now()}`,
      created_at: new Date().toISOString()
    });
  });

  afterAll(async () => {
    await cleanupTestUser(`posttest_${testUserId}@example.com`);
  });

  describe('POST /posts', () => {
    it('should create a post', async () => {
      const testTitle = `Test Post ${Date.now()}`;
      await cleanupTestPost(testTitle);

      const res = await request(app)
        .post('/posts')
        .send({
          user_id: testUserId,
          title: testTitle,
          body: 'Post content'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Post created successfully');
      expect(res.body).toHaveProperty('id');

      await cleanupTestPost(testTitle);
    });
  });

  describe('GET /posts?userId={userId}', () => {
    it('should return posts for a user', async () => {
      const testTitle = `Test Post ${Date.now()}`;
      await cleanupTestPost(testTitle);

      await db('posts').insert({
        user_id: testUserId,
        title: testTitle,
        body: 'Content',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get(`/posts?userId=${testUserId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('title', testTitle);

      await cleanupTestPost(testTitle);
    });

    it('should return 400 if userId is missing', async () => {
      const res = await request(app).get('/posts');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'userId query parameter is required');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      const testTitle = `Test Post ${Date.now()}`;
      await cleanupTestPost(testTitle);

      const [postId] = await db('posts').insert({
        user_id: testUserId,
        title: testTitle,
        body: 'Content',
        created_at: new Date().toISOString()
      });

      const res = await request(app).delete(`/posts/${postId}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = 9999;
      await db('posts').where({ id: nonExistentId }).delete();

      const res = await request(app).delete(`/posts/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Post not found');
    });
  });
});