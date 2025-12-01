import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-stone-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-stone-900 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Curating Selections</h2>
      <p className="text-stone-500 animate-pulse">Consulting our design database...</p>
    </div>
  );
};

export default LoadingScreen;
