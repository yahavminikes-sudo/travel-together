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
    password: 'Password123!'
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
    return request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
      destination: 'Japan',
      title: 'My Journey to Japan',
      content: 'It was an amazing experience exploring Tokyo.',
      imageUrl: 'https://example.com/japan.jpg'
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

  describe('GET /api/posts', () => {
    it('should retrieve all posts when authenticated', async () => {
      const createdPost = await createPost();

      expect(createdPost.status).toBe(StatusCodes.CREATED);

      const response = await request(app).get('/api/posts').set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('_id', createdPost.body._id);
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
