import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingNavbar() {
    return (
        <header className="main-header flex items-center">
            <div className="container nav-container">
                <Link className="flex items-center gap-2" to="/" style={{ textDecoration: 'none' }}>
                    <span className="brand-logo-text">
                        <span className="logo-plot">CIN</span>
                        <span className="logo-twist">evo</span>
                    </span>
                </Link>
                
                <div className="d-none d-md-flex align-items-center gap-3">
                    <Link to="/signin" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                        Sign In
                    </Link>
                    <Link to="/android-download" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                        Download App
                    </Link>
                </div>
            </div>
        </header>
    );
}
