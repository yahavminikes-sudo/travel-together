import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';

const app = getTestApp();

describe('Post API Endpoints', () => {
  let authToken = '';
  let authUserId = '';

  const authenticateUser = async () => {
    const uniqueId = Math.random().toString(36).slice(2, 10);
    const validUser = {
      username: `posttester_${uniqueId}`,
      email: `posttester_${uniqueId}@example.com`,
      password: 'Password123!'
    };

    await request(app).post('/api/auth/register').send(validUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: validUser.email,
      password: validUser.password
    });
    authToken = loginRes.body.token;
    authUserId = loginRes.body.user._id;
  };

  const createPost = async (overrides = {}) => {
    return request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
      destination: 'Japan',
      title: 'My Journey to Japan',
      content: 'It was an amazing experience exploring Tokyo.',
      imageUrl: 'https://example.com/japan.jpg',
      ...overrides
    });
  };

  beforeEach(async () => {
    await authenticateUser();
  });

  describe('POST /api/posts', () => {
    it('should create a new post when authenticated', async () => {
      const response = await createPost();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', 'My Journey to Japan');
      expect(response.body).toHaveProperty('authorId', authUserId);
      expect(response.body).toHaveProperty('imageUrl', 'https://example.com/japan.jpg');
    });

    it('should return 401 when missing auth token', async () => {
      const response = await request(app).post('/api/posts').send({ title: 'Test', content: 'Test' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should return 400 when imageUrl is missing', async () => {
      const response = await request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
        destination: 'Japan',
        title: 'My Journey to Japan',
        content: 'It was an amazing experience exploring Tokyo.'
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Invalid input: expected string, received undefined');
    });
  });

  describe('GET /api/posts (Pagination)', () => {
    it('should retrieve paginated posts with default pagination', async () => {
      for (let i = 0; i < 15; i++) {
        await createPost({ title: `Post ${i + 1}` });
      }

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body).toHaveProperty('hasMore');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });

    it('should retrieve posts with custom page and limit', async () => {
      for (let i = 0; i < 25; i++) {
        await createPost({ title: `Post ${i + 1}` });
      }

      const response = await request(app).get('/api/posts?page=2&limit=5');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should return hasMore: false when on last page', async () => {
      for (let i = 0; i < 5; i++) {
        await createPost({ title: `Post ${i + 1}` });
      }

      const response = await request(app).get('/api/posts?page=1&limit=10');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.hasMore).toBe(false);
    });

    it('should return hasMore: true when more results exist', async () => {
      for (let i = 0; i < 15; i++) {
        await createPost({ title: `Post ${i + 1}` });
      }

      const response = await request(app).get('/api/posts?page=1&limit=5');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.hasMore).toBe(true);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app).get('/api/posts?page=-1&limit=10');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid limit parameter', async () => {
      const response = await request(app).get('/api/posts?page=1&limit=101');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for non-numeric page parameter', async () => {
      const response = await request(app).get('/api/posts?page=abc&limit=10');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return correct total count', async () => {
      for (let i = 0; i < 7; i++) {
        await createPost({ title: `Post ${i + 1}` });
      }

      const response = await request(app).get('/api/posts?page=1&limit=3');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.total).toBe(7);
    });

    it('should filter posts by authorId', async () => {
      // Create valid user posts
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          destination: 'Paris',
          title: 'Trip One',
          content: 'Content for the first valid trip.',
          imageUrl: 'https://example.com/p1-t1.jpg'
        });
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          destination: 'Paris',
          title: 'Trip Two',
          content: 'Content for the second valid trip.',
          imageUrl: 'https://example.com/p1-t2.jpg'
        });

      // Create user 2 and their post
      const user2 = { username: 'user2', email: 'user2@example.com', password: 'Password123!' };
      await request(app).post('/api/auth/register').send(user2);
      const login2 = await request(app).post('/api/auth/login').send({ email: user2.email, password: user2.password });
      const token2 = login2.body.token;

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          destination: 'Berlin',
          title: 'Trip Three',
          content: 'Content for the third valid trip.',
          imageUrl: 'https://example.com/p2-t3.jpg'
        });

      // Filter by user 1
      const response = await request(app).get(`/api/posts?authorId=${authUserId}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data.length).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.data.every((p: any) => p.authorId === authUserId)).toBe(true);
    });

    it('should respect pagination when filtering by authorId', async () => {
      // Create 5 posts for valid user
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            destination: 'Paris',
            title: `Trip ${i}`,
            content: `Content for valid trip number ${i}.`,
            imageUrl: `https://example.com/p1-${i}.jpg`
          });
      }

      // Filter by valid user with page 1, limit 2
      const response = await request(app).get(`/api/posts?authorId=${authUserId}&page=1&limit=2`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data.length).toBe(2);
      expect(response.body.total).toBe(5);
      expect(response.body.hasMore).toBe(true);

      // Filter by valid user with page 3, limit 2
      const response2 = await request(app).get(`/api/posts?authorId=${authUserId}&page=3&limit=2`);
      expect(response2.body.data.length).toBe(1);
      expect(response2.body.hasMore).toBe(false);
    });

    it('should return empty data for authorId with no posts', async () => {
      const response = await request(app).get('/api/posts?authorId=65f1a2b3c4d5e6f7a8b9c0d1');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data.length).toBe(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post when imageUrl is provided', async () => {
      const createdPost = await createPost();

      const response = await request(app)
        .put(`/api/posts/${createdPost.body._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          destination: 'Kyoto',
          title: 'Updated Japan Journey',
          content: 'Kyoto was peaceful and filled with amazing temples.',
          imageUrl: 'https://example.com/kyoto.jpg'
        });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('title', 'Updated Japan Journey');
      expect(response.body).toHaveProperty('imageUrl', 'https://example.com/kyoto.jpg');
    });

    it('should return 400 when imageUrl is empty during update', async () => {
      const createdPost = await createPost();

      const response = await request(app)
        .put(`/api/posts/${createdPost.body._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          destination: 'Kyoto',
          title: 'Updated Japan Journey',
          content: 'Kyoto was peaceful and filled with amazing temples.',
          imageUrl: ''
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Must be a valid URL');
    });
  });
});
