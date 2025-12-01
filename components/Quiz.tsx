import React, { useState } from 'react';
import { UserPreferences, Question } from '../types';

interface QuizProps {
  onComplete: (prefs: UserPreferences) => void;
}

const QUESTIONS: Question[] = [
  {
    id: 'recipient',
    label: "Who is this lucky person?",
    options: ['Partner', 'Parent', 'Friend', 'Colleague', 'Sibling', 'Myself']
  },
  {
    id: 'gender',
    label: "Are you shopping for...",
    options: ['Her', 'Him', 'Anyone']
  },
  {
    id: 'occasion',
    label: "What is the occasion?",
    options: ['Birthday', 'Anniversary', 'Housewarming', 'Holiday', 'Thank You', 'Just Because']
  },
  {
    id: 'style',
    label: "How would you describe their style?",
    options: ['Minimalist & Modern', 'Cozy & Rustic', 'Classic & Elegant', 'Tech-Savvy', 'Eclectic & Artistic', 'I am not sure']
  },
  {
    id: 'budget',
    label: "What is your budget?",
    options: ['Under $50', '$50 - $100', '$100 - $250', '$250+', 'Price is no object']
  }
];

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({});

  const handleSelect = (value: string) => {
    const currentQ = QUESTIONS[step];
    const newPrefs = { ...prefs, [currentQ.id]: value };
    setPrefs(newPrefs);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 250);
    } else {
      onComplete(newPrefs as UserPreferences);
    }
  };

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12">
      <div className="w-full bg-stone-200 rounded-full h-1.5 mb-12">
        <div 
          className="bg-stone-900 h-1.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="fade-in" key={step}>
        <h2 className="text-3xl font-serif font-medium text-stone-900 mb-8 text-center">
          {currentQuestion.label}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="group relative flex items-center justify-center p-6 text-sm font-medium border border-stone-200 rounded-lg hover:border-stone-900 hover:bg-stone-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
            >
              <span className="text-stone-700 group-hover:text-stone-900">{option}</span>
            </button>
          ))}
        </div>
        
        {step > 0 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="mt-8 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors w-full text-center"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
