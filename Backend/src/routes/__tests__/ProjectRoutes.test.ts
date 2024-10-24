import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import projectRoutes from '../ProjectRoutes'; // Adjust the path if necessary
import * as ProjectControllers from '../../controllers/ProjectControllers'; 
import { jest } from '@jest/globals';

jest.mock('../../controllers/ProjectControllers', () => ({
  createProject: jest.fn(),
  getAllProjects: jest.fn(),
  getProjectById: jest.fn(),
  updateProjectById: jest.fn(),
  deleteProjectById: jest.fn(),
}));

const mockProjects = [
  { 
    "projectname": "Task Managemant API",
    "team_id": { "xata_id": "rec_cs9r675jen66ahq8unug" },
    "xata_createdat": "2024-10-21T05:15:39.146Z",
    "xata_id": "rec_csau6uo3dt2rbmedl9k0", 
    "xata_updatedat": "2024-10-21T05:15:39.146Z", 
    "xata_version": 0 
  }
];

describe('Project Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/projects', projectRoutes); // Make sure this matches your actual API endpoint
  });

  describe('GET /api/v1/projects', () => {
    it('should return a list of projects', async () => {
      (ProjectControllers.getAllProjects as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Projects fetched successfully", data: mockProjects });
      });

      const response = await request(app).get('/api/v1/projects');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockProjects); 
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const newProject = { projectname: 'New Project', team_id: { xata_id: 'some_team_id' } };
      (ProjectControllers.createProject as jest.Mock).mockImplementation((req: any, res: any) => {
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
      (ProjectControllers.getProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
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
      (ProjectControllers.updateProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
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
      (ProjectControllers.deleteProjectById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Project deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/projects/${projectId}`);
      expect(response.status).toBe(200); 
    });
  });
});