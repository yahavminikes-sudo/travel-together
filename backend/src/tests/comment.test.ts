import request from 'supertest';
import { getTestApp } from './utils/testApp';
import { StatusCodes } from 'http-status-codes';

const app = getTestApp();

describe('Comment API Endpoints', () => {
  let authToken = '';
  let authUserId = '';
  let targetPostId = '';
  let secondaryAuthToken = '';

  const validUser = {
    username: 'commenttester',
    email: 'commenttester@example.com',
    password: 'Password123!'
  };

  const secondaryUser = {
    username: 'secondcommenter',
    email: 'secondcommenter@example.com',
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

  const authenticateSecondaryUser = async () => {
    await request(app).post('/api/auth/register').send(secondaryUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: secondaryUser.email,
      password: secondaryUser.password
    });
    secondaryAuthToken = loginRes.body.token;
  };

  const createTargetPost = async () => {
    const postRes = await request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
      destination: 'Test City',
      title: 'Post to Comment on',
      content: 'This post exists solely to test comments.'
    });
    targetPostId = postRes.body._id;
    return postRes;
  };

  const createComment = async (content = 'This is a test comment.') => {
    return request(app)
      .post(`/api/comments/post/${targetPostId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content });
  };

  beforeEach(async () => {
    await authenticateUser();
    await authenticateSecondaryUser();
    await createTargetPost();
  });

  describe('POST /api/comments/post/:postId', () => {
    it('should create a comment on a post', async () => {
      const response = await createComment();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('content', 'This is a test comment.');
      expect(response.body).toHaveProperty('authorId', authUserId);
      expect(response.body).toHaveProperty('postId', targetPostId);
    });

    it('should return 401 when missing auth token', async () => {
      const response = await request(app)
        .post(`/api/comments/post/${targetPostId}`)
        .send({ content: 'Unauthenticated comment' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /api/comments/post/:postId', () => {
    it('should retrieve comments for a given post', async () => {
      const createdComment = await createComment();

      expect(createdComment.status).toBe(StatusCodes.CREATED);

      const response = await request(app)
        .get(`/api/comments/post/${targetPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('_id', createdComment.body._id);
      expect(response.body[0]).toHaveProperty('postId', targetPostId);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment when requested by its owner', async () => {
      const createdComment = await createComment();

      expect(createdComment.status).toBe(StatusCodes.CREATED);

      const deleteResponse = await request(app)
        .delete(`/api/comments/${createdComment.body._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);

      const commentsResponse = await request(app)
        .get(`/api/comments/post/${targetPostId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(commentsResponse.status).toBe(StatusCodes.OK);
      expect(commentsResponse.body).toEqual([]);
    });

    it('should return 401 when missing auth token', async () => {
      const createdComment = await createComment();

      const response = await request(app).delete(`/api/comments/${createdComment.body._id}`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should return 403 when another user tries to delete the comment', async () => {
      const createdComment = await createComment();

      const response = await request(app)
        .delete(`/api/comments/${createdComment.body._id}`)
        .set('Authorization', `Bearer ${secondaryAuthToken}`);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('message', 'You can only delete your own comments');
    });

    it('should return 404 when the comment does not exist', async () => {
      const response = await request(app)
        .delete('/api/comments/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'Comment not found');
    });
  });
});
