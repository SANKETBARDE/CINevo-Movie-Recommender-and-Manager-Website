import React from 'react';

export default function Terms() {
    return (
        <section className="container page-wrapper animate-fade-in-up">
            <div className="page-header">
                <h1 className="page-title">Terms of Service</h1>
            </div>
            
            <div className="glass-panel content-panel mb-8 p-6 sm:p-10">
                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>1. Acceptance of Terms</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    By accessing and using CINevo, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>2. Use of Service</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    CINevo is provided for your personal, non-commercial use. You may use our platform to discover movies, 
                    track your watchlists, and interact with community features. You agree not to misuse the service or help anyone else do so.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>3. User Accounts</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    To access certain features of the service, you must create an account using Google authentication. 
                    You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>4. Data & API Usage</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    CINevo uses the TMDb API for movie data but is not endorsed or certified by TMDb. 
                    All movie data, posters, and related content are the property of their respective owners.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>5. Modifications</h3>
                <p className="mb-2 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice 
                    prior to any new terms taking effect.
                </p>
            </div>
        </section>
    );
}
