import "../css/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faSitemap,
  faListCheck,
  faComments,
  faRightFromBracket,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

// Define interfaces for the data types
interface User {
  username: string;
  xata_id: string;
}

interface Team {
  teamname: string;
  xata_id: string;
}

interface Project {
  projectname: string;
  xata_id: string;
}

interface Task {
  description: string;
  xata_id: string;
}

interface Comment {
  content: string;
  xata_id: string;
}

function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<string>("");

  // Fetch data for users, teams, projects, tasks, and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/api/v1/users");
        setUsers(usersResponse.data.data);

        const teamsResponse = await axios.get("http://localhost:3000/api/v1/teams");
        setTeams(teamsResponse.data.data);

        const projectsResponse = await axios.get("http://localhost:3000/api/v1/projects");
        setProjects(projectsResponse.data.data);

        const tasksResponse = await axios.get("http://localhost:3000/api/v1/tasks");
        setTasks(tasksResponse.data.data);

        const commentsResponse = await axios.get("http://localhost:3000/api/v1/comments");
        setComments(commentsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // DELETE Task by ID
  const deleteTaskById = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.xata_id !== taskId)); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // DELETE User by ID
  const deleteUserById = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/${userId}`);
      setUsers(users.filter((user) => user.xata_id !== userId)); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // DELETE Project by ID
  const deleteProjectById = async (projectId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/projects/${projectId}`);
      setProjects(projects.filter((project) => project.xata_id !== projectId)); 
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Handle delete confirmation
  const handleDelete = (id: string, type: string) => {
    setDeleteId(id);
    setDeleteType(type);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteType === "user") {
      deleteUserById(deleteId!);
    } else if (deleteType === "project") {
      deleteProjectById(deleteId!);
    } else if (deleteType === "task") {
      deleteTaskById(deleteId!);
    }
    setShowModal(false);
    setDeleteId(null);
    setDeleteType("");
  };

  return (
    <>
      <div className="main">
        <section className="sect1">
          <h1>TaskHub</h1>
          <div className="user">
            <div className="title">
              <h2>Users</h2>
              <FontAwesomeIcon icon={faUser} className="fa" />
            </div>
            <div className="userH3">
              <h2>{users.length}</h2>
            </div>
          </div>
          <div className="users">
            <div className="title">
              <h2>Teams</h2>
              <FontAwesomeIcon icon={faUsers} className="fa" />
            </div>
            <div className="userH3">
              <h2>{teams.length}</h2>
            </div>
          </div>
          <div className="users">
            <div className="title">
              <h2>Projects</h2>
              <FontAwesomeIcon icon={faSitemap} className="fa" />
            </div>
            <div className="userH3">
              <h2>{projects.length}</h2>
            </div>
          </div>
          <div className="users">
            <div className="title">
              <h2>Tasks</h2>
              <FontAwesomeIcon icon={faListCheck} className="fa" />
            </div>
            <div className="userH3">
              <h2>{tasks.length}</h2>
            </div>
          </div>
          <div className="users">
            <div className="title">
              <h2>Comments</h2>
              <FontAwesomeIcon icon={faComments} className="fa" />
            </div>
            <div className="userH3">
              <h2>{comments.length}</h2>
            </div>
          </div>
          <button className="logout">
            Logout <FontAwesomeIcon icon={faRightFromBracket} className="fas" />
          </button>
        </section>
        <section className="sect2">
          <div className="search">
            <input type="text" placeholder="Search User..." />
            <button className="searchbtn">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="faS" />
            </button>
          </div>
          <div className="usersDetails">
            <div className="usersDetail">
              <h2 className="usersDetailh2">All Users, All Teams, All Projects</h2>
            </div>
            <div className="userStyling">
              <div>Username</div>
              <div>UserID</div>
              <div>Delete</div>
              <div>Teams</div>
              <div>Delete</div>
              <div>Project</div>
              <div>Delete</div>
            </div>
            <hr />
            <div className="userStylings">
              {/* Map Users */}
              <div className="users0">
                <h2>All Users</h2>
                {users.map((user) => (
                  <div className="userStylin" key={user.xata_id}>
                    <div>{user.username}</div>
                    <div>{user.xata_id}</div>
                    <button className="searchbtn" onClick={() => handleDelete(user.xata_id, "user")}>
                      <FontAwesomeIcon icon={faTrash} className="faS" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Map Teams */}
              <div className="Teams0">
                <h2>All Teams</h2>
                {teams.map((team) => (
                  <div className="userStyli" key={team.xata_id}>
                    <div>{team.teamname}</div>
                    <button className="searchbtn" onClick={() => handleDelete(team.xata_id, "team")}>
                      <FontAwesomeIcon icon={faTrash} className="faS" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Map Projects */}
              <div className="Projects0">
                <h2>All Projects</h2>
                {projects.map((project) => (
                  <div className="userStyli" key={project.xata_id}>
                    <div>{project.projectname}</div>
                    <button className="searchbtn" onClick={() => handleDelete(project.xata_id, "project")}>
                      <FontAwesomeIcon icon={faTrash} className="faS" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal for deletion confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this {deleteType}?</p>
            <button className="button" onClick={confirmDelete}>Yes, Delete</button>
            <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPage;
