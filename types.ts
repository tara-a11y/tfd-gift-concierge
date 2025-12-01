export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  tags: string[];
}

export interface Recommendation extends Product {
  matchScore: number;
  reasoning: string;
}

export interface UserPreferences {
  recipient: string;
  gender: string;
  occasion: string;
  budget: string;
  style: string;
  notes?: string;
}

export enum AppState {
  LANDING,
  QUIZ,
  LOADING,
  RESULTS,
  ERROR
}

export interface Question {
  id: keyof UserPreferences;
  label: string;
  options: string[];
  placeholder?: string;
}
