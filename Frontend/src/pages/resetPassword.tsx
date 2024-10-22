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
    marginTop: '130px',
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

const btn={
    padding: '10px 100px',
    border:'none',
    borderRadius: '10px',
    marginTop: '40px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '20px',
}

function ResetPassword() {
    return (
      <form action="" style={form}>
        <h1 style={heading}>TASKHUB</h1><br /><br />
        <h2 style={signIn}>RESET PASSWORD</h2>
        <label style={label}>
          <p>Enter token</p>
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
        <div>
          <button type="submit" style={btn}>Reset Password</button>
        </div>
      </form>
    );
  }
  export default ResetPassword;
  