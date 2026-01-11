
export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  ART = 'ART',
  VOICE = 'VOICE'
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  imageUrl?: string;
}

export interface GemiPalConfig {
  name: string;
  age: number;
  language: string;
}
