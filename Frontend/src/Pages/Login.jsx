
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearAllUserErrors, login } from '../store/slices/userSlice';
import { toast } from 'react-toastify';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLock2Fill } from 'react-icons/ri';

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, isAuth, error } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('role', role);
    formData.append('email', email);
    formData.append('password', password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuth) {
      navigateTo('/');
    }
  }, [error, isAuth, dispatch, navigateTo]);

  return (
    <>
      <section className="login-section">
        <div className="login-container">
          <div className="login-header">
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Login As</label>
              <div className="input-wrapper">
                <select value={role} onChange={(e) => setRole(e.target.value)} className="login-input">
                  <option value="">Select Role</option>
                  <option value="Employer">Login as an Employer</option>
                  <option value="Employee">Login as an Employee</option>
                </select>
                <FaRegUser className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
                <MdOutlineMailOutline className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
                <RiLock2Fill className="input-icon" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="login-button">
              Login
            </button>
            <Link to="/register" className="register-link">Register Now</Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;

