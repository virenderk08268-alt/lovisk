
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { chatWithGemiPal } from '../services/geminiService';
import { Message } from '../types';
import { SUGGESTED_PROMPTS, LANGUAGES } from '../constants';
import Character from './Character';

interface ChatViewProps {
  onBack: () => void;
  languageCode: string;
}

const ChatView: React.FC<ChatViewProps> = ({ onBack, languageCode }) => {
  const langName = LANGUAGES[languageCode]?.name || 'English';
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: languageCode === 'en' ? "Hi there, friend! I'm Gemi-Pal. What should we talk about today?" : `नमस्ते! मैं आपका गेमी-पॉल हूँ। आज हम क्या बात करेंगे?`, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithGemiPal(text, langName);
      const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response || "...", timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-sky-50 overflow-hidden">
      <header className="p-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10 shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-sky-600" />
        </button>
        <div className="flex items-center gap-2">
          <Character size="sm" isTalking={isTyping} />
          <h1 className="text-xl font-extrabold text-sky-900 leading-none">Gemi-Pal</h1>
        </div>
        <div className="text-[10px] font-black bg-sky-100 text-sky-700 px-2 py-1 rounded uppercase tracking-widest">
          {languageCode}
        </div>
      </header>

      {/* Main Messages Scroll */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain scroll-smooth"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 shadow-md ${
              msg.role === 'user' 
                ? 'bg-sky-500 text-white rounded-t-2xl rounded-bl-2xl' 
                : 'bg-white text-gray-800 rounded-t-2xl rounded-br-2xl'
            }`}>
              <p className="text-lg font-medium leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-t-2xl rounded-br-2xl shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Scroll for Suggestions */}
      {!isTyping && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 snap-x">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap bg-white border-2 border-sky-100 px-4 py-2 rounded-full text-sm font-bold text-sky-700 hover:bg-sky-100 transition-colors snap-start shadow-sm active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <footer className="p-4 bg-white border-t-2 border-sky-100 shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Tell me something!"
            className="flex-1 p-4 rounded-full border-2 border-sky-100 focus:outline-none focus:border-sky-400 text-lg font-bold"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="p-4 bg-sky-500 text-white rounded-full hover:bg-sky-600 disabled:opacity-50 transition-all shadow-lg active:scale-90"
          >
            <Send className="w-7 h-7" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;
