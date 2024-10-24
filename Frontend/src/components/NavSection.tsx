import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPeopleGroup, faClipboardCheck, faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons"; 
import '../css/navSection.css';

function NavbarSection({ addTeam }) {
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const handleCreateTeam = () => {
    // Pass the new team data to parent component (Teams)
    addTeam({ name: teamName, description: teamDescription });
    setShowModal(false); // Close the modal after creating the team
  };

  return (
    <>
      <div className="main">
        <h1 className="title">TASKBAR</h1>

        <button className="btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="fas" />
          Create Team
        </button>

        {/* Modal for creating a team */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create Team</h2>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Team Description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={handleCreateTeam}>Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <div className="general">
          <h3 className="h3">General</h3>
          <div className="icons">
            <FontAwesomeIcon icon={faHome} className="fa" />
            <p>Home</p>
          </div>
          <div className="icons">
            <FontAwesomeIcon icon={faPeopleGroup} className="fa" />
            <p>My Teams</p>
          </div>
          <div className="icons">
            <FontAwesomeIcon icon={faClipboardCheck} className="fa" />
            <p>My Projects</p>
          </div>
          <div className="icons">
            <FontAwesomeIcon icon={faListCheck} className="fa" />
            <p>My Tasks</p>
          </div>
        </div>

        <div className="dailyWorkSpace">
          <h3 className="h3">My Workspace</h3>
          <div className="workspace">
            <div className="icons">
              <p>daily content of tasks being done</p>
            </div>
            {/* Additional workspace content here */}
          </div>
        </div>

        <button className="help">Get Help</button><br />
        <button className="btn">Give FeedBack</button>
      </div>
    </>
  );
}

export default NavbarSection;
