import google from '../assets/google.png'
import React from 'react';

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
}
const heading = {
    fontSize: '50px',
    marginBottom: '15px',
    color: '#92e3a9',
    marginTop: '50px',
}

const signIn = {
    fontSize: '30px',
    marginBottom: '8px',
}

const userInput = {
    padding: '10px 60px ',
    marginTop: '5px',
    borderRadius: '10px',
    border: '1px solid black'
}

const label={
    marginTop: '10px',
}

const forget = {
    marginTop: '20px',
    marginBottom: '20px',
    color: '#92e3a9',
    marginLeft: '180px',
    textDecoration: 'underline', 
    cursor: 'pointer',
}

const btn={
    padding: '10px 128px',
    border:'none',
    borderRadius: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '25px',
}
const googleDiv = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
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
    marginTop:'10px',
}

function SignUp() {
    return (
      <form action="" style={form}>
        <h1 style={heading}>TASKHUB</h1><br /><br />
        <h2 style={signIn}>SIGN UP</h2>
        <label style={label}>
          <p>Username</p>
          <input type="text" style={userInput}/>
        </label>
        <label style={label}>
          <p>Email</p>
          <input type="text" style={userInput}/>
        </label>
        <label style={label}>
          <p>Password</p>
          <input type="password" style={userInput}/>
        </label>
        <label style={label}>
          <p>Confirm Password</p>
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
        <p style={pNext}>Already have an Account? <span style={span}>Sign In</span></p>
      </form>
    );
  }
  export default SignUp;
  