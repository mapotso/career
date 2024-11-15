import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [userType, setUserType] = useState('student'); // Default user type for registration
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful');
        setError('');

        // Redirect based on user_type
        const userType = data.user.user_type;

        if (userType === 'admin') {
          navigate('/admin');
        } else if (userType === 'institute') {
          navigate('/institution');
        } else if (userType === 'student') {
          navigate('/universities');
        } else {
          setError('Unknown user type. Please contact support.');
        }
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (err) {
      setError('Error logging in. Please try again later.');
      setSuccess('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !profilePicture) {
      setError('Please fill in all fields and upload a profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('user_type', userType); 
    formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch('http://localhost:8081/register', {
        method: 'POST',
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful. You can now log in.');
        setError('');
        setIsRegistering(false); 
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (err) {
      setError('Error registering. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="login-page">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*" 
              onChange={(e) => setProfilePicture(e.target.files[0])}
              required
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="institute">Institute</option>
            </select>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p>
        {isRegistering ? 'Already have an account?' : 'Don’t have an account?'}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-register"
        >
          {isRegistering ? ' Login' : ' Register'}
        </span>
      </p>
    </div>
  );
};

export default Login;
