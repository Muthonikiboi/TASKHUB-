import request from 'supertest';
import app from '../../server';
import authRoutes from '../AuthRoutes';
import * as AuthController from '../../controllers/AuthControllers';
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import AppError from '../../utils/AppError';

jest.mock('../../controllers/AuthControllers', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  getAllUsers: jest.fn(),
  deleteUserById: jest.fn(),
}));

jest.mock('bcrypt');

// Mock user data
const mockUser = {
  username: 'testuser',
  useremail: 'testuser@example.com',
  userpassword: 'hashed_password',
  role: 'user', // Add a role property
  xata_id: 'some_user_id'
};

const mockUsers = [
  mockUser,
  {
    username: 'testuser2',
    useremail: 'testuser2@example.com',
    userpassword: 'testpassword2',
    role: 'admin', // Add a role property
    xata_id: 'some_user_id2'
  }
];

describe('Auth Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/users', authRoutes);
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (AuthController.registerUser as jest.Mock).mockImplementation((req, res: any) => {
        res.status(201).json({
          status: 'success',
          token: 'mock_jwt_token',
          data: mockUser
        });
      });

      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          username: mockUser.username,
          useremail: mockUser.useremail,
          userpassword: 'testpassword',
          passwordConfirm: 'testpassword' // Include passwordConfirm
        });

      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 15);
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBe('mock_jwt_token');
      expect(response.body.data).toEqual(mockUser);
    });

    it('should return 400 if passwords do not match', async () => {
      (AuthController.registerUser as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new AppError('Passwords do not match', 400));
      });

      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          username: mockUser.username,
          useremail: mockUser.useremail,
          userpassword: 'testpassword',
          passwordConfirm: 'different_password'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Passwords do not match');
    });

    // Add more tests for invalid data, error handling, etc.
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in a user with valid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (AuthController.loginUser as jest.Mock).mockImplementation((req, res: any) => {
        res.status(200).json({
          status: 'Logged in Successfully',
          token: 'mock_jwt_token',
          data: {
            username: mockUser.username,
            role: mockUser.role, // Include role in response
            xata_id: mockUser.xata_id
          }
        });
      });

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          useremail: mockUser.useremail,
          userpassword: 'testpassword'
        });

      expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', mockUser.userpassword);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Logged in Successfully');
      expect(response.body.token).toBe('mock_jwt_token');
      // Check if the role is included in the response
      expect(response.body.data.role).toBe(mockUser.role);
    });

    it('should return 401 if user is not found', async () => {
      (AuthController.loginUser as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new AppError('User not found', 401));
      });

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          useremail: 'nonexistentuser@example.com',
          userpassword: 'testpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 401 for invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      (AuthController.loginUser as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new AppError('Invalid credentials', 401));
      });

      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          useremail: mockUser.useremail,
          userpassword: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    // Add more tests for other error handling, etc.
  });

  describe('GET /api/v1/users', () => {
    it('should return a list of users for admin (protected route)', async () => {
      (AuthController.getAllUsers as jest.Mock).mockImplementation((req, res: any) => {
        res.status(200).json({
          results: mockUsers.length,
          message: "Users fetched successfully",
          data: mockUsers
        });
      });

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users fetched successfully');
      expect(response.body.data).toEqual(mockUsers);
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await request(app).get('/api/v1/users'); // No token provided

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token, authorization denied');
    });

    // Add more tests for unauthorized access with invalid token, etc.
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user by ID for admin (protected route)', async () => {
      const userId = mockUser.xata_id;
      (AuthController.deleteUserById as jest.Mock).mockImplementation((req, res: any) => {
        res.status(200).json({ message: 'User deleted successfully' });
      });

      const response = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return 401 for unauthorized access', async () => {
      const userId = mockUser.xata_id;
      const response = await request(app).delete(`/api/v1/users/${userId}`); // No token provided

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token, authorization denied');
    });

    // Add tests for unauthorized access with invalid token, invalid user ID, etc.
  });
});