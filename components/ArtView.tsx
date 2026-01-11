
import React, { useState } from 'react';
import { Wand2, ArrowLeft, Download, RotateCcw, History } from 'lucide-react';
import { generateMagicArt } from '../services/geminiService';
import { ART_PROMPTS } from '../constants';
import Character from './Character';

interface ArtViewProps {
  onBack: () => void;
}

const ArtView: React.FC<ArtViewProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const url = await generateMagicArt(text);
      if (url) {
        setImageUrl(url);
        setHistory(prev => [url, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `magic-art-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-purple-50 overflow-hidden">
      <header className="p-4 bg-white shadow-sm flex items-center justify-between z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-purple-600" />
        </button>
        <div className="flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-500 animate-pulse" />
          <h1 className="text-xl font-extrabold text-purple-900 leading-none">Magic Art</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 overscroll-contain">
        {!imageUrl && !isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto">
            <Character size="lg" isTalking={true} />
            <h2 className="text-2xl font-black text-purple-800 tracking-tight">What should I draw for you?</h2>
            <div className="grid grid-cols-1 gap-3 w-full">
              {ART_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setPrompt(p); handleGenerate(p); }}
                  className="bg-white border-2 border-purple-200 p-4 rounded-2xl hover:bg-purple-100 transition-all text-left flex items-center justify-between group shadow-sm active:scale-95"
                >
                  <span className="text-purple-700 font-bold">{p}</span>
                  <Wand2 className="w-5 h-5 text-purple-300 group-hover:text-purple-500" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto space-y-6 flex flex-col items-center">
            <div className="relative w-full aspect-square bg-white rounded-3xl shadow-2xl border-8 border-white overflow-hidden flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-purple-600 font-black animate-pulse">Mixing magic colors...</p>
                </div>
              ) : (
                <img src={imageUrl!} alt="Magic Art" className="w-full h-full object-cover" />
              )}
            </div>

            {imageUrl && !isLoading && (
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => { setImageUrl(null); setPrompt(''); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-purple-200 p-4 rounded-2xl text-purple-700 font-black hover:bg-purple-50 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> New Idea
                </button>
                <button
                  onClick={() => handleDownload(imageUrl!)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 p-4 rounded-2xl text-white font-black hover:bg-purple-700 transition-all shadow-lg active:scale-95"
                >
                  <Download className="w-5 h-5" /> Save!
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Horizontal Scroll */}
        {history.length > 0 && (
          <div className="w-full space-y-3 pb-4">
            <div className="flex items-center gap-2 text-purple-800 font-black px-1">
              <History className="w-5 h-5" />
              <span className="text-lg">Recent Magic</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1 snap-x">
              {history.map((url, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md snap-start cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setImageUrl(url)}
                >
                  <img src={url} alt={`History ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 bg-white border-t-2 border-purple-100 z-10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
            placeholder="Describe your masterpiece..."
            className="flex-1 p-4 rounded-full border-2 border-purple-100 focus:outline-none focus:border-purple-400 text-lg font-bold"
          />
          <button
            onClick={() => handleGenerate(prompt)}
            disabled={!prompt.trim() || isLoading}
            className="p-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 transition-all shadow-lg active:scale-90"
          >
            <Wand2 className="w-7 h-7" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ArtView;
