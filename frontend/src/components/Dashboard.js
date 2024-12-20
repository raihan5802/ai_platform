import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/dashboard');
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Your email: {user.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
