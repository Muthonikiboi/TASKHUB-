/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/myProjects.css';

interface Project {
  id: string;
  name: string;
  teamId: string;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string; // Add task name
  description: string; // Task description
  assignedTo: string; // Assignee
  status: string; // Task stage
  due_date: string; // Task due date
  priority: string; // Task priority
}

interface Member {
  id: string; // Member ID
  name: string; // Member name
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<Member[]>([]); // State for team members
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  
  // Task modal fields
  const [taskName, setTaskName] = useState<string>(''); // Task name
  const [taskDescription, setTaskDescription] = useState<string>(''); // Task description
  const [taskAssignee, setTaskAssignee] = useState<string>('Unassigned');
  const [taskStatus, setTaskStatus] = useState<string>('TODO'); // Changed to stage
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<string>('NORMAL');

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/projects');
        const apiProjects = response.data.data.map((project: any) => ({
          id: project.xata_id,
          name: project.projectname,
          teamId: project.team_id.xata_id,
          tasks: [], // Initialize tasks as an empty array
        }));
        setProjects(apiProjects);
        // Fetch team members for the selected team
        fetchTeamMembers(apiProjects[0]?.teamId); // Fetch members for the first project (if exists)
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch team members for a given team ID
  const fetchTeamMembers = async (teamId: string) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/v1/teams/${teamId}/members`);
      setTeamMembers(response.data.data.map((member: any) => ({
        id: member.xata_id, // Adjust based on your API response
        name: member.name, // Adjust based on your API response
      })));
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  // Add or Update task
  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim() || !taskDueDate) return;

    if (selectedTask) {
      // Update existing task
      try {
        await axios.put(`http://localhost:7000/api/v1/tasks/${selectedTask.id}`, {
          name: taskName,
          description: taskDescription,
          due_date: taskDueDate,
          status: taskStatus,
          assignedTo: taskAssignee,
          priority: taskPriority,
        });

        // Update the local state
        setProjects(
          projects.map((project) =>
            project.id === selectedProjectId
              ? {
                  ...project,
                  tasks: project.tasks.map((task) =>
                    task.id === selectedTask.id
                      ? { ...task, name: taskName, description: taskDescription, due_date: taskDueDate, status: taskStatus, assignedTo: taskAssignee, priority: taskPriority }
                      : task
                  ),
                }
              : project
          )
        );

        setSelectedTask(null);
        setShowTaskModal(false);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      // Add new task
      try {
        const response = await axios.post('http://localhost:7000/api/v1/tasks', {
          name: taskName,
          description: taskDescription,
          due_date: taskDueDate,
          status: taskStatus,
          assignedTo: taskAssignee,
          priority: taskPriority,
          project_id: selectedProjectId,
        });

        const newTask: Task = {
          id: response.data.data.xata_id, // Adjust based on your API response
          name: taskName,
          description: taskDescription,
          due_date: taskDueDate,
          status: taskStatus,
          assignedTo: taskAssignee,
          priority: taskPriority,
        };

        setProjects(
          projects.map((project) =>
            project.id === selectedProjectId
              ? { ...project, tasks: [...project.tasks, newTask] }
              : project
          )
        );

        // Reset modal fields
        setTaskName('');
        setTaskDescription('');
        setTaskDueDate('');
        setTaskStatus('TODO');
        setTaskAssignee('Unassigned');
        setTaskPriority('NORMAL');
        setShowTaskModal(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskName(task.name); // Set the task name
    setTaskDescription(task.description);
    setTaskDueDate(task.due_date);
    setTaskStatus(task.status);
    setTaskAssignee(task.assignedTo);
    setTaskPriority(task.priority);
    setShowTaskModal(true);
  };

  return (
    <>
      <article className="TopArticle">
        <div className="title">
          <h1>My Projects</h1>
        </div>
      </article>
      <article className="BottomArticle">
        <div className="teamLists">
          {projects.map((project) => (
            <div className="grid-item" key={project.id}>
              <h2>{project.name}</h2>
              <p>Team ID: {project.teamId}</p>
              
              <div className="btns">
                <button onClick={() => {
                  setSelectedProjectId(project.id);
                  fetchTeamMembers(project.teamId); // Fetch members for the selected project
                  setShowTaskModal(true);
                  setSelectedTask(null); // For new task
                }}>
                  Create Task
                </button>
                <button onClick={() => {
                  if (project.tasks.length === 0) {
                    alert("No tasks available to update. Please add a task first.");
                    return;
                  }
                  setSelectedProjectId(project.id);
                  setSelectedTask(project.tasks[project.tasks.length - 1]); // Set to the last task for update
                  setTaskName(project.tasks[project.tasks.length - 1].name); // Set task name for edit
                  setTaskDescription(project.tasks[project.tasks.length - 1].description);
                  setTaskDueDate(project.tasks[project.tasks.length - 1].due_date);
                  setTaskStatus(project.tasks[project.tasks.length - 1].status);
                  setTaskAssignee(project.tasks[project.tasks.length - 1].assignedTo);
                  setTaskPriority(project.tasks[project.tasks.length - 1].priority);
                  setShowTaskModal(true);
                }}>
                  Update Task
                </button>
              </div>

              {/* Display tasks for each project */}
              {project.tasks.length > 0 && (
                <div className="tasks">
                  <h5>Tasks:</h5>
                  <ul>
                    {project.tasks.map((task) => (
                      <li key={task.id}>
                        {task.name} - {task.status} - {task.assignedTo} - {new Date(task.due_date).toLocaleDateString()}
                        <button onClick={() => handleEditTask(task)}>Update Task</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Task Modal */}
        {showTaskModal && (
          <div className="task-modal">
            <div className="modal-content">
              <h3>{selectedTask ? 'Update Task' : 'Add New Task'}</h3>
              <input 
                type="text" 
                placeholder="Task Name" // Updated to reflect task name
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
              />
              <input
                placeholder="Task Description" // Added textarea for task description
                value={taskDescription} 
                onChange={(e) => setTaskDescription(e.target.value)} 
              />
              <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
                <option value="Unassigned">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
              <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                <option value="TODO">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Complete</option>
              </select>
              <input 
                type="date" 
                value={taskDueDate} 
                onChange={(e) => setTaskDueDate(e.target.value)} 
              />
              <div className="btns">
                <button className="button" onClick={saveTask}>
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                <button className="button" onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default Projects;
