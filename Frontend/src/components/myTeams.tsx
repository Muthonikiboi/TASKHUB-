import '../css/teams.css';
import React, { useState } from 'react';

interface Team {
  id: number;
  name: string;
  description: string;
  members: string[];
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  stage: string;
  date: string;
  priority: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Team 1", description: "Description of team 1", members: ["Alice", "Bob"], tasks: [] }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
  

  // Task form state
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskStage, setTaskStage] = useState<string>('TODO');
  const [taskDate, setTaskDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [taskPriority, setTaskPriority] = useState<string>('NORMAL');

  const addMember = (teamId: number) => {
    if (!newMemberEmail.trim()) return;

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? { ...team, members: [...team.members, newMemberEmail] }
          : team
      )
    );
    setNewMemberEmail('');
    setShowMemberModal(false); // Close modal after adding member
  };

  const assignTask = (teamId: number) => {
    if (!taskTitle.trim() || !taskAssignee.trim()) return;

    const newTask: Task = {
      id: teams.find((team) => team.id === teamId)?.tasks.length! + 1,
      title: taskTitle,
      assignee: taskAssignee,
      stage: taskStage,
      date: taskDate,
      priority: taskPriority,
    };

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? { ...team, tasks: [...team.tasks, newTask] }
          : team
      )
    );

    // Reset task form
    setTaskTitle('');
    setTaskAssignee('');
    setTaskStage('TODO');
    setTaskDate(new Date().toISOString().slice(0, 10));
    setTaskPriority('NORMAL');
    setShowTaskModal(false);
  };
    const addTeam = (newTeam) => {
    const teamWithId = {
      id: teams.length + 1,
      ...newTeam,
      members: [],
      tasks: [],
    };
    setTeams([...teams, teamWithId]); // Update the state with the new team
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

              <h5 className='comms'>comments</h5>

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
              <button onClick={() => { setSelectedTeamId(team.id); setShowTaskModal(true); }}>
                Add Task
              </button>
              </div>

              {/* Display tasks assigned to the team */}
              {team.tasks.length > 0 && (
                <div className="tasks">
                  <h4>Tasks:</h4>
                  <ul>
                    {team.tasks.map((task) => (
                      <li key={task.id}>
                        {task.title} - {task.assignee} ({task.stage}) [Due: {task.date}, Priority: {task.priority}]
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="comments">
          <h2>Team Title</h2>
          <div className='commentsDiv'>
            <div className='comment1'>
              <h6>Name</h6>
              <hr />
              <p>This team is lit</p>
            </div>
            <div className='comment1'>
              <h6>Name</h6>
              <hr />
              <p>This team is lit</p>
            </div>
            <div className='comment1'>
              <h6>Name</h6>
              <hr />
              <p>This team is lit</p>
            </div>
          </div>
          
          <div className='commenting'>
            <input type="text" />
            <button className='button'>Send</button>
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && selectedTeamId !== null && (
          <div className="task-modal">
            <div className="modal-content">
              <h3>Assign Task</h3>
              <label htmlFor="">Task Title</label>
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <label htmlFor="">Assign Task To</label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
              >
                <option value="">Assign Task To:</option>
                {teams.find((team) => team.id === selectedTeamId)?.members.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
              <label htmlFor="">Task Progress</label>
              <select
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
              <label htmlFor="">Deadline</label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
              />
              <label htmlFor="">Task Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
              </select>
              <button onClick={() => assignTask(selectedTeamId)}  className='button'>Submit</button>
              <button onClick={() => setShowTaskModal(false)} className='button'>Cancel</button>
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
              <button onClick={() => addMember(selectedTeamId)} className='button'>Submit</button>
              <button onClick={() => setShowMemberModal(false)} className='button'>Cancel</button>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default Teams;
