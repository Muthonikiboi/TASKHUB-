import React, { useEffect, useState ,useRef } from 'react';
import '../css/home.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  emoji: string;
  timestamp: number;
}

const Home: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<number | undefined>(undefined);
  const lastPauseTime = useRef<number>(Date.now());

  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [
      { id: 1, text: 'List out your tasks below', completed: false, emoji: '😊', timestamp: Date.now() },
      { id: 2, text: 'Tasks will be deleted after 24 hours', completed: false, emoji: '😊', timestamp: Date.now() }
    ];
  });

  const [newTask, setNewTask] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const addTask = () => {
    if (newTask.trim() === '') {
      alert('Please enter a task.');
      return;
    }

    const newTaskItem: Task = {
      id: tasks.length + 1,
      text: newTask,
      completed: false,
      emoji: '😊',
      timestamp: Date.now()
    };

    const updatedTasks = [...tasks, newTaskItem];
    setTasks(updatedTasks);
    setNewTask('');
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const checkTaskExpiration = () => {
    const currentTime = Date.now();
    const updatedTasks = tasks.filter(task => currentTime - task.timestamp <= 24 * 60 * 60 * 1000); // 24 hours in ms
    if (updatedTasks.length !== tasks.length) {
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  useEffect(() => {
    checkTaskExpiration();
    const interval = setInterval(checkTaskExpiration, 60 * 60 * 1000); 
    return () => clearInterval(interval);
  }, [tasks]);
   // Function to reset the timer
   const resetTimer = () => {
    setTime(0);
    localStorage.setItem('timerStart', Date.now().toString()); // Reset the start time in localStorage
  };

  useEffect(() => {
    const storedStartTime = localStorage.getItem('timerStart');

    // If a start time exists in localStorage, calculate the elapsed time
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

      if (elapsedTime >= 86400) {
        // If 24 hours have passed, reset the timer
        resetTimer();
      } else {
        // Set the elapsed time to continue from the last session
        setTime(elapsedTime);
      }
    } else {
      // If no start time exists, set the current time as the start time
      localStorage.setItem('timerStart', Date.now().toString());
    }

    // Function to update the timer
    const updateTimer = () => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;

        // If 24 hours have passed, reset the timer
        if (newTime >= 86400) {
          resetTimer();
        }

        return newTime;
      });
    };

    // Start the timer interval only when the page is visible
    const startTimer = () => {
      if (!timerRef.current) {
        timerRef.current = setInterval(updateTimer, 1000); // Start the interval
      }
    };

    // Stop the timer when the page is not visible
    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; // Ensure the interval is fully cleared
      }
    };

    // Handle visibility change (pause when tab is hidden, resume when visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const pausedDuration = Date.now() - lastPauseTime.current;

        // Adjust the timer based on how long the page was hidden
        const adjustedElapsed = Math.floor((Date.now() - parseInt(localStorage.getItem('timerStart') || '0', 10) + pausedDuration) / 1000);
        setTime(adjustedElapsed);
        startTimer(); // Resume the timer when the page becomes visible
      } else {
        lastPauseTime.current = Date.now();
        stopTimer(); // Pause the timer when the page is hidden
      }
    };

    // Add event listeners for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start the timer immediately when the component mounts
    startTimer();

    // Cleanup on unmount
    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Convert seconds to HH:MM:SS format
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      <article className="TopArticle">
        <div className="head">
          <div className="calender">
            <h3 className="days">
              <span>
                <FontAwesomeIcon icon={faCalendarDays} className="fa" />
                Dammy Date
              </span>
            </h3>
          </div>
          <div className="profile">
            <img src="https://via.placeholder.com/150" alt="profile" />
            <h3>User Name</h3>
          </div>
        </div>
        <div className="hrDiv">
          <hr className='hr' />
        </div>
        <div className="greetings">
          <h2><span>Good Morning</span>, <span className='name'>Elizabeth</span></h2>
        </div>
      </article>

      <article className="BottomArticle">
        <div className="gridContainer">
          <div className="grid-item item1">
            <div className="todo-list">
              <h3 className='titleHeadings'>To do list</h3>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add</button>
              </div>
              <ul>
                {tasks.map(task => (
                  <li key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.text}
                    </span>
                    <button onClick={() => setShowEmojiPicker(showEmojiPicker === task.id ? null : task.id)}>
                      {task.emoji}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid-item item2">
            <h3><li>Tasks in To-Do list 👆 will be deleted after 24hrs</li></h3>
          </div>
          <div className="grid-item item3">
              <h3 className="titleHeadings2">Time Tracker</h3>
              <div className="timer-display">
                <span>{formatTime(time)}</span>
              </div>
          </div>
          <div className="grid-item item4">4</div>
          <div className="grid-item item5">
           <div className="taskLst">
            <h2>My Tasks</h2>
           </div>
           <div className="tsList">
            {/* <li>Team</li>
            <li>Task</li>
            <li>Due Date</li> */}
            <div className="divHeading">
              <div className="div1">TEAM</div>
              <div className="div2">TASK</div>
              <div className="div3">DUE DATE</div>
            </div>
            <hr />
            <div className="divHeading">
              <div className="div1">Team1</div>
              <div className="div2">Task1</div>
              <div className="div3">Due Date</div>
            </div>
            <div className="divHeading">
              <div className="div1">Team2</div>
              <div className="div2">Task2</div>
              <div className="div3">Due Date</div>
            </div>
            <div className="divHeading">
              <div className="div1">Team3</div>
              <div className="div2">Task3</div>
              <div className="div3">Due Date</div>
            </div>
           </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default Home;
