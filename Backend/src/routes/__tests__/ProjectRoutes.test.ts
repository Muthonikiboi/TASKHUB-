import request from 'supertest';
import app from '../../server';
import projectRoutes from '../ProjectRoutes';
import * as ProjectController from '../../controllers/ProjectControllers';
import { jest } from '@jest/globals';
import { NextFunction } from 'express';

jest.mock('../../controllers/ProjectControllers', () => ({
  createProject: jest.fn(),
  getProjectByTeamId: jest.fn(),
  getAllProjects: jest.fn(),
  updateProjectById: jest.fn(),
  getProjectById: jest.fn(),
  deleteProjectById: jest.fn(),
}));

// Mock project data
const mockProjects = [
  {
    "projectname": "Test Project",
    "team_id": { "xata_id": "team123" },
    "xata_createdat": "2024-10-26T12:00:00.000Z",
    "xata_id": "project456",
    "xata_updatedat": "2024-10-26T12:00:00.000Z",
    "xata_version": 0
  }
];

describe('Project Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/projects', projectRoutes);
  });

  describe('GET /api/v1/projects', () => {
    it('should return a list of projects', async () => {
      (ProjectController.getAllProjects as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Projects fetched successfully", data: mockProjects });
      });

      const response = await request(app).get('/api/v1/projects');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockProjects);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        projectname: 'New Project',
        team_id: { "xata_id": "team123" }
      };
      (ProjectController.createProject as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Project created successfully", data: { ...newProject, xata_id: 'some_xata_id' } });
      });

      const response = await request(app)
        .post('/api/v1/projects')
        .send(newProject);

      expect(response.status).toBe(200);
      expect(response.body.data.projectname).toBe('New Project');
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a project by ID', async () => {
      const projectId = mockProjects[0].xata_id;
      (ProjectController.getProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Project fetched successfully", data: mockProjects[0] });
      });

      const response = await request(app).get(`/api/v1/projects/${projectId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockProjects[0]);
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should update a project by ID', async () => {
      const projectId = mockProjects[0].xata_id;
      const updatedProject = { projectname: 'Updated Project Name' };
      (ProjectController.updateProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Project updated successfully", data: { ...mockProjects[0], projectname: updatedProject.projectname } });
      });

      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send(updatedProject);

      expect(response.status).toBe(200);
      expect(response.body.data.projectname).toBe('Updated Project Name');
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project by ID', async () => {
      const projectId = mockProjects[0].xata_id;
      (ProjectController.deleteProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Project deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/projects/${projectId}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/projects/team/:team_id', () => {
    it('should return projects for a given team ID', async () => {
      const teamId = 'team123';
      (ProjectController.getProjectByTeamId as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Projects fetched successfully", data: mockProjects });
      });

      const response = await request(app).get(`/api/v1/projects/team/${teamId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Projects fetched successfully');
      expect(response.body.data).toEqual(mockProjects);
    });

    it('should handle Team Not Found error', async () => {
      const teamId = 'nonexistent_team_id';
      (ProjectController.getProjectByTeamId as jest.Mock).mockImplementation((req, res, next: any) => {
        next(new Error('Team not found'));
      });

      const response = await request(app).get(`/api/v1/projects/team/${teamId}`);
      expect(response.status).toBe(500); // Or your custom error status code
      // Add assertions to check for the error message in the response body
    });

    // Add more tests for other error scenarios, empty projects, etc.
  });
});