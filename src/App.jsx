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
import { useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { user, userProfile } = useAuth();

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

  // Intercept user if they haven't completed their profile
  if (!userProfile?.isProfileComplete) {
      return (
          <Router>
              <ScrollToTop />
              <div className="d-flex flex-column min-vh-100">
                  <Navbar />
                  <div className="main-content d-flex flex-column grow">
                      <Routes>
                          <Route path="/onboarding" element={<Onboarding />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="*" element={<Navigate to="/onboarding" replace />} />
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
