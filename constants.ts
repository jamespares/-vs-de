import { FlashcardData } from './types';

export const FALLBACK_CARDS: FlashcardData[] = [
  {
    id: 'fallback-1',
    verb: 'Essayer',
    sentenceFrench: "J'essaie ___ comprendre la situation.",
    correctPreposition: 'de',
    translationEnglish: "I am trying to understand the situation.",
    explanation: "'Essayer de' is the standard construction when followed by an infinitive."
  },
  {
    id: 'fallback-2',
    verb: 'Aider',
    sentenceFrench: "Elle aide son frère ___ faire ses devoirs.",
    correctPreposition: 'à',
    translationEnglish: "She helps her brother do his homework.",
    explanation: "'Aider qqn à faire qqch' (To help someone do something) always uses 'à'."
  },
  {
    id: 'fallback-3',
    verb: 'Décider',
    sentenceFrench: "Il a décidé ___ partir tôt.",
    correctPreposition: 'de',
    translationEnglish: "He decided to leave early.",
    explanation: "'Décider de' is used when making a decision to do something."
  },
  {
    id: 'fallback-4',
    verb: 'Réussir',
    sentenceFrench: "Tu as réussi ___ finir le projet.",
    correctPreposition: 'à',
    translationEnglish: "You succeeded in finishing the project.",
    explanation: "'Réussir à' means to succeed in doing something."
  },
  {
    id: 'fallback-5',
    verb: 'Refuser',
    sentenceFrench: "Ils refusent ___ manger des légumes.",
    correctPreposition: 'de',
    translationEnglish: "They refuse to eat vegetables.",
    explanation: "'Refuser de' is used to express refusal to perform an action."
  }
];
