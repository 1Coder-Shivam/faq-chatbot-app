/**
 * Predefined questions about Bhagavad Gita
 */
export const predefinedQuestions = [
  {
    "question": "What is the Bhagavad Gita?"
  },
  {
    "question": "Who narrated the Bhagavad Gita?"
  },
  {
    "question": "What is the core message of the Bhagavad Gita?"
  },
  {
    "question": "Why did Arjuna refuse to fight in the war?"
  },
  {
    "question": "What is karma according to the Bhagavad Gita?"
  },
  {
    "question": "What is the significance of Krishna in the Gita?"
  },
  {
    "question": "What does the Gita say about life and death?"
  },
  {
    "question": "What is dharma in the context of the Gita?"
  },
  {
    "question": "How many chapters are there in the Bhagavad Gita?"
  },
  {
    "question": "What is the meaning of yoga in the Bhagavad Gita?"
  }
];

/**
 * Important keywords from predefined questions for matching
 * Maps keywords to question indices in the predefinedQuestions array
 */
export const keywordMap = {
  'gita': [0, 1, 2, 4, 5, 6, 7, 8, 9],
  'bhagavad': [0, 1, 2, 4, 9],
  'krishna': [5],
  'arjuna': [3],
  'karma': [4],
  'dharma': [7],
  'message': [2],
  'core': [2],
  'narrated': [1],
  'fight': [3],
  'war': [3],
  'life': [6],
  'death': [6],
  'chapters': [8],
  'yoga': [9],
  'significance': [5],
  'meaning': [9]
}; 