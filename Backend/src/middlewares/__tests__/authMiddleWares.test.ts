import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import { protect, restrictTo } from '../AuthMiddlewares'; // Adjust the path if necessary
import jwt from 'jsonwebtoken';
import { getXataClient } from '../../xata';
import { NextFunction } from 'express';


const client = getXataClient();



jest.mock('jsonwebtoken'); // Mock jsonwebtoken for token verification
jest.mock('../../xata'); // Mock Xata client for database interactions

// Mock user data
const mockUser = {
  useremail: 'testuser@example.com',
  role: 'user',
  xata_id: 'some_user_id'
};

describe('Authentication Middleware', () => {
  describe('protect middleware', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/protected-route');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token, authorization denied');
    });

    it('should return 401 if token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Headers authorization failed');
    });

    it('should attach user to request if token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.xata_id });
      (client.db.Users.read as jest.Mock).mockResolvedValue(mockUser);

      app.get('/protected-route', protect, (req: any, res: any) => {
        res.json({ user: req.user });
      });

      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: 'nonexistent_user_id' });
      (client.db.Users.read as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('CurrentUser not found');
    });
  });

  describe('restrictTo middleware', () => {
    it('should allow access if user has the required role', async () => {
      app.get('/admin-route', protect, restrictTo('admin'), (req, res) => {
        res.json({ message: 'Admin route accessed' });
      });

      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.xata_id });
      (client.db.Users.read as jest.Mock).mockResolvedValue({ ...mockUser, role: 'admin' });

      const response = await request(app)
        .get('/admin-route')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin route accessed');
    });

    it('should deny access if user does not have the required role', async () => {
      app.get('/admin-route', protect, restrictTo('admin'), (req, res) => {
        res.json({ message: 'Admin route accessed' });
      });

      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.xata_id });
      (client.db.Users.read as jest.Mock).mockResolvedValue(mockUser); // User has role 'user'

      const response = await request(app)
        .get('/admin-route')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to access this route');
    });

    it('should deny access if no user is attached to the request', async () => {
      app.get('/admin-route', restrictTo('admin'), (req, res) => { // No protect middleware
        res.json({ message: 'Admin route accessed' });
      });

      const response = await request(app)
        .get('/admin-route')
        .set('Authorization', 'Bearer valid_token');

      expect(response.status).toBe(403); // Or another appropriate error code
      expect(response.body.message).toBe('You do not have permission to access this route');
    });
  });
});