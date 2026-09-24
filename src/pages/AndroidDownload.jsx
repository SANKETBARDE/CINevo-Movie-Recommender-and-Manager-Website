import React from 'react';

export default function AndroidDownload() {
    return (
        <section className="container page-wrapper">
            <div className="page-header">
                <h1 className="page-title">Download CINevo</h1>
            </div>
            
            <div className="glass-panel content-panel mb-8 p-6 sm:p-10">
                <div className="text-center mb-8">
                    <img 
                        src="/assets/brand/logo.png" 
                        alt="CINevo Logo" 
                        style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 1.5rem',
                            borderRadius: '20px'
                        }}
                    />
                    
                    <h2 className="text-gradient-gold mb-3" style={{ fontSize: '1.8rem', fontWeight: '600' }}>
                        CINevo for Android
                    </h2>
                    <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Your personal movie companion. Discover, track, and manage your entertainment experience with intelligent recommendations and powerful tools.
                    </p>
                </div>

                <div className="text-center mb-8">
                    <a 
                        href="/assets/App/Cinevo.apk" 
                        download
                        className="btn-primary"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(147, 51, 234, 0.3)';
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.4)';
                        }}
                    >
                        <i className="fab fa-android" style={{ fontSize: '1.25rem' }}></i>
                        Download for Android
                    </a>
                    <p className="text-secondary mt-3" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        Version 1.0.0 • Android 5.0 or higher
                    </p>
                </div>

                <div className="row mb-8">
                    <div className="col-md-4 mb-4">
                        <div className="glass-panel p-4" style={{ height: '100%', border: '1px solid rgba(147, 51, 234, 0.1)' }}>
                            <h4 className="mb-3" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                                Intelligent Recommendations
                            </h4>
                            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
                                AI-powered suggestions based on your viewing history and preferences.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="glass-panel p-4" style={{ height: '100%', border: '1px solid rgba(147, 51, 234, 0.1)' }}>
                            <h4 className="mb-3" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                                Cross-Device Sync
                            </h4>
                            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
                                Seamless synchronization of your watchlist across all platforms.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="glass-panel p-4" style={{ height: '100%', border: '1px solid rgba(147, 51, 234, 0.1)' }}>
                            <h4 className="mb-3" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                                Advanced Filtering
                            </h4>
                            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
                                Powerful search tools with genre, year, rating, and custom filters.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center" style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(147, 51, 234, 0.05)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(147, 51, 234, 0.1)'
                }}>
                    <h3 className="mb-2" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                        iOS Version Coming Soon
                    </h3>
                    <p className="text-secondary" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        Currently in development. Subscribe to updates for launch notification.
                    </p>
                </div>
            </div>
        </section>
    );
}