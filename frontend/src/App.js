import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('signin');
  
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn && view !== 'dashboard') {
      setView('dashboard');
    }
  }, [isLoggedIn, view]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('signin');
  };

  return (
    <div>
      {view === 'signin' && !isLoggedIn && <SignIn onSignInSuccess={() => setView('dashboard')} />}
      {view === 'signup' && !isLoggedIn && <SignUp onSignUpComplete={() => setView('signin')} />}
      {view === 'dashboard' && isLoggedIn && <Dashboard onLogout={handleLogout} />}

      {!isLoggedIn && view !== 'signup' && (
        <button onClick={() => setView('signup')}>Sign Up</button>
      )}
      {!isLoggedIn && view !== 'signin' && (
        <button onClick={() => setView('signin')}>Sign In</button>
      )}
    </div>
  );
}

export default App;
