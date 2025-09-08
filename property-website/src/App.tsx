import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import PropertyUploadPage from './components/PropertyUploadPage';
import AdminPanel from './components/AdminPanel';
import { animations, variants } from './theme';
import './App.css';

function NavigationHeader() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.nav-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <motion.nav 
      className="nav"
      variants={variants.springDrop}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animations.springDrop}
    >
      <div className="nav-container">
        <div className="nav-brand">
          Property Manager
        </div>

        {/* Mobile Menu Toggle */}
      {window.innerWidth < 768 && (
        <button
          className="nav-toggle "
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      )}

        {/* Navigation Menu */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {!user ? (
            <>
              <div>
                <Link 
                  to="/signup" 
                  className="btn btn-outline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
              <div>
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="text-primary bg-gray-100 px-3 py-1 rounded-full text-sm">
                Welcome, {user.fullName}
              </span>
              <div>
                <Link 
                  to="/upload-property" 
                  className="btn btn-success"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Property
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </>
          )}
          {/* <div>
            <Link 
              to="/admin" 
              className="btn btn-secondary hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </div> */}
        </div>
      </div>
    </motion.nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />

        {/* Main Content */}
        <motion.main 
          className="container md:py-6"
          variants={variants.springDrop}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={animations.springDrop}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<SignupPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upload-property" element={<PropertyUploadPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </AnimatePresence>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
