/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/myTasks.css';

interface Task {
  id: string;
  name: string;
  projectName: string;
  teamName: string;
  description: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/tasks');
        const apiTasks = response.data.data.map((task: any) => ({
          id: task.xata_id,
          name: task.description,
          projectName: task.project_id.xata_id,
          teamName: "Team1",
          description: task.description,
          comments: [],
        }));
        setTasks(apiTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addComment = async (taskId: string) => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/tasks/${taskId}/comments`, {
        text: commentText,
        author: "currentUser", // Replace with actual user info if available
      });

      const newComment: Comment = {
        id: response.data.comment_id, // Ensure this matches your API response
        text: commentText,
        author: "currentUser", // Replace with actual user info if available
      };

      // Update comments in the state
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      ));

      // Fetch updated comments from the server
      fetchComments(taskId);

      setCommentText('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Fetch comments for the selected task
  const fetchComments = async (taskId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/tasks/${taskId}/comments`);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, comments: response.data.comments } // Assuming the response structure
            : task
        )
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const openCommentsModal = (task: Task) => {
    fetchComments(task.id); // Fetch comments when opening the modal
    setSelectedTask(task);
  };

  const closeCommentsModal = () => {
    setSelectedTask(null);
  };

  return (
    <>
      <article className="TopArticle">
        <div className="title">
          <h1>My Tasks</h1>
        </div>
      </article>
      <article className="BottomArticle">
        <div className="taskLists">
          {tasks.map((task) => (
            <div className="grid-item task-item" key={task.id}>
              <h2>{task.name}</h2>
              <p>Project: {task.projectName}</p>
              <p>Team: {task.teamName}</p>
              <button onClick={() => openCommentsModal(task)}>View Comments</button>
            </div>
          ))}
        </div>

        {/* Comments Modal */}
        {selectedTask && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Comments for {selectedTask.name}:</h4>
              <ul>
                {selectedTask.comments.length > 0 ? selectedTask.comments.map(comment => (
                  <li key={comment.id}>
                    <strong>{comment.author}:</strong> {comment.text}
                  </li>
                )) : <p>No comments yet.</p>}
              </ul>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={() => addComment(selectedTask.id)}>Submit</button>
              <button onClick={closeCommentsModal}>Close</button>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default MyTasks;
