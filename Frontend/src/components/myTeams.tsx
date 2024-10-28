/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/teams.css';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  teamId: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/teams');
        const apiTeams = response.data.data.map((team: any) => ({
          id: team.xata_id,
          name: team.teamname,
          description: team.description,
          members: [],
          projects: [], // Initialize projects as empty
        }));
        setTeams(apiTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // Add a new project
  const addProject = async () => {
    if (!projectName.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/v1/projects', {
        projectname: projectName,
        team_id: selectedTeamId
      });

      const newProject: Project = {
        id: response.data.xata_id,
        name: projectName,
        teamId: selectedTeamId!,
      };

      setTeams(
        teams.map((team) =>
          team.id === selectedTeamId
            ? { ...team, projects: [...team.projects, newProject] }
            : team
        )
      );

      setProjectName('');
      setShowProjectModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <>
      <article className="TopArticle">
        <div className="title">
          <h1>My Teams</h1>
        </div>
      </article>
      <article className="BottomArticle">
        <div className="teamLists">
          {teams.map((team) => (
            <div className="grid-item" key={team.id}>
              <h2>{team.name}</h2>
              <p>{team.description}</p>

              <div className="members">
                <h4>Members:</h4>
                <ul>
                  {team.members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>

              <div className="btns">
                <button onClick={() => { setSelectedTeamId(team.id); setShowMemberModal(true); }}>
                  Add Member
                </button>
                <button onClick={() => { setSelectedTeamId(team.id); setShowProjectModal(true); }}>
                  Add Project
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {showProjectModal && (
          <div className="project-modal">
            <div className="modal-content">
              <h3>Add New Project</h3>
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button className="button" onClick={addProject}>Add Project</button>
              <button className="button" onClick={() => setShowProjectModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Member Modal */}
        {showMemberModal && selectedTeamId !== null && (
          <div className="member-modal">
            <div className="modal-content">
              <h3>Add Member</h3>
              <label htmlFor="">Enter Email</label>
              <input
                type="email"
                placeholder="Member Email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <button onClick={() => {/* Add member logic here */}} className='button'>Submit</button>
              <button onClick={() => setShowMemberModal(false)} className='button'>Cancel</button>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default Teams;
