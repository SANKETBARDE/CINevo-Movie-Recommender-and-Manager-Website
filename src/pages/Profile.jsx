import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"];

export default function Profile() {
    const { user, userProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: userProfile?.username || user?.displayName || '',
        bio: userProfile?.bio || '',
        favoriteGenres: userProfile?.favoriteGenres || []
    });
    const [isSaving, setIsSaving] = useState(false);

    // Update form data when userProfile changes (real-time sync)
    useEffect(() => {
        if (userProfile && !isEditing) {
            setFormData({
                username: userProfile.username || user?.displayName || '',
                bio: userProfile.bio || '',
                favoriteGenres: userProfile.favoriteGenres || []
            });
        }
    }, [userProfile, isEditing, user?.displayName]);

    const toggleGenre = (genre) => {
        setFormData(prev => {
            const genres = prev.favoriteGenres;
            if (genres.includes(genre)) {
                return { ...prev, favoriteGenres: genres.filter(g => g !== genre) };
            } else {
                if (genres.length >= 3) return prev;
                return { ...prev, favoriteGenres: [...genres, genre] };
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            console.log("Current user:", user);
            console.log("User UID:", user?.uid);
            console.log("User email:", user?.email);
            
            // Try to find the correct document ID first
            let userDocId = user?.uid;
            
            // First try to find by email to ensure we use the correct document
            try {
                const q = query(collection(db, 'users'), where('email', '==', user?.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    userDocId = userDoc.id;
                    console.log("Found user document by email, using ID:", userDocId);
                } else {
                    console.log("No document found by email, using UID:", userDocId);
                }
            } catch (error) {
                console.error("Error finding user by email:", error);
                console.log("Falling back to UID:", userDocId);
            }
            
            if (!userDocId) {
                console.error("No user document ID available");
                alert("User not authenticated properly. Please log in again.");
                return;
            }
            
            const userRef = doc(db, 'users', userDocId);
            console.log("Attempting to save to document:", userRef.path);
            
            const saveData = {
                username: formData.username,
                bio: formData.bio,
                favoriteGenres: formData.favoriteGenres,
                displayName: user?.displayName || formData.username,
                photoURL: user?.photoURL,
                email: user?.email,
                uid: user?.uid,
                updatedAt: new Date().toISOString(),
                isProfileComplete: true
            };
            
            console.log("Data to save:", saveData);
            
            await setDoc(userRef, saveData, { merge: true });
            
            console.log("Profile saved successfully to Firestore");
            console.log("Document updated at:", new Date().toISOString());
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Full error:", error);
            alert(`Failed to save profile: ${error.message}. Please try again.`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? Your data will be permanently deleted after 30 days. Logging back in before then will cancel the deletion."
        );
        if (!confirmDelete) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            const scheduledDate = Date.now() + (30 * 24 * 60 * 60 * 1000);
            
            await setDoc(userRef, {
                scheduledDeletionDate: scheduledDate
            }, { merge: true });
            
            await logout();
        } catch (error) {
            console.error("Error scheduling account deletion", error);
            alert("Failed to schedule account deletion. Please try again.");
        }
    };

    return (
        <div className="page-wrapper animate-fade-in-up profile-page-wrapper" style={{ marginTop: '80px', flexGrow: 1 }}>
            {/* Hero Section */}
            <div className="profile-hero-section">
                <div className="profile-hero-background"></div>
                <div className="container">
                    <div className="profile-hero-content">
                        <div className="profile-hero-main">
                            <div className="profile-avatar-container">
                                <img 
                                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.username || user?.displayName || 'Cinephile')}&background=random`} 
                                    alt="Profile" 
                                    className="profile-avatar"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.username || user?.displayName || 'Cinephile')}&background=random`;
                                    }}
                                />
                                <div className="profile-avatar-glow"></div>
                            </div>
                            <div className="profile-hero-info">
                                <h1 className="profile-hero-name">{userProfile?.username || user?.displayName || 'Cinephile'}</h1>
                                <p className="profile-hero-email">{user?.email}</p>
                                <div className="profile-hero-meta">
                                    <span className="profile-hero-status">
                                        {userProfile?.isProfileComplete ? (
                                            <span className="profile-status-complete">
                                                <i className="bi bi-check-circle"></i> Profile Complete
                                            </span>
                                        ) : (
                                            <span className="profile-status-incomplete">
                                                <i className="bi bi-exclamation-circle"></i> Complete your profile
                                            </span>
                                        )}
                                    </span>
                                    <span className="profile-hero-date">
                                        Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                                <div className="profile-hero-bio-preview">
                                    {userProfile?.bio || 'No bio yet'}
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                                <i className="bi bi-pencil"></i>
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container">
                <div className="profile-content-grid">
                    {/* Stats Section */}
                    <div className="profile-stats-section">
                        <div className="profile-stat-card">
                            <div className="profile-stat-icon">
                                <i className="bi bi-film"></i>
                            </div>
                            <div className="profile-stat-content">
                                <div className="profile-stat-value">{userProfile?.moviesWatched?.length || 0}</div>
                                <div className="profile-stat-label">Movies Watched</div>
                            </div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="profile-stat-icon">
                                <i className="bi bi-heart"></i>
                            </div>
                            <div className="profile-stat-content">
                                <div className="profile-stat-value">{userProfile?.favorites?.length || 0}</div>
                                <div className="profile-stat-label">Favorites</div>
                            </div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="profile-stat-icon">
                                <i className="bi bi-bookmark"></i>
                            </div>
                            <div className="profile-stat-content">
                                <div className="profile-stat-value">{userProfile?.wishlist?.length || 0}</div>
                                <div className="profile-stat-label">Watchlist</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="profile-main-content">
                        {isEditing ? (
                            <div className="profile-edit-card glass-card">
                                <div className="profile-card-header">
                                    <h2>Edit Profile</h2>
                                    <button onClick={() => setIsEditing(false)} className="profile-close-btn">
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <form onSubmit={handleSave}>
                                    <div className="profile-form-group">
                                        <label>Display Name</label>
                                        <input 
                                            type="text" 
                                            className="profile-form-input"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="profile-form-group">
                                        <label>About Me</label>
                                        <textarea 
                                            className="profile-form-textarea"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="profile-form-group">
                                        <div className="profile-genre-header">
                                            <label>Favorite Genres</label>
                                            <span className="profile-genre-count">{formData.favoriteGenres.length}/3 Selected</span>
                                        </div>
                                        <div className="profile-genre-grid">
                                            {GENRES.map(genre => (
                                                <button 
                                                    type="button"
                                                    key={genre}
                                                    onClick={() => toggleGenre(genre)}
                                                    className={`profile-genre-chip ${formData.favoriteGenres.includes(genre) ? 'active' : ''}`}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="profile-form-actions">
                                        <button type="button" onClick={() => setIsEditing(false)} className="profile-btn profile-btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isSaving} className="profile-btn profile-btn-primary">
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="profile-view-content">
                                <div className="profile-section glass-card">
                                    <div className="profile-section-header">
                                        <h2>About Me</h2>
                                    </div>
                                    <div className="profile-section-body">
                                        <p className="profile-bio-text">
                                            {userProfile?.bio || 'This user hasn\'t added a bio yet.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="profile-section glass-card">
                                    <div className="profile-section-header">
                                        <h2>Favorite Genres</h2>
                                    </div>
                                    <div className="profile-section-body">
                                        <div className="profile-genre-display">
                                            {userProfile?.favoriteGenres?.length > 0 ? (
                                                userProfile.favoriteGenres.map(genre => (
                                                    <span key={genre} className="profile-genre-tag">
                                                        {genre}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="profile-empty-state">No favorite genres selected.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {userProfile?.wishlist && userProfile.wishlist.length > 0 && (
                                    <div className="profile-section glass-card">
                                        <div className="profile-section-header">
                                            <h2>Watchlist</h2>
                                            <span className="profile-section-count">{userProfile.wishlist.length} movies</span>
                                        </div>
                                        <div className="profile-section-body">
                                            <div className="profile-wishlist-preview">
                                                <p className="profile-wishlist-info">
                                                    <i className="bi bi-bookmark"></i> You have {userProfile.wishlist.length} movies in your watchlist
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="profile-actions glass-card">
                                    <button onClick={logout} className="profile-action-btn profile-action-secondary">
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Sign Out</span>
                                    </button>
                                    <button onClick={handleDeleteAccount} className="profile-action-btn profile-action-danger">
                                        <i className="bi bi-trash3"></i>
                                        <span>Delete Account</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
