const apiKey = 'e7db14cb2c6c3e0f0c6c58c3990427fc';
export const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

export async function apiRequest(endpoint, errorMessage) {
    const url = `${tmdbBaseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(errorMessage);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchMovieDetails(movieId) {
    return await apiRequest(`/movie/${movieId}`, `Movie details fetch failed for ID ${movieId}`);
}

export async function fetchRecommendations(movieId) {
    const data = await apiRequest(`/movie/${movieId}/recommendations`, 'Failed to fetch recommendations');
    return data ? data.results : [];
}

export async function fetchTopRatedMovies() {
    const data = await apiRequest('/movie/top_rated?page=1', 'Failed to fetch top rated movies');
    return data ? data.results : [];
}

export async function fetchSearchResults(query) {
    const data = await apiRequest(`/search/multi?query=${encodeURIComponent(query)}`, 'Failed to fetch search results');
    // Filter out TV shows and other media types we aren't supporting right now
    return data ? data.results.filter(item => item.media_type === 'movie' || item.media_type === 'person') : [];
}

export async function fetchPopularMovies(page = 1) {
    const data = await apiRequest(`/movie/popular?page=${page}`, 'Failed to fetch popular movies');
    return data ? data.results : [];
}

export async function fetchWatchProviders(movieId) {
    const data = await apiRequest(`/movie/${movieId}/watch/providers`, 'Could not fetch watch providers');
    if (!data) return [];
    const providers = data.results.IN?.flatrate || [];
    return providers.map(p => ({
        provider_name: p.provider_name,
        logo_path: `${imgBaseUrl}${p.logo_path}`
    }));
}

export async function fetchMovieCredits(movieId) {
    const data = await apiRequest(`/movie/${movieId}/credits`, 'Could not fetch movie credits');
    if (!data) return [];
    return data.cast.map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
    }));
}

export async function fetchActorDetails(actorId) {
    return await apiRequest(`/person/${actorId}`, `Could not fetch details for actor ${actorId}`);
}

export async function fetchActorMovies(actorId) {
    const data = await apiRequest(`/person/${actorId}/movie_credits`, `Could not fetch movies for actor ${actorId}`);
    // Return cast roles, sorted by popularity descending
    return data && data.cast ? data.cast.sort((a, b) => b.popularity - a.popularity) : [];
}

export async function fetchMovieVideos(movieId) {
    const data = await apiRequest(`/movie/${movieId}/videos`, 'Failed to fetch videos');
    if (!data) return [];
    return data.results.filter(video =>
        video.site === 'YouTube' &&
        (video.type === 'Trailer' || video.type === 'Teaser')
    );
}

export async function fetchGenres() {
    const data = await apiRequest('/genre/movie/list', 'Failed to fetch genres');
    return data ? data.genres : [];
}

export async function fetchLanguages() {
    const languages = await apiRequest('/configuration/languages', 'Failed to fetch languages');
    if (!languages) return [];
    return languages.sort((a, b) => a.english_name.localeCompare(b.english_name));
}
