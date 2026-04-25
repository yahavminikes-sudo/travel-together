import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';

const app = getTestApp();

describe('Search API Endpoints', () => {
  let authToken = '';
  let authUserId = '';


  const authenticateUser = async () => {
    const uniqueId = Math.random().toString(36).substring(7);
    const user = {
      username: `user_${uniqueId}`,
      email: `user_${uniqueId}@example.com`,
      password: 'Password123!'
    };
    
    const regRes = await request(app).post('/api/auth/register').send(user);
    if (regRes.status !== StatusCodes.CREATED && regRes.status !== StatusCodes.CONFLICT) {
      throw new Error(`Registration failed with status ${regRes.status}: ${JSON.stringify(regRes.body)}`);
    }

    const loginRes = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: user.password
    });
    
    if (loginRes.status !== StatusCodes.OK) {
      throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginRes.body)}`);
    }
    
    authToken = loginRes.body.token;
    authUserId = loginRes.body.user?._id;
  };

  const createPost = async (overrides = {}) => {
    return request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
      destination: 'Paris',
      title: 'Eiffel Tower Adventure',
      content: 'Visited the beautiful Eiffel Tower in Paris.',
      tags: ['france', 'paris', 'europe'],
      ...overrides
    });
  };

  beforeEach(async () => {
    await authenticateUser();
  });

  describe('GET /api/search', () => {
    it('should return 400 when query parameter is missing', async () => {
      const response = await request(app).get('/api/search');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when query parameter is empty', async () => {
      const response = await request(app).get('/api/search?q=');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return paginated search response structure', async () => {
      await authenticateUser();
      await createPost({ destination: 'Paris', title: 'Paris Trip', content: 'Paris is nice' });
      
      const response = await request(app).get('/api/search?q=paris');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should respect custom page parameter', async () => {
      await authenticateUser();
      for (let i = 0; i < 10; i++) {
        await createPost({ destination: 'Paris', title: `Paris Post ${i}` });
      }

      const response = await request(app).get('/api/search?q=paris&page=2&limit=3');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(3);
      expect(response.body.data.length).toBe(3);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app).get('/api/search?q=paris&page=-1');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for limit exceeding max', async () => {
      const response = await request(app).get('/api/search?q=paris&limit=51');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for non-numeric page parameter', async () => {
      const response = await request(app).get('/api/search?q=paris&page=abc');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for non-numeric limit parameter', async () => {
      const response = await request(app).get('/api/search?q=paris&limit=xyz');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });

    it('should set hasMore: false when no more results', async () => {
      const response = await request(app).get('/api/search?q=xyz123nonexistentquery&page=1&limit=10');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.hasMore).toBe(false);
    });

    it('should return results when query matches content', async () => {
      await authenticateUser();
      await createPost({ destination: 'Paris', title: 'Eiffel Tower', content: 'Beautiful landmark' });

      const response = await request(app).get('/api/search?q=paris');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].destination).toBe('Paris');
    });
  });
});
