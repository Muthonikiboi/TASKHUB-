import React from 'react';
import google from '../assets/google.jpeg'

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

const heading = {
    fontSize: '50px',
    marginBottom: '15px',
    color: '#92e3a9',
    marginTop: '100px',
}

const signIn = {
    fontSize: '30px',
    marginBottom: '10px',
}

const userInput = {
    padding: '10px 60px ',
    marginTop: '10px',
    borderRadius: '10px',
    border: '1px solid black'
}

const label={
    marginTop: '20px',
}

const forget = {
    marginTop: '25px',
    marginBottom: '25px',
    color: '#92e3a9',
    marginLeft: '180px',
    textDecoration: 'underline', 
    cursor: 'pointer',
}

const btn={
    padding: '10px 128px',
    border:'none',
    borderRadius: '10px',
    marginTop: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '20px',
}
const googleDiv = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25px',
    marginBottom: '20px',
    cursor: 'pointer',
}

const googleImg = {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
}

const span = {
    color: '#92e3a9',
    textDecoration: 'underline', 
    cursor: 'pointer',
    fontWeight: 'bold',
}

const pNext = {
    marginTop:'15px',
}

function Login() {
    return (
      <form action="" style={form}>
        <h1 style={heading}>TASKHUB</h1><br /><br />
        <h2 style={signIn}>SIGN IN</h2>
        <label style={label}>
          <p>Username</p>
          <input type="text" style={userInput}/>
        </label>
        <label style={label}>
          <p>Password</p>
          <input type="password" style={userInput}/>
        </label>
        <h4 style={forget}>Forgot password?</h4>
        <div>
          <button type="submit" style={btn}>Sign In</button>
        </div>
        <p>or</p>
        <div style={googleDiv}>
            <img src={google} alt="" style={googleImg}/>
            <p >Sign in with Google</p>
        </div>
        <p style={pNext}>Are you new?<span style={span}> Create an Account</span></p>
      </form>
    );
  }
  export default Login;
  