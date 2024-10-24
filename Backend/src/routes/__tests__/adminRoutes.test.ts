import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import adminRoutes from '../adminRoutes'; // Adjust the path if necessary
import * as AdminController from '../../controllers/adminController';
import { jest } from '@jest/globals';

jest.mock('../../controllers/adminController', () => ({
  getAllUsers: jest.fn(),
  getAllTasks: jest.fn(),
  createTeam: jest.fn(),
  searchUsers: jest.fn(),
  getAllComments: jest.fn(),
  deleteUser: jest.fn()
}));

// Mock data
const mockUsers = [
  { useremail: 'user1@example.com', username: 'user1' },
  { useremail: 'user2@example.com', username: 'user2' }
];
const mockTasks = [
  { description: 'Task 1', status: 'in progress' },
  { description: 'Task 2', status: 'completed' }
];
const mockTeams = [
  { teamname: 'Team A', description: 'Team A description' },
  { teamname: 'Team B', description: 'Team B description' }
];
const mockComments = [
  { content: 'Comment 1', user_id: { xata_id: 'user1_id' } },
  { content: 'Comment 2', user_id: { xata_id: 'user2_id' } }
];

describe('Admin Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/admin', adminRoutes);
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return a list of all users', async () => {
      (AdminController.getAllUsers as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: 'Users fetched successfully', data: mockUsers });
      });

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', 'Bearer mock_jwt_token'); // Add a mock auth token

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users fetched successfully');
      expect(response.body.data).toEqual(mockUsers);
    });

    // Add tests for unauthorized access, error handling, etc.
  });

  describe('GET /api/v1/admin/tasks', () => {
    it('should return a list of all tasks', async () => {
      (AdminController.getAllTasks as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: 'Tasks fetched successfully', data: mockTasks });
      });

      const response = await request(app)
        .get('/api/v1/admin/tasks')
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks fetched successfully');
      expect(response.body.data).toEqual(mockTasks);
    });

    // Add tests for unauthorized access, error handling, etc.
  });

  describe('POST /api/v1/admin/teams', () => {
    it('should create a new team', async () => {
      const newTeam = {
        teamname: 'New Team',
        description: 'New team description'
      };
      (AdminController.createTeam as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(201).json({ message: 'Team created successfully', data: { ...newTeam, xata_id: 'some_team_id' } });
      });

      const response = await request(app)
        .post('/api/v1/admin/teams')
        .set('Authorization', 'Bearer mock_jwt_token')
        .send(newTeam);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Team created successfully');
      // Add assertions to check the response data
    });

    // Add tests for unauthorized access, invalid data, error handling, etc.
  });

  describe('GET /api/v1/admin/users/search', () => {
    it('should search for users by email or username', async () => {
      const searchTerm = 'user1';
      (AdminController.searchUsers as jest.Mock).mockImplementation((req: any, res: any) => {
        const filteredUsers = mockUsers.filter(user => user.useremail.includes(searchTerm) || user.username.includes(searchTerm));
        res.status(200).json({ message: 'Users found', data: filteredUsers });
      });

      const response = await request(app)
        .get(`/api/v1/admin/users/search?q=${searchTerm}`)
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users found');
      // Add assertions to check the response data
    });

    // Add tests for different search terms, no results, error handling, etc.
  });

  describe('GET /api/v1/admin/comments', () => {
    it('should return a list of all comments', async () => {
      (AdminController.getAllComments as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: 'Comments fetched successfully', data: mockComments });
      });

      const response = await request(app)
        .get('/api/v1/admin/comments')
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Comments fetched successfully');
      expect(response.body.data).toEqual(mockComments);
    });

    // Add tests for unauthorized access, error handling, etc.
  });

  describe('DELETE /api/v1/admin/users/:userId', () => {
    it('should delete a user by ID', async () => {
      const userId = 'some_user_id';
      (AdminController.deleteUser as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: 'User deleted successfully' });
      });

      const response = await request(app)
        .delete(`/api/v1/admin/users/${userId}`)
        .set('Authorization', 'Bearer mock_jwt_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    // Add tests for unauthorized access, invalid user ID, error handling, etc.
  });
});