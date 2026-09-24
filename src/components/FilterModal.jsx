import React, { useState, useEffect } from 'react';
import { fetchGenres, fetchLanguages } from '../services/tmdb';

export default function FilterModal({ currentFilters, onApplyFilters }) {
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(currentFilters.genres || []);
    const [selectedLanguage, setSelectedLanguage] = useState(currentFilters.language || '');
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [fetchedGenres, fetchedLanguages] = await Promise.all([
                fetchGenres(),
                fetchLanguages()
            ]);
            setGenres(fetchedGenres);
            setLanguages(fetchedLanguages);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!isLangDropdownOpen) return;

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                const index = languages.findIndex(l => l.english_name.toLowerCase().startsWith(key));
                if (index !== -1) {
                    const lang = languages[index];
                    const el = document.getElementById(`lang-option-${lang.iso_639_1}`);
                    if (el) {
                        el.scrollIntoView({ block: 'nearest' });
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLangDropdownOpen, languages]);

    const handleGenreChange = (genreId) => {
        setSelectedGenres(prev => 
            prev.includes(genreId) 
                ? prev.filter(id => id !== genreId) 
                : [...prev, genreId]
        );
    };

    const handleClear = () => {
        setSelectedGenres([]);
        setSelectedLanguage('');
        onApplyFilters({ genres: [], language: '' });
        const modalEl = document.getElementById('filterModal');
        if (window.bootstrap && modalEl) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    };

    const handleApply = () => {
        onApplyFilters({ genres: selectedGenres, language: selectedLanguage });
        const modalEl = document.getElementById('filterModal');
        if (window.bootstrap && modalEl) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    };

    return (
        <div className="modal fade" id="filterModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content glass-panel" style={{ 
                    backgroundColor: 'rgba(15, 15, 15, 0.85)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 197, 24, 0.05)',
                    borderRadius: '24px'
                }}>
                    <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2rem' }}>
                        <h5 className="modal-title" style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: '800', 
                            background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0
                        }}>
                            <i className="bi bi-funnel-fill" style={{ marginRight: '0.5rem', color: '#9333ea', WebkitTextFillColor: 'initial' }}></i> 
                            Refine Your Search
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ 
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%239333ea'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e")`,
                            opacity: '1'
                        }}></button>
                    </div>
                    
                    <div className="modal-body custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '2rem' }}>
                        
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h6 style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.9rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1.5px', 
                                marginBottom: '1rem',
                                fontWeight: '600'
                            }}>
                                Genres
                            </h6>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {genres.map(genre => (
                                    <button 
                                        type="button"
                                        key={genre.id}
                                        onClick={() => handleGenreChange(genre.id)}
                                        style={{ 
                                            background: selectedGenres.includes(genre.id) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)',
                                            color: selectedGenres.includes(genre.id) ? 'black' : 'var(--text-secondary)',
                                            border: selectedGenres.includes(genre.id) ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '30px',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            fontWeight: selectedGenres.includes(genre.id) ? 700 : 500,
                                            transform: selectedGenres.includes(genre.id) ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                        onMouseEnter={(e) => { if (!selectedGenres.includes(genre.id)) e.target.style.background = 'rgba(255,255,255,0.1)' }}
                                        onMouseLeave={(e) => { if (!selectedGenres.includes(genre.id)) e.target.style.background = 'rgba(255,255,255,0.03)' }}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h6 style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.9rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1.5px', 
                                marginBottom: '1rem',
                                fontWeight: '600'
                            }}>
                                Language
                            </h6>
                            <div style={{ position: 'relative' }}>
                                <div 
                                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'}
                                >
                                    {selectedLanguage ? languages.find(l => l.iso_639_1 === selectedLanguage)?.english_name : 'Any Language'}
                                    <i className={`bi bi-chevron-${isLangDropdownOpen ? 'up' : 'down'}`} style={{ color: 'var(--accent-gold)' }}></i>
                                </div>
                                
                                {isLangDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '0.5rem',
                                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        maxHeight: '220px',
                                        overflowY: 'auto',
                                        zIndex: 10,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                                        backdropFilter: 'blur(10px)'
                                    }} className="custom-scrollbar">
                                        <div 
                                            onClick={() => { setSelectedLanguage(''); setIsLangDropdownOpen(false); }}
                                            style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: selectedLanguage === '' ? 'var(--accent-gold)' : 'white' }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            Any Language
                                        </div>
                                        {languages.map(lang => (
                                            <div 
                                                key={lang.iso_639_1}
                                                id={`lang-option-${lang.iso_639_1}`}
                                                onClick={() => { setSelectedLanguage(lang.iso_639_1); setIsLangDropdownOpen(false); }}
                                                style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: selectedLanguage === lang.iso_639_1 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                {lang.english_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    
                    <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2rem', gap: '1rem' }}>
                        <button type="button" className="btn-secondary" onClick={handleClear} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem 2rem' }}>
                            Clear
                        </button>
                        <button type="button" className="btn-primary" onClick={handleApply} style={{ padding: '0.8rem 2.5rem', borderRadius: '30px', fontWeight: '700' }}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
