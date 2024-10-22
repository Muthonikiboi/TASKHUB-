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
    marginBottom: '20px',
    color: '#92e3a9',
    marginTop: '180px',
}

const signIn = {
    fontSize: '30px',
    marginBottom: '25px',
}

const userInput = {
    padding: '10px 60px ',
    marginTop: '10px',
    borderRadius: '10px',
    border: '1px solid black'
}

const label={
    marginTop: '30px',
}

const btn={
    padding: '10px 90px',
    border:'none',
    borderRadius: '10px',
    marginTop: '50px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '20px',
}

function ForgotPassword() {
    return (
      <form action="" style={form}>
        <h1 style={heading}>TASKHUB</h1><br /><br />
        <h2 style={signIn}>FORGOT PASSWORD</h2>
        <label style={label}>
          <p>Email</p>
          <input type="email" style={userInput}/>
        </label>
        <div>
          <button type="submit" style={btn}>GET RESET TOKEN</button>
        </div>
      </form>
    );
  }
  export default ForgotPassword;
  