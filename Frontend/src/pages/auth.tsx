import '../css/auth.css';
import slides from '../data/Slides';
import AuthSlider from '../components/AuthSlider';
// import Login from './login';
import SignUp from './signup';
// import ForgotPassword from './ForgotPassword';
// import ResetPassword from './resetPassword';


function Auth() {
  return (
    <>
      <div className="SignUp">
        <div className="image">
          <AuthSlider slides={slides} />
        </div>
        <div className="form">
          {/* Form content */}
          {/* <Login /> */}
          <SignUp />
          {/* <ForgotPassword /> */}
          {/* <ResetPassword /> */}
        </div>
      </div>
    </>
  );
}

export default Auth;
