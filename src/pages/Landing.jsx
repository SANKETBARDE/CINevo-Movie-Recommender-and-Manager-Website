import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPopularMovies, imgBaseUrl } from '../services/tmdb';

const Row = ({ posters, direction }) => (
  <div className={`marquee-track marquee-${direction}`}>
    {posters.length > 0 && [...posters, ...posters].map((url, i) => (
      <img key={i} src={url} alt="Movie Poster" loading="lazy" />
    ))}
  </div>
);

const faqs = [
  { question: "What is CINevo?", answer: "CINevo is your personal cinematic universe. It helps you discover new movies, manage your watchlist, and get recommendations based on what you love." },
  { question: "Is CINevo free to use?", answer: "Yes, CINevo is completely free for all users. Just sign in with your Google account and start exploring right away." },
  { question: "How does the wishlist work?", answer: "When you find a movie you're interested in, simply click the bookmark icon to add it to your wishlist. You can access your saved movies anytime from your profile page." },
  { question: "Where do you get your movie data?", answer: "Our platform is powered by the TMDb API, ensuring you get the most up-to-date and accurate information, ratings, and posters for thousands of films." }
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`faq-glass-card mb-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
        isOpen 
          ? 'faq-glass-card-active' 
          : 'faq-glass-card-inactive'
      }`}
    >
      <button 
        className="faq-question-btn w-full py-5 px-6 flex justify-between items-center text-left focus:outline-none group bg-transparent border-none cursor-pointer" 
        onClick={onClick}
      >
        <span className={`faq-question-text text-lg md:text-xl font-semibold transition-all duration-300 ${isOpen ? 'faq-question-active' : 'faq-question-inactive'}`}>
          {question}
        </span>
        <span className={`faq-icon-container ml-6 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${isOpen ? 'faq-icon-active' : 'faq-icon-inactive'}`}>
          <svg className="w-6 h-6 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`faq-answer-container transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'faq-answer-open' : 'faq-answer-closed'}`}
      >
        <div className="faq-answer-content p-6 pt-2">
          <div className="faq-answer-inner">
            <p className="faq-answer-text text-gray-200 leading-relaxed text-base md:text-lg font-normal">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Landing() {
  const [posters, setPosters] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadPosters = async () => {
      try {
        // Fetch two pages to have a large variety of posters
        const [page1, page2] = await Promise.all([
          fetchPopularMovies(1),
          fetchPopularMovies(2)
        ]);
        const combined = [...page1, ...page2].filter(m => m.poster_path);
        const urls = combined.map(m => `${imgBaseUrl}${m.poster_path}`);
        // Shuffle them randomly
        const shuffled = urls.sort(() => 0.5 - Math.random());
        setPosters(shuffled);
      } catch (err) {
        console.error("Failed to load posters", err);
      }
    };
    loadPosters();
  }, []);

  const row1 = posters.slice(0, 12);
  const row2 = posters.slice(12, 24);
  const row3 = posters.slice(24, 36);

  return (
    <>
      <section className="landing-hero animate-fade-in-up" style={{ width: '100vw', maxWidth: '100vw' }}>
        <div className="landing-bg"></div>
        <div className="landing-overlay"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Your Personal <span className="text-gradient-gold">Cinematic Universe.</span>
          </h1>
          <p className="hero-subtitle">
            Discover, explore, and dive into movie plots like never before. Get
            AI-powered recommendations, track your wishlist, and manage your
            cinematic journey.
          </p>
          <Link to="/signin?mode=signup" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            Start Exploring
          </Link>
        </div>
      </section>

      <section className="marquee-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="marquee-header">
          <h2>A World of Stories <span className="text-gradient-gold">Awaits</span></h2>
          <p>Endless entertainment. Discover thousands of movies across every genre imaginable, from timeless classics to modern blockbusters.</p>
        </div>
        
        <div className="marquee-container">
          <Row posters={row1} direction="left" />
          <Row posters={row2} direction="right" />
          <Row posters={row3} direction="left" />
        </div>
      </section>

      <section className="faq-section animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked <span className="text-gradient-gold">Questions</span></h2>
          <p className="faq-subtitle">Everything you need to know about Cinevo and how it works.</p>
        </div>
        
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              isOpen={openFaq === index} 
              onClick={() => setOpenFaq(openFaq === index ? null : index)} 
            />
          ))}
        </div>
      </section>
    </>
  )
}
