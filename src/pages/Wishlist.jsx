import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovieDetails } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Wishlist() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { wishlist, isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const loadWishlistMovies = async () => {
            if (wishlist.length === 0) {
                setMovies([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const fetchPromises = wishlist.map(id => fetchMovieDetails(id));
            const results = await Promise.all(fetchPromises);
            // Filter out nulls in case some fetches fail
            setMovies(results.filter(m => m !== null));
            setIsLoading(false);
        };
        loadWishlistMovies();
    }, [wishlist.join(',')]); // Use join to prevent unnecessary re-fetches if the array reference changes but the content is the same

    return (
        <section className="container page-wrapper movie-grid-section">
            <div className="section-header">
                <h2 className="section-title">My Wishlist</h2>
            </div>
            
            <div className="movie-grid animate-fade-in-up">
                {isLoading ? (
                    <LoadingSpinner />
                ) : movies.length > 0 ? (
                    movies.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            isWishlisted={isInWishlist(movie.id)}
                            onToggleWishlist={toggleWishlist}
                        />
                    ))
                ) : (
                    <div className="empty-wishlist-container" style={{ 
                        gridColumn: '1 / -1', 
                        minHeight: '65vh', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '2rem 1rem'
                    }}>
                        <div className="empty-gif-wrapper" style={{
                            position: 'relative',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 50px rgba(147, 51, 234, 0.05)',
                            marginBottom: '3rem',
                            transform: 'rotate(-2deg)',
                        }}>
                            <img 
                                src="https://media1.tenor.com/m/X2t_A2MdSW0AAAAC/tork-peter.gif" 
                                alt="Empty Wishlist" 
                                style={{ width: '280px', borderRadius: '10px', display: 'block', filter: 'contrast(1.1) saturate(1.2)' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '-15px',
                                right: '-15px',
                                background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
                                color: 'black',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '900',
                                fontSize: '1.8rem',
                                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)'
                            }}>?</div>
                        </div>

                        <div className="empty-state-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
                            <h2 style={{ 
                                fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
                                fontWeight: '900', 
                                margin: 0,
                                fontFamily: "'Outfit', sans-serif",
                                color: '#ffffff',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                lineHeight: '1.1',
                                textShadow: '0 4px 20px rgba(255,255,255,0.2)'
                            }}>
                                Empty Plot
                            </h2>
                            <h3 style={{ 
                                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
                                fontWeight: '400', 
                                margin: 0,
                                color: 'var(--text-secondary)',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '0.5px'
                            }}>
                                Your wishlist is looking <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontWeight: '800' }}>suspiciously</span> bare.
                            </h3>
                        </div>

                        <Link to="/" className="btn-primary" style={{ 
                            padding: '0.6rem 1.5rem', 
                            fontSize: '0.9rem',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 8px 20px rgba(147, 51, 234, 0.25)',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="bi bi-film" style={{ marginRight: '8px' }}></i> Find Your Next Twist
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
