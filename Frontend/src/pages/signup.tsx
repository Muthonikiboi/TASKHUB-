import google from '../assets/google.png';
import React, { useState } from 'react';
import axios from 'axios';
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
    marginTop: '50px',
};

const signIn = {
    fontSize: '30px',
    marginBottom: '8px',
};

const userInput = {
    padding: '10px 60px ',
    marginTop: '5px',
    borderRadius: '10px',
    border: '1px solid black'
};

const label = {
    marginTop: '10px',
};

const btn = {
    padding: '10px 128px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '25px',
    marginTop: '25px',

const googleDiv = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
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
    marginTop: '10px',
};

function SignUp() {
    const [username, setUsername] = useState('');
    const [useremail, setEmail] = useState('');
    const [userpassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        if (userpassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const userData = {
            username: username,
            useremail: useremail,
            userpassword: userpassword,
            passwordConfirm: confirmPassword
        };

        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/register', userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 201) {
                alert(response.data.status);
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/');
            } else {
                console.log(response.data.status)
                alert(response.data.status || 'Something went wrong!');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div style={main}>
        <div style={image}>
           <AuthSlider slides={slides} />
        </div>
        <div style={Form}>
                <form onSubmit={handleSubmit} style={form}>
                    <h1 style={heading}>TASKHUB</h1><br /><br />
                    <h2 style={signIn}>SIGN UP</h2>
                    <label style={label}>
                        <p>Username</p>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={userInput}
                            required
                        />
                    </label>
                    <label style={label}>
                        <p>Email</p>
                        <input
                            type="email"
                            value={useremail}
                            onChange={(e) => setEmail(e.target.value)}
                            style={userInput}
                            required
                        />
                    </label>
                    <label style={label}>
                        <p>Password</p>
                        <input
                            type="password"
                            value={userpassword}
                            onChange={(e) => setPassword(e.target.value)}
                            style={userInput}
                            required
                        />
                    </label>
                    <label style={label}>
                        <p>Confirm Password</p>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={userInput}
                            required
                        />
                    </label>
                    <div>
                        <button type="submit" style={btn}>Sign Up</button>
                    </div>
                    <p>or</p>
                    <div style={googleDiv}>
                        <img src={google} alt="" style={googleImg} />
                        <p>Sign in with Google</p>
                    </div>
                    <p style={pNext}>
                        Already have an Account? 
                        <span style={span} onClick={() => navigate('/')}>Sign In</span>
                    </p>
                </form>
        </div>
        </div> 
    );
}

export default SignUp;