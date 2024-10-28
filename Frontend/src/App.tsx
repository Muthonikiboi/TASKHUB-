import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import Login from './pages/login';
import SignUp from './pages/signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/resetPassword';
import Home from './components/home';
import Teams from './components/myTeams';
import MyTasks from './components/myTasks';
import Project from './components/myProjects';
import AdminPage from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Teams" element={<Teams />} />
          <Route path="/MyTasks" element={<MyTasks />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/AdminPage" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;;
