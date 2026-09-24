import React from 'react';

export default function About() {
    return (
        <section className="container page-wrapper animate-fade-in-up">
            <div className="page-header">
                <h1 className="page-title">About Us</h1>
            </div>
            
            <div className="about-grid">
                <div>
                    <div className="glass-panel content-panel flex items-center justify-center p-4">
                        <img src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1931"
                            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} alt="Cinema seats" />
                    </div>
                </div>
                <div>
                    <div className="glass-panel content-panel">
                        <h3 className="text-gradient-gold mb-4" style={{ fontSize: '2rem' }}>Our Mission</h3>
                        <p className="mb-4 text-secondary" style={{ fontSize: '1.1rem' }}>
                            At CINevo, our core mission is simple: to make sure you never forget a movie you wanted to
                            watch. We all know the frustration of scrolling through endless titles, trying to remember that one
                            film you saw a trailer for weeks ago.
                        </p>
                        <p className="mb-4 text-secondary" style={{ fontSize: '1.1rem' }}>
                            CINevo is built to be your personal cinematic memory—a place where every intriguing discovery
                            is saved instantly to your wishlist, ready for your next movie night.
                        </p>
                        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
                            By combining smart discovery with an effortless wishlist system, we ensure that the films which
                            spark your interest today are the ones you enjoy tomorrow.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="page-header mt-8">
                <h2 className="page-title">Meet the Creator</h2>
            </div>
            
            <div className="team-card glass-panel mb-8">
                <img src="/assets/dev/sanket.png" className="team-photo" alt="Sanket Barde" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sanket+Barde&background=9333ea&color=fff&size=150' }} />
                <h3 className="text-gradient-gold" style={{ fontSize: '1.8rem' }}>Sanket Barde</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}>Founder & Lead Developer</p>
                <p style={{ color: 'var(--text-tertiary)' }}>
                    Sanket Barde is the Founder and Lead Developer of CINevo, architecting the platform from the
                    ground up. Based in Bangalore, he blends technical expertise in web development with a
                    deep love for cinema. Sanket is committed to delivering a fast, smart, and seamless experience
                    that takes the guesswork out of movie discovery.
                </p>
            </div>
        </section>
    );
}
