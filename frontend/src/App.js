import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ClientDashboard from './components/ClientDashboard';
import AuthLayout from './pages/AuthLayout';
import ClientDashboardLayout from './pages/ClientDashboardLayout';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

const isLoggedIn = () => !!localStorage.getItem('token');

// 3D flip animations
const pageVariantsSignIn = {
  initial: { opacity: 0, rotateY: -90, scale: 0.8 },
  animate: { 
    opacity: 1, 
    rotateY: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    rotateY: 90, 
    scale: 0.8,
    transition: { duration: 0.5, ease: "easeIn" }
  },
};

const pageVariantsSignUp = {
  initial: { opacity: 0, rotateY: 90, scale: 0.8 },
  animate: { 
    opacity: 1, 
    rotateY: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    rotateY: -90, 
    scale: 0.8,
    transition: { duration: 0.5, ease: "easeIn" }
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  const getMotionProps = (pathname) => {
    if (pathname.includes('signin')) {
      return pageVariantsSignIn;
    } else if (pathname.includes('signup')) {
      return pageVariantsSignUp;
    }
    return pageVariantsSignIn;
  };

  const currentVariants = getMotionProps(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn() ? "/dashboard" : "/signin"} />} 
        />
        <Route 
          path="/signin" 
          element={
            <AuthLayout>
              <motion.div
                variants={currentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ transformStyle: "preserve-3d" }}
              >
                <SignIn />
              </motion.div>
            </AuthLayout>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthLayout>
              <motion.div
                variants={currentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ transformStyle: "preserve-3d" }}
              >
                <SignUp />
              </motion.div>
            </AuthLayout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn() ? (
              <ClientDashboardLayout>
                <ClientDashboard />
              </ClientDashboardLayout>
            ) : (
              <Navigate to="/signin" />
            )
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{
        minHeight: '100vh', 
        position: 'relative',
        display: 'flex', 
        alignItems: isDashboard ? 'stretch' : 'center',
        justifyContent: isDashboard ? 'stretch' : 'center'
      }}>
        {!isDashboard && <div className="auth-background" />}
        
        {isDashboard ? (
          // Full screen for ClientDashboard
          <AnimatedRoutes />
        ) : (
          // Smaller container for Sign In/Sign Up
          <Container maxWidth="sm" style={{ marginTop: '50px', marginBottom: '50px' }}>
            <AnimatedRoutes />
          </Container>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
