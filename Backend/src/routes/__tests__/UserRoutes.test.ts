import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import userRoutes from '../UserRoutes'; // Adjust the path if necessary
import * as UserController from '../../controllers/UserController'; 
import { jest } from '@jest/globals';

jest.mock('../../controllers/UserController', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUserById: jest.fn(),
  deleteUserById: jest.fn(),
}));

const mockUsers = [
  { 
    "role": "",
    "useremail": "john.doe@example.com",
    "username": "johnDoe",
    "userpassword": "$2b$10$krE6rTE47U.NzO7a3Fzh/OvNr3IXoImAjwagnbXJHJi9FeRNPVLPK",
    "xata_createdat": "2024-10-20T10:03:09.028Z",
    "xata_id": "rec_csadanerlsprh6rg4uu0", 
    "xata_updatedat": "2024-10-20T12:03:23.312Z", 
    "xata_version": 1 
  }
];

describe('User Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/users', userRoutes); // Adjust the path if necessary
  });

  describe('GET /api/v1/users', () => {
    it('should return a list of users', async () => {
      (UserController.getAllUsers as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Users fetched successfully", data: mockUsers });
      });

      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUsers); 
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const newUser = { 
        username: 'testuser', 
        useremail: 'testuser@example.com', 
        userpassword: 'testpassword', 
        role: 'user' 
      };
      (UserController.createUser as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "User created successfully", data: { ...newUser, xata_id: 'some_new_user_id' } });
      });

      const response = await request(app)
        .post('/api/v1/users')
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('testuser');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return a user by ID', async () => {
      const userId = mockUsers[0].xata_id;
      (UserController.getUserById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "User fetched successfully", data: mockUsers[0] });
      });

      const response = await request(app).get(`/api/v1/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUsers[0]); 
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update a user by ID', async () => {
      const userId = mockUsers[0].xata_id;
      const updatedUser = { username: 'updatedusername' };
      (UserController.updateUserById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "User updated successfully", data: { ...mockUsers[0], ...updatedUser } });
      });

      const response = await request(app)
        .patch(`/api/v1/users/${userId}`)
        .send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('updatedusername');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete a user by ID', async () => {
      const userId = mockUsers[0].xata_id;
      (UserController.deleteUserById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "User deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/users/${userId}`);
      expect(response.status).toBe(200); 
    });
  });
});