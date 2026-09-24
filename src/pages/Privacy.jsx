import React from 'react';

export default function Privacy() {
    return (
        <section className="container page-wrapper animate-fade-in-up">
            <div className="page-header">
                <h1 className="page-title">Privacy Policy</h1>
            </div>
            
            <div className="glass-panel content-panel mb-8 p-6 sm:p-10">
                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>1. Information We Collect</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    When you sign in to CINevo, we collect basic profile information provided by Google (such as your name and email address) 
                    and the data you explicitly provide to us, such as your movie watchlists, ratings, and preferences.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>2. How We Use Your Information</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    The information we collect is used solely to provide and improve the CINevo experience. 
                    We use your preferences to generate personalized movie recommendations and keep your watchlist synced across devices.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>3. Data Storage & Security</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    We implement industry-standard security measures to protect your personal information. 
                    Your authentication is handled securely via Firebase Authentication, and we do not store or have access to your Google password.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>4. Sharing Your Information</h3>
                <p className="mb-6 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    We do not sell, trade, or rent your personal identification information to others. 
                    We may share generic aggregated demographic information not linked to any personal identification information with our partners.
                </p>

                <h3 className="text-gradient-gold mb-4" style={{ fontSize: '1.8rem' }}>5. Contact Us</h3>
                <p className="mb-2 text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, 
                    please visit our Contact page.
                </p>
            </div>
        </section>
    );
}
