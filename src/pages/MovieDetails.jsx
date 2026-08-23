import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovieDetails, fetchWatchProviders, fetchMovieCredits, fetchMovieVideos, imgBaseUrl } from '../services/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import { useWishlist } from '../hooks/useWishlist';

export default function MovieDetails() {
    const [searchParams] = useSearchParams();
    const movieId = searchParams.get('id');
    const [data, setData] = useState({
        movie: null,
        providers: [],
        cast: [],
        videos: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const loadDetails = async () => {
            if (!movieId) {
                setError('No movie ID provided.');
                setIsLoading(false);
                return;
            }

            try {
                const [movie, providers, cast, videos] = await Promise.all([
                    fetchMovieDetails(movieId),
                    fetchWatchProviders(movieId),
                    fetchMovieCredits(movieId),
                    fetchMovieVideos(movieId)
                ]);

                if (!movie) {
                    setError('Could not find details for this movie.');
                } else {
                    setData({ movie, providers, cast, videos });
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading movie details.');
            } finally {
                setIsLoading(false);
            }
        };
        loadDetails();
    }, [movieId]);

    if (isLoading) return <div className="page-wrapper flex justify-center items-center"><LoadingSpinner /></div>;
    if (error) return <div className="page-wrapper flex justify-center items-center text-secondary">{error}</div>;

    const { movie, providers, cast, videos } = data;
    const title = movie.title || 'Title not available';
    const tagline = movie.tagline || '';
    const overview = movie.overview || 'No overview available.';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const backdropUrl = movie.backdrop_path ? `${imgBaseUrl}${movie.backdrop_path}` : '';
    const posterUrl = movie.poster_path ? `${imgBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image';

    return (
        <div className="movie-details-wrapper animate-fade-in-up">
            {backdropUrl && <img src={backdropUrl} className="movie-backdrop" alt="" />}
            
            <div className="container movie-details-content">
                <div>
                    <img src={posterUrl} className="movie-poster-large" alt={title} />
                </div>
                
                <div>
                    <h1 className="movie-title-large">{title}</h1>
                    <p className="movie-tagline-text">{tagline}</p>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="rating-badge-large mb-0" style={{ marginBottom: 0 }}>
                            <i className="bi bi-star-fill"></i> {rating}
                        </div>
                        <button 
                            className={`btn-secondary flex items-center gap-2`}
                            onClick={() => toggleWishlist(movie.id)}
                            style={{ 
                                borderColor: isInWishlist(movie.id) ? 'var(--accent-gold)' : '', 
                                color: isInWishlist(movie.id) ? 'var(--accent-gold)' : '' 
                            }}
                        >
                            <i className={`bi ${isInWishlist(movie.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                            {isInWishlist(movie.id) ? 'Wishlisted' : 'Add to Wishlist'}
                        </button>
                    </div>
                    
                    <h4 className="info-section-title">Overview</h4>
                    <p className="mb-4 text-secondary">{overview}</p>
                    
                    <h5 className="info-section-title">Genres</h5>
                    <div className="genres-pills">
                        {movie.genres?.map(g => (
                            <span key={g.id} className="genre-pill">{g.name}</span>
                        ))}
                    </div>
                    
                    <h4 className="info-section-title">Where to Watch</h4>
                    <div className="providers-container">
                        {providers.length > 0 ? (
                            providers.map(p => (
                                <img key={p.provider_name} src={p.logo_path} className="provider-logo" alt={p.provider_name} title={p.provider_name} />
                            ))
                        ) : (
                            <p className="text-secondary">Not available on streaming services in India.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '3rem' }}>
                <h4 className="info-section-title">Cast</h4>
                <div className="cast-grid">
                    {cast.slice(0, 12).map((c, index) => (
                        <div key={index} className="cast-member">
                            <img src={c.profile_path ? `${imgBaseUrl}${c.profile_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=333333&color=ffffff&size=150`} alt={c.name} className="cast-photo" />
                            <div className="cast-info">
                                <p className="cast-name-text" title={c.name}>{c.name}</p>
                                <p className="cast-character-text" title={c.character}>{c.character}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h4 className="info-section-title">Related Videos</h4>
                <div className="videos-grid">
                    {videos.length > 0 ? (
                        videos.slice(0, 10).map(video => (
                            <div key={video.key} className="video-wrapper">
                                <iframe src={`https://www.youtube.com/embed/${video.key}`} 
                                        title={video.name} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen>
                                </iframe>
                            </div>
                        ))
                    ) : (
                        <p className="text-secondary">No official trailers or teasers available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
