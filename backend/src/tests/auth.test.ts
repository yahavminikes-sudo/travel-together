import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';

const app = getTestApp();

describe('Auth API Endpoints', () => {
  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);
      
      if (response.status !== StatusCodes.CREATED) {
        console.error('Registration failed:', response.body);
      }
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', validUser.username);
      expect(response.body.user).toHaveProperty('email', validUser.email);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 409 if email is already registered', async () => {
      // Register first time
      await request(app).post('/api/auth/register').send(validUser);
      
      // Register second time
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);
        
      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body).toHaveProperty('message', 'Email already registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' }); // missing password and username
        
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Ensure user exists before each login test
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });
        
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'WrongPassword' });
        
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'Password123!' });
        
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
