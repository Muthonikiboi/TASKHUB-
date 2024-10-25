import request from 'supertest';
import app from '../../server';
import commentRoutes from '../CommentRoutes';
import * as CommentsController from '../../controllers/CommentsController';
import { jest } from '@jest/globals';
import { NextFunction } from 'express'; // Import NextFunction

jest.mock('../../controllers/CommentsController', () => ({
  createComment: jest.fn(),
  getCommentsByTaskId: jest.fn(),
  getCommentsByUserId: jest.fn(),
  getAllComments: jest.fn(),
  updateCommentById: jest.fn(),
  getCommentById: jest.fn(),
  deleteCommentById: jest.fn(),
}));

// Mock comment data
const mockComments = [
  {
    "content": "This is a test comment",
    "task_id": { "xata_id": "task123" },
    "user_id": { "xata_id": "user456" },
    "xata_createdat": "2024-10-26T10:00:00.000Z",
    "xata_id": "comment789",
    "xata_updatedat": "2024-10-26T10:00:00.000Z",
    "xata_version": 0
  }
];

describe('Comment Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/comments', commentRoutes);
  });

  describe('GET /api/v1/comments', () => {
    it('should return a list of comments', async () => {
      (CommentsController.getAllComments as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comment fetched successfully", data: mockComments });
      });

      const response = await request(app).get('/api/v1/comments');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockComments);
    });
  });

  describe('POST /api/v1/comments', () => {
    it('should create a new comment', async () => {
      const newComment = {
        content: 'New comment',
        task_id: { "xata_id": "task123" },
        user_id: { "xata_id": "user456" }
      };
      (CommentsController.createComment as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comment made successfully", data: { ...newComment, xata_id: 'some_xata_id' } });
      });

      const response = await request(app)
        .post('/api/v1/comments')
        .send(newComment);

      expect(response.status).toBe(200);
      expect(response.body.data.content).toBe('New comment');
    });
  });

  describe('GET /api/v1/comments/:id', () => {
    it('should return a comment by ID', async () => {
      const commentId = mockComments[0].xata_id;
      (CommentsController.getCommentById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comment fetched successfully", data: mockComments[0] });
      });

      const response = await request(app).get(`/api/v1/comments/${commentId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockComments[0]);
    });
  });

  describe('PATCH /api/v1/comments/:id', () => {
    it('should update a comment by ID', async () => {
      const commentId = mockComments[0].xata_id;
      const updatedComment = { content: 'Updated comment' };
      (CommentsController.updateCommentById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comment updated successfully", data: { ...mockComments[0], content: updatedComment.content } });
      });

      const response = await request(app)
        .patch(`/api/v1/comments/${commentId}`)
        .send(updatedComment);

      expect(response.status).toBe(200);
      expect(response.body.data.content).toBe('Updated comment');
    });
  });

  describe('DELETE /api/v1/comments/:id', () => {
    it('should delete a comment by ID', async () => {
      const commentId = mockComments[0].xata_id;
      (CommentsController.deleteCommentById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comment deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/comments/${commentId}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/comments/task/:task_id', () => {
    it('should return comments for a given task ID', async () => {
      const taskId = 'task123';
      (CommentsController.getCommentsByTaskId as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comments fetched successfully", data: mockComments });
      });

      const response = await request(app).get(`/api/v1/comments/task/${taskId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Comments fetched successfully');
      expect(response.body.data).toEqual(mockComments);
    });

    it('should handle Task Not Found error', async () => {
      const taskId = 'nonexistent_task_id';
      (CommentsController.getCommentsByTaskId as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new Error('Task not found')); // Explicitly type next as NextFunction
      });

      const response = await request(app).get(`/api/v1/comments/task/${taskId}`);
      expect(response.status).toBe(500); // Or your custom error status code
      // Add assertions to check for the error message in the response body
    });

    // Add more tests for other error scenarios, empty comments, etc.
  });

  // Add tests for GET /api/v1/comments/user/:user_id
  describe('GET /api/v1/comments/user/:user_id', () => {
    it('should return comments for a given user ID', async () => {
      const userId = 'user456';
      (CommentsController.getCommentsByUserId as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Comments fetched successfully", data: mockComments });
      });

      const response = await request(app).get(`/api/v1/comments/user/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Comments fetched successfully');
      expect(response.body.data).toEqual(mockComments);
    });

    it('should handle User Not Found error', async () => {
      const userId = 'nonexistent_user_id';
      (CommentsController.getCommentsByUserId as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new Error('User not found'));
      });

      const response = await request(app).get(`/api/v1/comments/user/${userId}`);
      expect(response.status).toBe(500); // Or your custom error status code
      // Add assertions to check for the error message in the response body
    });

    // Add more tests for other error scenarios, empty comments, etc.
  });
});