import React from 'react';
import { Link } from 'react-router-dom';
import { imgBaseUrl } from '../services/tmdb';

export default function ActorCard({ actor }) {
    const profileUrl = actor.profile_path 
        ? `${imgBaseUrl}${actor.profile_path}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name || actor.original_name || 'Actor')}&background=333333&color=ffffff&size=150`;

    return (
        <Link to={`/actor-details?id=${actor.id}`} className="cast-member" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={profileUrl} alt={actor.name || actor.original_name} className="cast-photo" />
            <div className="cast-info">
                <p className="cast-name-text" title={actor.name || actor.original_name}>{actor.name || actor.original_name}</p>
                {actor.character && (
                    <p className="cast-character-text" title={actor.character}>{actor.character}</p>
                )}
            </div>
        </Link>
    );
}
