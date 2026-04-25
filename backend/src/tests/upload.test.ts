import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { getTestApp } from './utils/testApp';

const app = getTestApp();
const payloadTooLargeStatusCode = 413;

describe('Upload API Endpoints', () => {
  let authToken = '';

  const validUser = {
    username: 'uploadtester',
    email: 'uploadtester@example.com',
    password: 'Password123!'
  };

  const authenticateUser = async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: validUser.email,
      password: validUser.password
    });
    authToken = loginRes.body.token;
  };

  beforeEach(async () => {
    await authenticateUser();
  });

  describe('POST /api/uploads/image', () => {
    it('should upload an image when authenticated', async () => {
      const response = await request(app)
        .post('/api/uploads/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', Buffer.from('fake-png-bytes'), {
          contentType: 'image/png',
          filename: 'cover.png'
        });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toContain('/uploads/');
    });

    it('should return 401 when missing auth token', async () => {
      const response = await request(app).post('/api/uploads/image').attach('image', Buffer.from('image'), {
        contentType: 'image/png',
        filename: 'cover.png'
      });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should return 400 when file is missing', async () => {
      const response = await request(app).post('/api/uploads/image').set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Image file is required.');
    });

    it('should return 400 for unsupported file types', async () => {
      const response = await request(app)
        .post('/api/uploads/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', Buffer.from('plain text'), {
          contentType: 'text/plain',
          filename: 'notes.txt'
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('message', 'Unsupported image type. Use PNG, JPG, WEBP, or GIF.');
    });

    it('should return 413 for files larger than 5 MB', async () => {
      const response = await request(app)
        .post('/api/uploads/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', Buffer.alloc(5 * 1024 * 1024 + 1, 1), {
          contentType: 'image/png',
          filename: 'large.png'
        });

      expect(response.status).toBe(payloadTooLargeStatusCode);
      expect(response.body).toHaveProperty('message', 'Image is too large. Please upload a file smaller than 5 MB.');
    });
  });
});
