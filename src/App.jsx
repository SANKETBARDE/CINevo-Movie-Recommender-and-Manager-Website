import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MovieDetails from './pages/MovieDetails';
import Recommended from './pages/Recommended';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import ActorDetails from './pages/ActorDetails';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AndroidDownload from './pages/AndroidDownload';
import { useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { user, userProfile, loading } = useAuth();

  // Show loading only during initial auth state check, not after login
  if (loading && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#050505',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(147, 51, 234, 0.3)',
          borderTop: '3px solid #9333ea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
      return (
          <Router>
              <ScrollToTop />
              <div className="d-flex flex-column min-vh-100">
                  <LandingNavbar />
                  <div className="main-content d-flex flex-column grow">
                      <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/android-download" element={<AndroidDownload />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                  </div>
                  <Footer />
              </div>
          </Router>
      );
  }



  return (
    <Router>
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="main-content d-flex flex-column grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/movie-details" element={<MovieDetails />} />
                <Route path="/actor-details" element={<ActorDetails />} />
                <Route path="/recommended" element={<Recommended />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
          </div>
          <Footer />
      </div>
    </Router>
  );
}

export default App;
