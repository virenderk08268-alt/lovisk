
export const LANGUAGES: { [key: string]: { name: string; native: string; flag: string } } = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  bn: { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ur: { name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
};

export const VOICES = [
  { id: 'Kore', name: 'Cheerful', color: 'bg-yellow-400' },
  { id: 'Puck', name: 'Playful', color: 'bg-green-400' },
  { id: 'Zephyr', name: 'Soft', color: 'bg-blue-400' },
  { id: 'Charon', name: 'Gentle', color: 'bg-purple-400' },
  { id: 'Fenrir', name: 'Deep', color: 'bg-orange-400' },
];

export const getSystemInstruction = (langName: string) => `You are "Gemi-Pal", a friendly, patient, and educational AI companion for children aged 5-10. 
IMPORTANT: The child's preferred language is ${langName}. Please speak and understand ${langName} fluently.
Your goal is to be a helpful friend who encourages curiosity, explains things in simple terms, and tells wonderful stories.
- Use simple, encouraging language suitable for a child.
- Keep answers concise but fun.
- Use emojis frequently in text output 🌟🌈🚀.
- If a child asks something inappropriate or scary, gently steer the conversation back to something positive.
- You have built-in voice activity detection. Wait for the child to finish their thought before responding.
- When telling stories, involve the child by asking questions.`;

export const SUGGESTED_PROMPTS = [
  "Tell me a story! 🐹🚀",
  "Why is the sky blue? 🌤️",
  "Teach me a fun animal fact! 🦒",
  "How do planes fly? ✈️",
  "Let's play a guessing game! 🕵️‍♀️"
];

export const ART_PROMPTS = [
  "A friendly dragon eating ice cream 🍦🐉",
  "A house made of candy and chocolate 🍫🏠",
  "A cat flying a rocket ship 🐱🚀",
  "An underwater party with fish 🐠🎉"
];
