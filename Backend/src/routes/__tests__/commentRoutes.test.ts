import request from 'supertest';
import app from '../../server'; 
import commentRoutes from '../CommentRoutes'; 
import * as CommentsController from '../../controllers/CommentsController'; 
import { jest } from '@jest/globals';
import {Request, Response} from 'express'

jest.mock('../../controllers/CommentsController', () => ({
  getAllComments: jest.fn(),
  createComment: jest.fn(),
  getCommentById: jest.fn(),
  updateCommentById: jest.fn(),
  deleteCommentById: jest.fn(),
}));

const mockComments = [
  { 
    "content": "The admin endpoints are working kudos!!",
    "task_id": { "xata_id": "rec_csavo6g3dt2rbmeduma0" },
    "user_id": { "xata_id": "rec_cs9o8iurlsprh6rg4nn0" },
    "xata_createdat": "2024-10-21T08:46:04.233Z",
    "xata_id": "rec_csb19j6rlsprh6rhesqg", 
    "xata_updatedat": "2024-10-21T08:46:04.233Z", 
    "xata_version": 0 
  }
];

describe('Comment Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/comments', commentRoutes);
  });

  describe('GET /api/v1/comments', () => {
    it('should return a list of comments', async () => {
      (CommentsController.getAllComments as jest.Mock).mockImplementation((req: any, res:any) => {
        res.status(200).json({ message: "Comment fetched successfully", data: mockComments });
      });

      const response = await request(app).get('/api/v1/comments');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockComments); 
    });
  });

  describe('POST /api/v1/comments', () => {
    it('should create a new comment', async () => {
      const newComment = { content: 'New comment' };
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
});