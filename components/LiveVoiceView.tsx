
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ArrowLeft, Headphones, Settings2, Sparkles } from 'lucide-react';
import { connectVoiceSession } from '../services/geminiService';
import { decode, createPcmBlob, decodeAudioData } from '../utils/audio';
import { LANGUAGES, VOICES } from '../constants';
import Character from './Character';

interface LiveVoiceViewProps {
  onBack: () => void;
  languageCode: string;
}

const LiveVoiceView: React.FC<LiveVoiceViewProps> = ({ onBack, languageCode }) => {
  const langName = LANGUAGES[languageCode]?.name || 'English';
  
  const [isActive, setIsActive] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [error, setError] = useState<string | null>(null);
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);

  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionScrollRef = useRef<HTMLDivElement>(null);

  const cleanup = () => {
    sessionRef.current?.close();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    setIsActive(false);
    setIsTalking(false);
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    if (transcriptionScrollRef.current) {
      transcriptionScrollRef.current.scrollTop = transcriptionScrollRef.current.scrollHeight;
    }
  }, [transcriptionHistory]);

  const startSession = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = connectVoiceSession({
        onopen: () => {
          setIsActive(true);
          const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromise.then((session) => {
              if (session) session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContextRef.current!.destination);
        },
        onmessage: async (message: any) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioContextRef.current) {
            setIsTalking(true);
            const audioData = decode(base64Audio);
            const buffer = await decodeAudioData(audioData, outputAudioContextRef.current, 24000, 1);
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAudioContextRef.current.destination);
            
            const now = outputAudioContextRef.current.currentTime;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            
            sourcesRef.current.add(source);
            source.onended = () => {
              sourcesRef.current.delete(source);
              if (sourcesRef.current.size === 0) {
                setIsTalking(false);
              }
            };
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => {
              try { s.stop(); } catch(e) {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setIsTalking(false);
          }

          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            setTranscriptionHistory(prev => {
              if (message.serverContent?.turnComplete) {
                return [...prev, text];
              }
              const last = prev[prev.length - 1] || '';
              return [...prev.slice(0, -1), last + text];
            });
          }
        },
        onerror: (e: any) => {
          console.error("Voice Error:", e);
          setError("My magical ears are confused!");
          cleanup();
        },
        onclose: () => cleanup()
      }, langName, selectedVoice);

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Please let me use your microphone!");
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  useEffect(() => {
    if (isActive) {
      cleanup();
      startSession();
    }
  }, [selectedVoice]);

  return (
    <div className="flex flex-col h-full bg-orange-50 overflow-hidden">
      <header className="p-4 flex items-center justify-between bg-white shadow-sm z-20 shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-orange-100 transition-colors">
          <ArrowLeft className="w-7 h-7 text-orange-600" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black text-orange-900 leading-none tracking-tight">Hands-Free Talk</h1>
          <div className="flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{langName}</span>
          </div>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Vertical Scroll for entire content area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Voice Picker */}
        <div className="bg-white/80 backdrop-blur-md p-4 border-b border-orange-100 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Settings2 className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-black text-orange-900 uppercase tracking-tight">Pick Gemi's Voice:</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-1 snap-x">
            {VOICES.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVoice(v.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-black transition-all transform snap-start ${
                  selectedVoice === v.id 
                    ? `${v.color} text-white shadow-xl ring-4 ring-orange-200 scale-105` 
                    : 'bg-white text-orange-800 border-2 border-orange-50 hover:border-orange-200'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-start p-8 gap-10 min-h-[calc(100%-100px)]">
          {/* Animated Background Rings */}
          {isActive && (
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none flex justify-center items-center">
              <div className={`absolute w-[18rem] h-[18rem] border-4 border-orange-300 rounded-full transition-all duration-700 ${isTalking ? 'animate-ping opacity-20' : 'animate-pulse opacity-30'}`}></div>
              <div className={`absolute w-[22rem] h-[22rem] border-2 border-orange-200 rounded-full transition-all duration-1000 ${isTalking ? 'animate-ping opacity-10' : 'animate-pulse opacity-15'}`}></div>
            </div>
          )}

          <Character size="lg" isListening={isActive && !isTalking} isTalking={isTalking} />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-16 flex flex-col items-center justify-center">
              {error ? (
                <p className="text-red-500 font-black bg-white/90 px-6 py-2 rounded-2xl shadow-md border-2 border-red-100">{error}</p>
              ) : isActive ? (
                <div className="space-y-2">
                  <p className="text-orange-900 font-black text-3xl tracking-tight drop-shadow-sm">
                    {isTalking ? "Gemi is Sharing!" : "Listening to You!"}
                  </p>
                  <div className="flex gap-2 justify-center">
                    {[1,2,3,4,5,6].map(i => (
                      <div 
                        key={i} 
                        className={`w-1.5 rounded-full bg-orange-500 transition-all duration-200 ${isActive && !isTalking ? 'animate-bounce' : 'h-3'}`} 
                        style={{ height: isTalking ? `${Math.random() * 20 + 10}px` : '10px', animationDelay: `${i*0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-orange-900 font-black text-2xl">Tap to Talk!</p>
              )}
            </div>

            {/* Transcription History Scroll */}
            <div 
              ref={transcriptionScrollRef}
              className={`w-full max-w-lg bg-white/60 backdrop-blur-sm rounded-3xl p-4 h-32 overflow-y-auto border-2 border-white shadow-inner transition-opacity duration-500 scroll-smooth ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >
              {transcriptionHistory.length === 0 ? (
                <p className="text-orange-300 font-bold italic mt-8">Your conversation will appear here...</p>
              ) : (
                <div className="space-y-3">
                  {transcriptionHistory.map((text, i) => (
                    <p key={i} className={`text-sm font-bold leading-relaxed ${i % 2 === 0 ? 'text-orange-900' : 'text-orange-700'}`}>
                       {text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={isActive ? cleanup : startSession}
            className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform shrink-0 ${
                isActive 
                ? 'bg-red-500 hover:bg-red-600 scale-90 rotate-90' 
                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95'
            }`}
          >
            {isActive ? (
                <MicOff className="w-16 h-16 text-white" />
            ) : (
                <>
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30"></div>
                <Mic className="w-16 h-16 text-white" />
                </>
            )}
          </button>

          <div className="flex items-center gap-3 text-orange-500 bg-white/90 px-6 py-3 rounded-full text-sm font-black shadow-md border-2 border-orange-100 mb-8 shrink-0">
            <Headphones className="w-5 h-5" />
            <span>Just talk, I'll listen!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceView;
