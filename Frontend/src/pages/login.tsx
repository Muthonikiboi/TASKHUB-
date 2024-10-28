import React, { useState } from 'react';
import axios from 'axios';
import google from '../assets/google.jpeg';
import { useNavigate } from 'react-router-dom';
import slides from '../data/Slides';
import AuthSlider from '../components/AuthSlider';

const form: React.CSSProperties = {
    width: '60%',
    backgroundColor: 'whitesmoke',
    margin: 'auto',
    height: '80vh',
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column', 
    alignItems: 'center',
    borderRadius: 20
};

const main={
    display:"flex",
    width:"100%",
    height:"100vh"
}
const image={
    width: "50%",
    height:"100vh"
}

const Form={
    width: "50%",
    heifht: "100vh",
    backgroundColor:"white"
}

const heading = {
    fontSize: '50px',
    marginBottom: '15px',
    color: '#92e3a9',
    marginTop: '100px',
};

const signIn = {
    fontSize: '30px',
    marginBottom: '10px',
};

const userInput = {
    padding: '10px 60px ',
    marginTop: '10px',
    borderRadius: '10px',
    border: '1px solid black',
};

const label = {
    marginTop: '20px',
};

const forget = {
    marginTop: '25px',
    marginBottom: '25px',
    color: '#92e3a9',
    marginLeft: '180px',
    textDecoration: 'underline', 
    cursor: 'pointer',
};

const btn = {
    padding: '10px 128px',
    border: 'none',
    borderRadius: '10px',
    marginTop: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '20px',
};

const googleDiv = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25px',
    marginBottom: '20px',
    cursor: 'pointer',
};

const googleImg = {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const span = {
    color: '#92e3a9',
    textDecoration: 'underline', 
    cursor: 'pointer',
    fontWeight: 'bold',
};

const pNext = {
    marginTop: '15px',
};

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/login', {
                useremail: email,
                userpassword: password
            });

            const userdata = response.data.data;

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userdata', JSON.stringify(userdata));

            if (response.data.data.role === 'admin') {
                navigate('/AdminPage');
            } else {
                navigate('/MainPage');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div style={main}>
            <div style={image}>
               <AuthSlider slides={slides} />
            </div>
            <div style={Form}>
                <form action="" style={form} onSubmit={handleLogin}>
                <h1 style={heading}>TASKHUB</h1><br /><br />
                <h2 style={signIn}>SIGN IN</h2>
                <label style={label}>
                    <p>Email</p>
                    <input 
                        type="email" 
                        style={userInput} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </label>
                <label style={label}>
                    <p>Password</p>
                    <input 
                        type="password" 
                        style={userInput} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {/* Forgot Password Navigation */}
                <h4 style={forget} onClick={() => navigate('/ForgotPassword')}>Forgot password?</h4>

                <div>
                    <button type="submit" style={btn}>Sign In</button>
                </div>
                <p>or</p>
                <div style={googleDiv}>
                    <img src={google} alt="Google logo" style={googleImg} />
                    <p>Sign in with Google</p>
                </div>

                {/* Sign Up Navigation */}
                <p style={pNext}>
                    Are you new?
                    <span style={span} onClick={() => navigate('/SignUp')}> Create an Account</span>
                </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
