import request from 'supertest';
import app from '../../server'; // Adjust the path if necessary
import teamRoutes from '../TeamRoutes'; // Adjust the path if necessary
import * as TeamController from '../../controllers/TeamController'; 
import { jest } from '@jest/globals';

jest.mock('../../controllers/TeamController', () => ({
  createTeam: jest.fn(),
  getAllTeams: jest.fn(),
  getTeamById: jest.fn(),
  updateTeamById: jest.fn(),
  deletTeamById: jest.fn(), // Note the typo in your route file ('deletTeamById')
  getTeamsByUserId: jest.fn()
}));

const mockTeams = [
  { 
    "description": "Xoxo live experience 2024",
    "teamname": "Xoxo 24",
    "user_id": { "xata_id": "rec_cs9o8983dt2rbmedl51g" },
    "xata_createdat": "2024-10-19T13:24:44.880Z",
    "xata_id": "rec_cs9r675jen66ahq8unug", 
    "xata_updatedat": "2024-10-19T13:37:30.995Z", 
    "xata_version": 2 
  },
  { 
    "description": "Building intuitive interfaces",
    "teamname": "Frontend Team",
    "user_id": { "xata_id": "rec_cs9o305jen66ahq8umdg" },
    "xata_createdat": "2024-10-21T09:32:41.095Z",
    "xata_id": "rec_csb1vedjen66ahq8vajg", 
    "xata_updatedat": "2024-10-21T09:32:41.095Z", 
    "xata_version": 0 
  }
];

describe('Team Routes', () => {
  beforeAll(() => {
    app.use('/api/v1/teams', teamRoutes); // Adjust the path if necessary
  });

  describe('GET /api/v1/teams', () => {
    it('should return a list of teams', async () => {
      (TeamController.getAllTeams as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Teams fetched successfully", data: mockTeams });
      });

      const response = await request(app).get('/api/v1/teams');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTeams); 
    });
  });

  describe('POST /api/v1/teams', () => {
    it('should create a new team', async () => {
      const newTeam = { 
        teamname: 'New Team', 
        description: 'A new team for testing',
        user_id: { xata_id: 'some_user_id' } 
      };
      (TeamController.createTeam as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Team created successfully", data: { ...newTeam, xata_id: 'some_new_team_id' } });
      });

      const response = await request(app)
        .post('/api/v1/teams')
        .send(newTeam);

      expect(response.status).toBe(200);
      expect(response.body.data.teamname).toBe('New Team');
    });
  });

  describe('GET /api/v1/teams/:id', () => {
    it('should return a team by ID', async () => {
      const teamId = mockTeams[0].xata_id;
      (TeamController.getTeamById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Team fetched successfully", data: mockTeams[0] });
      });

      const response = await request(app).get(`/api/v1/teams/${teamId}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTeams[0]); 
    });
  });

  describe('PATCH /api/v1/teams/:id', () => {
    it('should update a team by ID', async () => {
      const teamId = mockTeams[0].xata_id;
      const updatedTeam = { description: 'Updated team description' };
      (TeamController.updateTeamById as jest.Mock).mockImplementation((req: any, res: any) => {
        res.status(200).json({ message: "Team updated successfully", data: { ...mockTeams[0], ...updatedTeam } });
      });

      const response = await request(app)
        .patch(`/api/v1/teams/${teamId}`)
        .send(updatedTeam);

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('Updated team description');
    });
  });

  describe('DELETE /api/v1/teams/:id', () => {
    it('should delete a team by ID', async () => {
      const teamId = mockTeams[0].xata_id;
      (TeamController.deletTeamById as jest.Mock).mockImplementation((req: any, res: any) => { // Note the typo
        res.status(200).json({ message: "Team deleted successfully" });
      });

      const response = await request(app).delete(`/api/v1/teams/${teamId}`);
      expect(response.status).toBe(200); 
    });
  });

  describe('GET /api/v1/teams/user/:id', () => {
    it('should return teams by user ID', async () => {
      const userId = mockTeams[0].user_id.xata_id;
      (TeamController.getTeamsByUserId as jest.Mock).mockImplementation((req: any, res: any) => {
        const teamsForUser = mockTeams.filter(team => team.user_id.xata_id === userId);
        res.status(200).json({ message: "Teams fetched successfully", data: teamsForUser });
      });

      const response = await request(app).get(`/api/v1/teams/user/${userId}`);
      expect(response.status).toBe(200);
      // Add assertions to check the correct teams are returned
    });
  });
});