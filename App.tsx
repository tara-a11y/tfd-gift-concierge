import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import LoadingScreen from './components/LoadingScreen';
import Results from './components/Results';
import { AppState, UserPreferences, Recommendation } from './types';
import { getGiftRecommendations } from './services/geminiService';

const STORAGE_KEY = 'tfd_gift_finder_state';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.recommendations && parsed.recommendations.length > 0) {
          setRecommendations(parsed.recommendations);
          setAppState(AppState.RESULTS);
        }
      } catch (e) {
        console.error("Failed to load saved state", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ recommendations }));
    }
  }, [recommendations]);

  const handleStart = () => {
    setAppState(AppState.QUIZ);
  };

  const handleQuizComplete = async (prefs: UserPreferences) => {
    setAppState(AppState.LOADING);
    try {
      const results = await getGiftRecommendations(prefs);
      setRecommendations(results);
      setAppState(AppState.RESULTS);
    } catch (e) {
      console.error(e);
      setAppState(AppState.RESULTS);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppState(AppState.LANDING);
    setRecommendations([]);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleReset();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-stone-50">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" onClick={handleLogoClick} className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-stone-900">Tara Fust Design</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-16">
        {appState === AppState.LANDING && (
          <Hero onStart={handleStart} />
        )}
        
        {appState === AppState.QUIZ && (
          <div className="min-h-[60vh] flex items-center">
            <Quiz onComplete={handleQuizComplete} />
          </div>
        )}

        {appState === AppState.LOADING && (
          <LoadingScreen />
        )}

        {appState === AppState.RESULTS && (
          <Results recommendations={recommendations} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-stone-500">
              &copy; 2024 Tara Fust Design. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
