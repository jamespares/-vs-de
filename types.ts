export type Preposition = 'à' | 'de';

export interface FlashcardData {
  id: string;
  verb: string;
  sentenceFrench: string;
  correctPreposition: Preposition;
  translationEnglish: string;
  explanation: string;
}

export interface GameState {
  score: number;
  streak: number;
  highScore: number;
}
