import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';

const app = getTestApp();

describe('Post API Endpoints', () => {
  let authToken = '';
  let authUserId = '';
  
  const validUser = {
    username: 'posttester',
    email: 'posttester@example.com',
    password: 'Password123!',
  };

  const authenticateUser = async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: validUser.email,
      password: validUser.password
    });
    authToken = loginRes.body.token;
    authUserId = loginRes.body.user._id;
  };

  const createPost = async () => {
    return request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        destination: 'Japan',
        title: 'My Journey to Japan',
        content: 'It was an amazing experience exploring Tokyo.',
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
    });

    it('should return 401 when missing auth token', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ title: 'Test', content: 'Test' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /api/posts', () => {
    it('should retrieve all posts when authenticated', async () => {
      const createdPost = await createPost();

      expect(createdPost.status).toBe(StatusCodes.CREATED);

      const response = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('_id', createdPost.body._id);
    });
  });
});
