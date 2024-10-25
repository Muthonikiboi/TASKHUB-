import request from 'supertest';
import app from '../../server';
import taskRoutes from '../TaskRoutes';
import * as TaskController from '../../controllers/TaskController';
import { jest } from '@jest/globals';
import { NextFunction } from 'express';

jest.mock('../../controllers/TaskController', () => ({
  createTask: jest.fn(),
  getTaskByAssignedTo: jest.fn(),
  getAllTasks: jest.fn(),
  updateTaskById: jest.fn(),
  getTaskById: jest.fn(),
  deleteTaskById: jest.fn(),
}));

// Mock task data
const mockTasks = [
  {
    "description": "Test Task",
    "status": "in progress",
    "due_date": "2024-11-15",
    "project_id": { "xata_id": "project123" },
    "assignedTo": { "xata_id": "user456" },
    "xata_createdat": "2024-10-27T12:00:00.000Z",
    "xata_id": "task789",
    "xata_updatedat": "2024-10-27T12:00:00.000Z",
    "xata_version": 0
  }
];

describe('Task Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/tasks', taskRoutes);
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
        description: 'New Task',
        status: 'todo',
        due_date: '2024-12-01',
        project_id: { "xata_id": "project123" },
        assignedTo: { "xata_id": "user456" }
      };
      (TaskController.createTask as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Task created successfully", data: { ...newTask, xata_id: 'some_xata_id' } });
      });

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(newTask);

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('New Task');
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

  describe('GET /api/v1/tasks/assignedTo/:assignedTo', () => {
    it('should return tasks for a given assignedTo ID', async () => {
      const assignedTo = 'user456';
      (TaskController.getTaskByAssignedTo as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "User tasks fetched successfully", data: mockTasks });
      });

      const response = await request(app).get(`/api/v1/tasks/assignedTo/${assignedTo}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User tasks fetched successfully');
      expect(response.body.data).toEqual(mockTasks);
    });

    it('should handle User Not Found error', async () => {
      const assignedTo = 'nonexistent_user_id';
      (TaskController.getTaskByAssignedTo as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
        next(new Error('User not found'));
      });

      const response = await request(app).get(`/api/v1/tasks/assignedTo/${assignedTo}`);
      expect(response.status).toBe(500); 
    });

    
    it('should handle No Tasks Assigned error', async () => {
      const assignedTo = 'user_with_no_tasks';
      (TaskController.getTaskByAssignedTo as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new Error('No tasks assigned to this user'));
      });

      const response = await request(app).get(`/api/v1/tasks/assignedTo/${assignedTo}`);
      expect(response.status).toBe(500); 
    });

    it('should return an empty array if no tasks are found', async () => {
      const assignedTo = 'user_with_no_tasks';
      (TaskController.getTaskByAssignedTo as jest.Mock).mockImplementation((req, res: any) => {
        res.status(200).json({ message: "User tasks fetched successfully", data: [] });
      });

      const response = await request(app).get(`/api/v1/tasks/assignedTo/${assignedTo}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User tasks fetched successfully');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return an empty array if no tasks are found', async () => {
      (TaskController.getAllTasks as jest.Mock).mockImplementation((req, res: any) => {
        res.status(200).json({ message: "Tasks fetched successfully", data: [] });
      });

      const response = await request(app).get('/api/v1/tasks');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should handle Task Not Found error', async () => {
      const taskId = 'nonexistent_task_id';
      (TaskController.getTaskById as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new Error('Task not found'));
      });

      const response = await request(app).get(`/api/v1/tasks/${taskId}`);
      expect(response.status).toBe(500); 
    });
  });

  });
