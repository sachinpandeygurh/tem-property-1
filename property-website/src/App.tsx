import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import PropertyUploadPage from './components/PropertyUploadPage';
import AdminPanel from './components/AdminPanel';
import { colors, shadows, animations } from './theme';
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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={animations.spring}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-brand"
          whileHover={{ scale: 1.05 }}
          transition={animations.ease}
        >
          Property Manager
        </motion.div>

        {/* Mobile Menu Toggle */}
        <button
          className="nav-toggle hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>


        {/* Navigation Menu */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup" 
                  className="btn btn-outline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.span 
                className="text-primary bg-gray-100 px-3 py-1 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={animations.spring}
              >
                Welcome, {user.fullName}
              </motion.span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/upload-property" 
                  className="btn btn-success"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Property
                </Link>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                className="btn btn-danger"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/admin" 
              className="btn btn-secondary hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </motion.div>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={animations.ease}
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
