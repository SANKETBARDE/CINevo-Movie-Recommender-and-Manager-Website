import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSearchResults, imgBaseUrl } from '../services/tmdb';

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, logout } = useAuth();
    const dropdownRef = useRef(null);

    // Close search on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setQuery('');
    }, [location.pathname]);

    // Debounce search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsSearching(false);
            setShowDropdown(false);
            return;
        }

        setShowDropdown(true);
        setIsSearching(true);

        const delayDebounceFn = setTimeout(() => {
            fetchSearchResults(query).then(data => {
                setResults(data.slice(0, 6)); // Show top 6 matches
                setIsSearching(false);
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Prevent body scroll when search overlay is open
    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; }
    }, [isSearchOpen]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);
            setIsSearchOpen(false);
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    const handleSelect = (id, type) => {
        setShowDropdown(false);
        setIsSearchOpen(false);
        setQuery('');
        if (type === 'person') {
            navigate(`/actor-details?id=${id}`);
        } else {
            navigate(`/movie-details?id=${id}`);
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <header className="main-header flex items-center sticky-top">
                <div className="container nav-container">
                    <div className="mobile-brand-container">
                        <Link className="flex items-center" to="/" style={{ textDecoration: 'none' }}>
                            <span className="brand-logo-text">
                                <span className="logo-plot">Plot</span>
                                <span className="logo-twist">twist</span>
                            </span>
                        </Link>
                        
                        <div className="mobile-top-actions d-md-none">
                            <button className="mobile-top-btn" onClick={() => setIsSearchOpen(true)}>
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <ul className="nav-links">
                        <li>
                            <Link className={`nav-link ${isActive('/recommended')}`} to="/recommended">Recommended</Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isActive('/wishlist')}`} to="/wishlist">Wishlist</Link>
                        </li>
                        <li>
                            <Link className={`nav-link ${isActive('/about')}`} to="/about">About</Link>
                        </li>
                    </ul>
                    
                    <div className="nav-actions flex items-center gap-4">
                        {/* Desktop Search Icon */}
                        <button className="desktop-search-icon" onClick={() => setIsSearchOpen(true)} aria-label="Search">
                            <i className="bi bi-search"></i>
                        </button>
                        
                        {user && (
                            <div className="profile-dropdown-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>

                                <img 
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.username || user?.displayName || 'Cinephile')}&background=random`} 
                                    alt="profile" 
                                    className="profile-img" 
                                    title={user.email} 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.username || user?.displayName || 'Cinephile')}&background=random`;
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="mobile-bottom-nav d-md-none">
                <Link to="/" className={`bottom-nav-item ${isActive('/')}`}>
                    <i className={isActive('/') ? 'bi bi-house-door-fill' : 'bi bi-house-door'}></i>
                    <span>Home</span>
                </Link>
                <Link to="/recommended" className={`bottom-nav-item ${isActive('/recommended')}`}>
                    <i className={isActive('/recommended') ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                    <span>For You</span>
                </Link>
                <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist')}`}>
                    <i className={isActive('/wishlist') ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
                    <span>Wishlist</span>
                </Link>
                {user ? (
                    <Link to="/profile" className={`bottom-nav-item ${isActive('/profile')}`}>
                        <i className={isActive('/profile') ? 'bi bi-person-fill' : 'bi bi-person'}></i>
                        <span>Profile</span>
                    </Link>
                ) : (
                    <Link to="/signin" className={`bottom-nav-item ${isActive('/signin')}`}>
                        <i className="bi bi-person"></i>
                        <span>Sign In</span>
                    </Link>
                )}
            </nav>

            {/* Global Search Overlay (Desktop & Mobile) */}
            <div className={`global-search-overlay ${isSearchOpen ? 'active' : ''}`}>
                <div className="global-search-container">
                    <div className="global-search-header">
                        <form className="global-search-input-wrapper" onSubmit={handleSearch}>
                            <i className="bi bi-search"></i>
                            <input
                                autoFocus
                                type="search"
                                className="global-search-input"
                                placeholder="Search movies, actors, and more..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </form>
                        <button className="global-search-close" onClick={() => { setIsSearchOpen(false); setQuery(''); }}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className="global-search-results flex-grow-1">
                        {isSearching ? (
                            <div className="p-4 text-center text-secondary">
                                <i className="bi bi-arrow-repeat spin" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}></i> 
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
                            <ul className="search-results-list" style={{ position: 'relative', top: 0, boxShadow: 'none', background: 'transparent' }}>
                                {results.map(item => {
                                    const isPerson = item.media_type === 'person';
                                    const imgPath = isPerson ? item.profile_path : item.poster_path;
                                    const title = isPerson ? item.name : item.title;
                                    const subtitle = isPerson ? item.known_for_department : (item.release_date ? item.release_date.split('-')[0] : 'N/A');
                                    const imgSrc = imgPath ? `${imgBaseUrl}${imgPath}` : 'https://via.placeholder.com/70x105';
                                    
                                    return (
                                        <li key={item.id} className="search-result-item" onClick={() => handleSelect(item.id, item.media_type)} style={{ padding: '0.75rem 0' }}>
                                            <img src={imgSrc} alt="" className="search-result-img" style={isPerson ? { borderRadius: '50%', objectFit: 'cover' } : {}} />
                                            <div className="search-result-info">
                                                <div className="search-result-title" style={{ fontSize: '1.2rem' }}>{title}</div>
                                                <div className="search-result-year" style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>{subtitle}</div>
                                            </div>
                                        </li>
                                    );
                                })}
                                <li className="search-result-footer" onClick={() => handleSearch()} style={{ background: 'transparent', paddingLeft: 0, paddingRight: 0 }}>
                                    <button className="btn-secondary w-100 mt-2">See all results</button>
                                </li>
                            </ul>
                        ) : query.trim() ? (
                            <div className="p-4 text-center text-secondary">No results found for "{query}".</div>
                        ) : (
                            <div className="p-4 text-center text-secondary" style={{ opacity: 0.7, marginTop: '10vh' }}>
                                <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: 'var(--border-color)' }}></i>
                                Type to start searching
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
