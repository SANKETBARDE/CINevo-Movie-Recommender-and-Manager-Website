import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchActorDetails, fetchActorMovies, imgBaseUrl } from '../services/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';

export default function ActorDetails() {
    const [searchParams] = useSearchParams();
    const actorId = searchParams.get('id');
    const navigate = useNavigate();
    
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(20);
    const [sort, setSort] = useState('popularity-desc');
    
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const loadActorData = async () => {
            if (!actorId) {
                setError('No actor ID provided.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const [detailsData, moviesData] = await Promise.all([
                    fetchActorDetails(actorId),
                    fetchActorMovies(actorId)
                ]);

                if (!detailsData) {
                    setError('Could not find details for this actor.');
                } else {
                    setActor(detailsData);
                    setMovies(moviesData);
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading actor details.');
            } finally {
                setIsLoading(false);
            }
        };
        loadActorData();
    }, [actorId]);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setVisibleCount(prev => prev + 20);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) return <div className="page-wrapper flex justify-center items-center"><LoadingSpinner /></div>;
    if (error) return <div className="page-wrapper flex justify-center items-center text-secondary">{error}</div>;
    if (!actor) return null;

    const profileUrl = actor.profile_path 
        ? `${imgBaseUrl}${actor.profile_path}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=333333&color=ffffff&size=500`;

    // Sort movies before slicing
    let sortedMovies = [...movies.filter(m => m.poster_path)];
    switch (sort) {
        case 'rating-desc':
            sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
            break;
        case 'date-desc':
            sortedMovies.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
            break;
        case 'date-asc':
            sortedMovies.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
            break;
        case 'popularity-desc':
        default:
            sortedMovies.sort((a, b) => b.popularity - a.popularity);
            break;
    }

    const displayedMovies = sortedMovies.slice(0, visibleCount);

    return (
        <div className="page-wrapper animate-fade-in-up">
            <div className="container" style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                
                <div className="actor-details-content" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
                    <div style={{ flex: '0 0 300px' }}>
                        <img src={profileUrl} alt={actor.name} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                    </div>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h1 className="movie-title-large" style={{ marginBottom: '0.5rem' }}>{actor.name}</h1>
                        <p className="text-secondary mb-4">
                            {actor.known_for_department} • {actor.birthday ? new Date(actor.birthday).toLocaleDateString() : 'Unknown Birthday'}
                            {actor.place_of_birth && ` • ${actor.place_of_birth}`}
                        </p>
                        
                        <h4 className="info-section-title">Biography</h4>
                        <div className="text-secondary" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {actor.biography || "We don't have a biography for this actor yet."}
                        </div>
                    </div>
                </div>

                {displayedMovies.length > 0 && (
                    <section className="movie-grid-section">
                        <div className="section-header">
                            <h2 className="section-title">Known For</h2>
                            <div className="header-actions">
                                <div className="dropdown">
                                    <button className="btn-secondary dropdown-toggle" type="button" id="sortActorMenu"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        Sort By
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="sortActorMenu">
                                        <li><button className="dropdown-item" onClick={() => setSort('popularity-desc')}>Most Popular</button></li>
                                        <li><button className="dropdown-item" onClick={() => setSort('rating-desc')}>Highest Rated</button></li>
                                        <li><button className="dropdown-item" onClick={() => setSort('date-desc')}>Newest First</button></li>
                                        <li><button className="dropdown-item" onClick={() => setSort('date-asc')}>Oldest First</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="movie-grid">
                            {displayedMovies.map((movie, index) => (
                                <MovieCard 
                                    key={`${movie.id}-${index}`} 
                                    movie={movie} 
                                    isWishlisted={isInWishlist(movie.id)}
                                    onToggleWishlist={toggleWishlist}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
