import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';
import { setMockGoogleCredential } from './utils/testApp';

const app = getTestApp();

describe('Auth API Endpoints', () => {
  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send(validUser);

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
      const response = await request(app).post('/api/auth/register').send(validUser);

      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body).toHaveProperty('message', 'Email already registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/auth/register').send({ email: 'test@example.com' }); // missing password and username

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

  describe('POST /api/auth/google', () => {
    const googleCredential = 'valid-google-credential';
    const googlePayload = {
      email: 'google.user@example.com',
      emailVerified: true,
      googleId: 'google-sub-123',
      name: 'Google User',
      picture: 'https://example.com/google-user.png'
    };

    it('should return 200 with app auth tokens for a valid Google credential', async () => {
      setMockGoogleCredential(googleCredential, googlePayload);

      const response = await request(app).post('/api/auth/google').send({ credential: googleCredential });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', googlePayload.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should link an existing local user with the same email', async () => {
      const localUser = {
        username: 'linkeduser',
        email: 'linked@example.com',
        password: 'Password123!'
      };

      await request(app).post('/api/auth/register').send(localUser);
      setMockGoogleCredential(googleCredential, {
        ...googlePayload,
        email: localUser.email,
        googleId: 'google-sub-linked'
      });

      const googleResponse = await request(app).post('/api/auth/google').send({ credential: googleCredential });
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: localUser.email,
        password: localUser.password
      });

      expect(googleResponse.status).toBe(StatusCodes.OK);
      expect(googleResponse.body.user).toHaveProperty('email', localUser.email);
      expect(loginResponse.status).toBe(StatusCodes.OK);
    });

    it('should create a new user without a password for a new Google email', async () => {
      setMockGoogleCredential(googleCredential, googlePayload);

      const googleResponse = await request(app).post('/api/auth/google').send({ credential: googleCredential });
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: googlePayload.email,
        password: 'Password123!'
      });

      expect(googleResponse.status).toBe(StatusCodes.OK);
      expect(googleResponse.body.user).toHaveProperty('username', 'google-user');
      expect(loginResponse.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should return 401 for an invalid Google credential', async () => {
      const response = await request(app).post('/api/auth/google').send({ credential: 'invalid-google-credential' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('message', 'Invalid Google credential');
    });

    it('should return 409 for an email collision with a different stored googleId', async () => {
      const email = 'collision@example.com';

      setMockGoogleCredential('first-credential', {
        ...googlePayload,
        email,
        googleId: 'google-sub-first'
      });
      setMockGoogleCredential('second-credential', {
        ...googlePayload,
        email,
        googleId: 'google-sub-second'
      });

      await request(app).post('/api/auth/google').send({ credential: 'first-credential' });
      const conflictResponse = await request(app).post('/api/auth/google').send({ credential: 'second-credential' });

      expect(conflictResponse.status).toBe(StatusCodes.CONFLICT);
      expect(conflictResponse.body).toHaveProperty(
        'message',
        'A different Google account is already linked to this email'
      );
    });
  });
});
