import React, { useState } from 'react';
import API from '../services/api';

const SignIn = ({ onSignInSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signin', formData);
      localStorage.setItem('token', res.data.token);
      onSignInSuccess();
    } catch (err) {
      console.error(err);
      alert('Sign-in failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
