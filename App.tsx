
import React, { useState } from 'react';
import { AppMode } from './types';
import ChatView from './components/ChatView';
import ArtView from './components/ArtView';
import LiveVoiceView from './components/LiveVoiceView';
import Character from './components/Character';
import { MessageCircle, Wand2, Mic, Heart, Languages } from 'lucide-react';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [language, setLanguage] = useState<string>('en');

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return <ChatView onBack={() => setMode(AppMode.HOME)} languageCode={language} />;
      case AppMode.ART:
        return <ArtView onBack={() => setMode(AppMode.HOME)} />;
      case AppMode.VOICE:
        return <LiveVoiceView onBack={() => setMode(AppMode.HOME)} languageCode={language} />;
      default:
        return (
          <div className="min-h-screen bg-sky-50 flex flex-col overflow-y-auto">
            <main className="flex-1 flex flex-col items-center justify-start p-6 text-center space-y-10 pt-12 pb-20">
              <div className="relative">
                <Character size="lg" isTalking={true} />
                <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 animate-bounce">
                  <span className="text-2xl">{LANGUAGES[language].native === 'English' ? '👋 Hi!' : '👋 नमस्ते!'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-extrabold text-sky-900 tracking-tight">Gemi-Pal</h1>
                <p className="text-lg text-sky-700 max-w-sm mx-auto font-medium">
                  Your magic friend for chatting, drawing, and talking!
                </p>
              </div>

              {/* Language Picker */}
              <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-md border-2 border-sky-100">
                <div className="flex items-center justify-center gap-2 mb-4 text-sky-800 font-bold">
                  <Languages className="w-6 h-6" />
                  <span className="text-xl">Choose Your Language</span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                  {Object.entries(LANGUAGES).map(([code, data]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`flex-shrink-0 px-6 py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-w-[100px] ${
                        language === code 
                          ? 'bg-sky-500 border-sky-600 text-white scale-105 shadow-lg' 
                          : 'bg-white border-sky-100 text-sky-700 hover:border-sky-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{data.flag}</div>
                      <div className="text-sm font-black whitespace-nowrap">{data.native}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <button
                  onClick={() => setMode(AppMode.CHAT)}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-4 border-sky-100"
                >
                  <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-500 transition-colors">
                    <MessageCircle className="w-8 h-8 text-sky-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-sky-900">Let's Chat!</h3>
                  <p className="text-sky-600 mt-2">Type messages and stories.</p>
                </button>

                <button
                  onClick={() => setMode(AppMode.VOICE)}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-4 border-orange-100"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
                    <Mic className="w-8 h-8 text-orange-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-orange-900">Talk Together</h3>
                  <p className="text-orange-600 mt-2">Speak and I'll talk back!</p>
                </button>

                <button
                  onClick={() => setMode(AppMode.ART)}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-4 border-purple-100"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                    <Wand2 className="w-8 h-8 text-purple-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-purple-900">Magic Art</h3>
                  <p className="text-purple-600 mt-2">Describe a picture to draw.</p>
                </button>
              </div>
            </main>

            <footer className="p-6 text-center text-sky-400 font-bold flex items-center justify-center gap-2 bg-white/50 border-t border-sky-100">
              Built with <Heart className="w-5 h-5 text-pink-400 fill-pink-400" /> for tiny explorers
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full select-none overflow-x-hidden">
      {renderContent()}
    </div>
  );
};

export default App;
