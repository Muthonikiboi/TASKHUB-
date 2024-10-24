import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import taskRoutes from '../TaskRoutes'; // Adjust the path if necessary
import * as TaskController from '../../controllers/TaskController'; 
import { jest } from '@jest/globals';

jest.mock('../../controllers/TaskController', () => ({
  createTask: jest.fn(),
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  updateTaskById: jest.fn(),
  deleteTaskById: jest.fn(),
}));

// Mock task data - adjust to match your actual data structure
const mockTasks = [
  { 
    "description": "Finish API documentation",
    "status": "in progress",
    "due_date": "2024-10-31",
    "xata_createdat": "2024-10-21T10:00:00.000Z",
    "xata_id": "some_task_id",
    "xata_updatedat": "2024-10-21T10:00:00.000Z",
    "xata_version": 0 
  }
];

describe('Task Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/tasks', taskRoutes); // Adjust the path if necessary
  });

  describe('GET /api/v1/tasks', () => {
    it('should return a list of tasks', async () => {
      (TaskController.getAllTasks as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Tasks fetched successfully", data: mockTasks });
      });

      const response = await request(app).get('/api/v1/tasks');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTasks); 
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { 
        description: 'Write unit tests', 
        status: 'todo', 
        due_date: '2024-11-15' 
      };
      (TaskController.createTask as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Task created successfully", data: { ...newTask, xata_id: 'some_new_task_id' } });
      });

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(newTask);

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('Write unit tests');
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const taskId = mockTasks[0].xata_id;
      (TaskController.getTaskById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Task fetched successfully", data: mockTasks[0] });
      });

      const response = await request(app).get(`/api/v1/tasks/${taskId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTasks[0]); 
    });
  });

  describe('PATCH /api/v1/tasks/:id', () => {
    it('should update a task by ID', async () => {
      const taskId = mockTasks[0].xata_id;
      const updatedTask = { status: 'completed' };
      (TaskController.updateTaskById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Task updated successfully", data: { ...mockTasks[0], ...updatedTask } });
      });

      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task by ID', async () => {
      const taskId = mockTasks[0].xata_id;
      (TaskController.deleteTaskById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Task deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/tasks/${taskId}`);
      expect(response.status).toBe(200); 
    });
  });
});