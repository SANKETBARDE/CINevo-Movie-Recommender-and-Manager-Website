import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchSearchResults } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import ActorCard from '../components/ActorCard';
import { useWishlist } from '../hooks/useWishlist';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Search() {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isInWishlist, toggleWishlist } = useWishlist();

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            fetchSearchResults(query).then(data => {
                setResults(data);
                setIsLoading(false);
            });
        }
    }, [query]);

    const moviesList = results.filter(r => r.media_type === 'movie');
    const actorsList = results.filter(r => r.media_type === 'person');

    return (
        <div className="container page-wrapper">
            <div className="section-header justify-center mb-8" style={{ marginTop: '2rem' }}>
                <h2 className="section-title text-center text-gradient-gold">
                    Search Results for: {query}
                </h2>
            </div>
            
            <div className="animate-fade-in-up">
                {isLoading ? (
                    <LoadingSpinner />
                ) : results.length > 0 ? (
                    <>
                        {actorsList.length > 0 && (
                            <section className="movie-grid-section mb-5">
                                <h4 className="info-section-title">Actors</h4>
                                <div className="cast-grid">
                                    {actorsList.map(actor => (
                                        <ActorCard key={`actor-${actor.id}`} actor={actor} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {moviesList.length > 0 && (
                            <section className="movie-grid-section">
                                <h4 className="info-section-title">Movies</h4>
                                <div className="movie-grid">
                                    {moviesList.map(movie => (
                                        <MovieCard 
                                            key={`movie-${movie.id}`} 
                                            movie={movie} 
                                            isWishlisted={isInWishlist(movie.id)}
                                            onToggleWishlist={toggleWishlist}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="text-center text-secondary w-full">No results found matching your query.</div>
                )}
            </div>
        </div>
    );
}
