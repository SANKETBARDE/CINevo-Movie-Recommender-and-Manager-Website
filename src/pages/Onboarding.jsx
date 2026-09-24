import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"];

export default function Onboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: user?.displayName || '',
        bio: '',
        favoriteGenres: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const toggleGenre = (genre) => {
        setFormData(prev => {
            const genres = prev.favoriteGenres;
            if (genres.includes(genre)) {
                return { ...prev, favoriteGenres: genres.filter(g => g !== genre) };
            } else {
                if (genres.length >= 3) return prev; // limit to 3
                return { ...prev, favoriteGenres: [...genres, genre] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username.trim()) {
            setError('Please provide a username.');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                username: formData.username,
                bio: formData.bio,
                favoriteGenres: formData.favoriteGenres,
                email: user.email,
                photoURL: user.photoURL,
                isProfileComplete: true,
                createdAt: new Date().toISOString()
            }, { merge: true });

            navigate('/');
        } catch (err) {
            console.error("Error saving profile:", err);
            setError("Failed to save your profile. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <div className="landing-hero" style={{ padding: '0 1rem', marginTop: '80px', flexGrow: 1, width: '100vw', maxWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="landing-bg" style={{ filter: 'brightness(0.5) blur(6px)' }}></div>
            <div className="landing-overlay"></div>
            
            <div className="container animate-fade-in-up" style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ 
                    width: '100%',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    textAlign: 'left'
                }}>
                    
                    {/* Top Section - Profile Picture & Welcome */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <img 
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=random`} 
                                alt="Profile" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=random`;
                                }}
                                style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid var(--accent-gold)', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                            />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: 'white' }}>Welcome!</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>{user?.email}</p>
                    </div>

                    {/* Bottom Section - Form Area */}
                    <div>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h2 className="text-gradient-gold" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Complete Profile</h2>
                            <p className="text-secondary" style={{ fontSize: '1rem' }}>Let's personalize your CINevo experience before we dive in.</p>
                        </div>

                        {error && <div style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Display Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    placeholder="What should we call you?"
                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Short Bio</label>
                                <textarea 
                                    className="form-control" 
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    placeholder="A little about yourself..."
                                    rows="4"
                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', resize: 'vertical', fontSize: '1rem' }}
                                ></textarea>
                            </div>

                            <div className="form-group" style={{ marginBottom: '3rem' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                                    Favorite Genres
                                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{formData.favoriteGenres.length}/3 Selected</span>
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {GENRES.map(genre => (
                                        <button 
                                            type="button"
                                            key={genre}
                                            onClick={() => toggleGenre(genre)}
                                            style={{ 
                                                background: formData.favoriteGenres.includes(genre) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                                                color: formData.favoriteGenres.includes(genre) ? 'black' : 'var(--text-secondary)',
                                                border: formData.favoriteGenres.includes(genre) ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '25px',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontWeight: formData.favoriteGenres.includes(genre) ? 600 : 400
                                            }}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="btn-primary" 
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem', 
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600'
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Finish Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
