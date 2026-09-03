import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Radio, 
  Activity, 
  Sliders, 
  Music, 
  Flame
} from 'lucide-react';
import { Song } from '../types';

interface RaionRadioViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  isAdmin?: boolean;
}

interface ScriptSection {
  title: string;
  timeRange: string;
  text: string;
  action: string;
}

export default function RaionRadioView({ songs, onPlaySong, isAdmin = false }: RaionRadioViewProps) {
  // --- STATE ---
  const [frequency, setFrequency] = useState<number>(88.3);
  const [band, setBand] = useState<'FM' | 'AM'>('FM');
  const [stationTagline, setStationTagline] = useState<string>('Thunderous Sound, Midnight Echoes');
  const [stationSlogan, setStationSlogan] = useState<string>("Broadcasting from Tokyo's neon heart at 2 AM. Your late-night sanctuary of Synthwave, Lo-fi, and J-Pop.");
  const [djName, setDjName] = useState<string>('DJ Raion');
  const [selectedSongId, setSelectedSongId] = useState<string>('suno-invisible');
  
  // Custom Controls
  const [pitch, setPitch] = useState<number>(0.85); // deep voice
  const [speed, setSpeed] = useState<number>(0.85); // calm and smooth pace
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState<number>(0);
  const [speechText, setSpeechText] = useState<string>('');
  
  // Admin Script Edit overrides
  const [stepIntro, setStepIntro] = useState<string>('');
  const [stepFeatured, setStepFeatured] = useState<string>('');
  const [stepInterlude, setStepInterlude] = useState<string>('');
  const [stepOutro, setStepOutro] = useState<string>('');
  const [isEditingScripts, setIsEditingScripts] = useState<boolean>(false);

  // Audio state
  const [activeTab, setActiveTab] = useState<'station' | 'transmitter' | 'melodies'>('station');
  const [synthType, setSynthType] = useState<'guitar' | 'retro-8bit'>('guitar');

  const featuredSong = songs.find(s => s.id === selectedSongId) || songs.find(s => s.id === 'suno-invisible') || songs[0];

  const defaultIntroText = `Midnight static clearing out... You are listening to RAION 雷音 ${band}, broadcasting live on frequency ${band === 'FM' ? `${frequency.toFixed(1)} Megahertz` : `${Math.round(frequency)} Kilohertz`}, here in the glowing heart of Tokyo. I am your host, ${djName}, coming to you at exactly 2:00 AM under a shroud of neon mist. Our tagline tonight as always: ${stationTagline}. Sit back, sink in, and let normal reality dissolve.`;
  
  const defaultFeaturedText = `Let's dive directly into tonight's cosmic centerpiece. From our select database registries, we are spinning the legendary classic, "${featuredSong?.songName?.en || 'Love That Keeps Diving'}" by ${featuredSong?.singerName?.en || 'アンドレ (曇りの断層)'}. This track is a masterclass in visual-kei melancholia, blending majestic synths with a driving heartbeat of soaring minor key chord progressions. We are skipping the heavy lyrical analysis to let the sheer raw melody take your mind. Listen...`;

  const defaultInterludeText = `That ethereal atmosphere, that dense retro guitar drive... absolutely sublime. It's why this sound is breaking borders. For our listeners in North America, this evokes the cyberpunk noir of midnight highways. For our massive crowd in South America, it is pure visual stadium energy. It is universal. No translations required when the melody is this pure.`;

  const defaultOutroText = `Thank you for tuning in to this hour's frequency. Up next is the continuous streaming catalog. This is ${djName}, signing off from RAION 雷音, where midnight never ends. Stay electric.`;

  // Dynamic show scripts based on selected featured song
  const generatedScript: ScriptSection[] = [
    {
      title: '1. INTRO & STATION ID',
      timeRange: '0:00 - 0:30',
      action: '🎵 [Signature RAION 8-bit Orchestral Jingle echoes. Cozy rain static in background.] ⛈️',
      text: stepIntro ? stepIntro : defaultIntroText
    },
    {
      title: '2. FEATURED SONG INTRODUCTION',
      timeRange: '0:30 - 1:15',
      action: '🎚️ [Background atmospheric synthesizers fade to low volume.] 🌌',
      text: stepFeatured ? stepFeatured : defaultFeaturedText
    },
    {
      title: '3. STATION INTERLUDE & TRANSLATION REMARKS',
      timeRange: '1:15 - 1:45',
      action: '💬 [Deep bass pad hum. Neon speaker wave pulses gently.] 📺',
      text: stepInterlude ? stepInterlude : defaultInterludeText
    },
    {
      title: '4. SIGN-OFF & OUTRO',
      timeRange: '1:45 - 2:15',
      action: '🛸 [Host steps back. Fading speech block to full track stream.] 🔋',
      text: stepOutro ? stepOutro : defaultOutroText
    }
  ];

  // Ref for speech synthesis
  const speechUttRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Autoplay the featured song when the Radio FM view is on / active
  useEffect(() => {
    if (featuredSong) {
      const timer = setTimeout(() => {
        onPlaySong(featuredSong);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [featuredSong]);

  // Play custom synthesized 8-Bit + Orchestral Station Jingle with Web Audio API!
  const playSignatureJingle = (callback?: () => void) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Notes: C4 (261.63), Eb4 (311.13), G4 (392.00), Bb4 (466.16), C5 (523.25), D5 (587.33), Eb5 (622.25)
      // Chords: Cm7 -> Abmaj7 -> Bb6 -> Gsus4
      const melodyNotes = [261.63, 311.13, 392.00, 466.16, 523.25, 587.33, 622.25];
      const duration = 0.22;
      
      melodyNotes.forEach((freq, idx) => {
        // Oscillator 1 (Square wave for that 8-bit retro vibe)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(freq, ctx.currentTime + idx * duration);
        gain1.gain.setValueAtTime(0.08, ctx.currentTime + idx * duration);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * duration - 0.02);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        // Oscillator 2 (Triangle wave for sub bass depth)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq / 2, ctx.currentTime + idx * duration);
        gain2.gain.setValueAtTime(0.12, ctx.currentTime + idx * duration);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * duration - 0.02);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start(ctx.currentTime + idx * duration);
        osc2.start(ctx.currentTime + idx * duration);
        
        osc1.stop(ctx.currentTime + (idx + 1) * duration);
        osc2.stop(ctx.currentTime + (idx + 1) * duration);
      });

      // Complete jingle finish event callback
      setTimeout(() => {
        if (callback) callback();
      }, melodyNotes.length * duration * 1000 + 100);

    } catch (err) {
      console.error("Web Audio Jingle Error:", err);
      if (callback) callback();
    }
  };

  // Play custom synthesized guitar-like note
  const playSynthesizedGuitar = (freq: number, length = 0.6) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Dual oscillator system for rich chorus detuning
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const distortion = ctx.createWaveShaper();
      const gainNode = ctx.createGain();
      
      // Standard non-linear distortion wave shapher math
      const makeGuitarDistortion = (amount = 100) => {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      };

      distortion.curve = makeGuitarDistortion(120);
      distortion.oversample = '4x';
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      
      osc2.type = 'sawtooth';
      // Detune by a few cents for thick stadium-like visual kei double-guitar sound
      osc2.frequency.setValueAtTime(freq + 1.8, ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + length);
      
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
      
      osc1.connect(distortion);
      osc2.connect(distortion);
      distortion.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + length);
      osc2.stop(ctx.currentTime + length);
    } catch (err) {
      console.error(err);
    }
  };

  // Play retro chiptune beep sound
  const playRetroBeep = (freq: number, length = 0.4) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + length);
    } catch (err) {
      console.error(err);
    }
  };

  // Play Note Helper
  const handlePlayTone = (freq: number) => {
    if (synthType === 'guitar') {
      playSynthesizedGuitar(freq, 0.75);
    } else {
      playRetroBeep(freq, 0.35);
    }
  };

  // Speaks out the narrative script using the SpeechSynthesis API
  const handleToggleBroadcast = () => {
    if (isBroadcasting) {
      // Stop broadcast
      setIsBroadcasting(false);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeechText('');
      return;
    }

    setIsBroadcasting(true);
    setCurrentScriptIndex(0);
    
    // Automatically trigger/ensure the high-quality MP3 audio is playing when broadcast starts
    if (featuredSong) {
      onPlaySong(featuredSong);
    }
    
    // Step A: Play signature jingle chiptune first!
    playSignatureJingle(() => {
      // Proceed to speak the scripts in sequence
      speakScriptStep(0);
    });
  };

  const speakScriptStep = (index: number) => {
    if (!window.speechSynthesis || index >= generatedScript.length) {
      setIsBroadcasting(false);
      // Play the featured song once the DJ finished!
      if (featuredSong) {
        onPlaySong(featuredSong);
      }
      return;
    }

    setCurrentScriptIndex(index);
    const textToSpeak = generatedScript[index].text;
    setSpeechText(textToSpeak);

    // Cancel prior speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    speechUttRef.current = utterance;
    
    // Set custom pitch & rate to resemble late-night DJ
    utterance.pitch = pitch; 
    utterance.rate = speed;

    // Pick a masculine or cozy voice if possible, with support for Japanese language if requested
    const voices = window.speechSynthesis.getVoices();
    const isJapaneseText = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(textToSpeak);
    
    let selectedVoice = null;
    if (isJapaneseText) {
      selectedVoice = voices.find(v => v.lang.startsWith('ja-') || v.lang.includes('ja'));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('google')) 
                     || voices.find(v => v.lang.startsWith('en-'))
                     || voices[0];
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onend = () => {
      // Small pause, then auto-advance to next part of the script
      setTimeout(() => {
        speakScriptStep(index + 1);
      }, 1000);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsBroadcasting(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Interactive Melody notes array mapping for "DESCENDING LOVE" main guitar riff (C minor)
  // Verse hook notes: C4, D4, Eb4, G4, Ab4, G4, F4, Eb4, C4, G3
  const descendingLoveNotes = [
    { label: 'C4', freq: 261.63, tag: 'Tonic' },
    { label: 'D4', freq: 293.66, tag: 'Step' },
    { label: 'Eb4', freq: 311.13, tag: 'Minor 3rd' },
    { label: 'G4', freq: 392.00, tag: 'Perfect 5th' },
    { label: 'Ab4', freq: 415.30, tag: 'Sixth' },
    { label: 'G4', freq: 392.00, tag: '5th Pivot' },
    { label: 'F4', freq: 349.23, tag: 'Fourth' },
    { label: 'Eb4', freq: 311.13, tag: '3rd Resolution' },
    { label: 'C4', freq: 261.63, tag: 'Tonic Root' },
    { label: 'G3', freq: 196.00, tag: 'Bass Fifth' }
  ];

  // Auto playback the full melody hook loop in perfect timing!
  const [isPlayingMelodyLoop, setIsPlayingMelodyLoop] = useState(false);
  const playDescendingLoveMelodyHook = () => {
    if (isPlayingMelodyLoop) return;
    setIsPlayingMelodyLoop(true);
    
    const duration = 280; // timing tick in ms
    descendingLoveNotes.forEach((note, idx) => {
      setTimeout(() => {
        handlePlayTone(note.freq);
        if (idx === descendingLoveNotes.length - 1) {
          setIsPlayingMelodyLoop(false);
        }
      }, idx * duration);
    });
  };

  return (
    <section className="space-y-8 py-4 text-zinc-950">
      
      {/* Upper header card - stylized Radio transmitter */}
      <div className="bg-gradient-to-tr from-[#293556] to-[#151D33] p-8 md:p-10 rounded-[50px] shadow-2xl relative overflow-hidden border border-cyan-500/20 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2.5 bg-cyan-400/10 border border-cyan-400/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase">SYS BROADCAST FREQUENCY • ON AIR</span>
            </div>
            <h2 className="text-4.5xl font-black italic tracking-tighter uppercase leading-none">
              RAION 雷音 <span className="text-cyan-400">FM</span>
            </h2>
            <p className="text-zinc-400 font-bold text-xs max-w-md leading-relaxed">
              Automated AI Host console. Generate scripts, voice over live transmissions, and explore the tone anatomy of major tracks.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-black/40 border border-zinc-800 p-6 rounded-3xl shrink-0 self-start md:self-auto min-w-[150px] text-center backdrop-blur-xl">
            <Radio className="text-cyan-400 animate-pulse mb-1.5" size={36} />
            <span className="text-[26px] font-mono font-black text-cyan-400 tracking-wider">
              {frequency.toFixed(1)}
            </span>
            <span className="text-[8px] font-bold tracking-widest uppercase text-zinc-500 mt-1">MEGAHERTZ FM</span>
          </div>
        </div>

        {/* Dynamic Spectrum Graphic inside the header */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center gap-3">
          <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase shrink-0">Signal Grid :</span>
          <div className="flex-1 flex items-end justify-between h-8 px-2 bg-black/10 rounded-xl gap-0.5 overflow-hidden">
            {Array.from({ length: 48 }).map((_, idx) => (
              <div 
                key={idx} 
                className="w-full bg-cyan-400"
                style={{ 
                  height: isBroadcasting 
                    ? `${Math.max(15, Math.sin(idx * 0.4 + Date.now() * 0.01) * 40 + Math.random() * 45)}%` 
                    : `${Math.max(8, Math.sin(idx * 0.1) * 15 + Math.random() * 10)}%`,
                  opacity: isBroadcasting ? 0.9 : 0.25,
                  transition: 'height 0.15s ease' 
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex bg-white/70 backdrop-blur-xl border border-zinc-100 rounded-3xl p-1.5 gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveTab('station')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'station' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
        >
          <Activity size={15} /> Status & DJ Playback
        </button>
        <button
          onClick={() => setActiveTab('transmitter')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'transmitter' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
        >
          <Sliders size={15} /> Station Settings
        </button>
        <button
          onClick={() => setActiveTab('melodies')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'melodies' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'}`}
        >
          <Flame size={15} className="text-red-500 animate-pulse" /> Melodies & Tone Lab
        </button>
      </div>

      {/* TAB CONTENT 1: STATION IDENTITY & ON-AIR CONTROL */}
      {activeTab === 'station' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] soft-shadow border border-zinc-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <h3 className="text-xl font-black italic uppercase text-zinc-950">🎙️ AI Broadcast Command</h3>
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider mt-0.5">Control the automated voice synthesis & jingle playback</p>
              </div>
              
              <button
                onClick={handleToggleBroadcast}
                className={`px-7 py-3 rounded-full flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${isBroadcasting ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-650' : 'bg-[#293556] text-white shadow-[#293556]/10 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isBroadcasting ? (
                  <>
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                    Stop Broadcast (On-Air)
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    Start Broadcast Session
                  </>
                )}
              </button>
            </div>

            {/* Simulated Live status subtitle / reading block */}
            {isBroadcasting && (
              <div className="bg-[#151D33] p-6 rounded-3xl text-cyan-300 relative overflow-hidden border border-cyan-500/30">
                <div className="absolute top-3 right-3 text-[8px] font-mono tracking-widest text-[#E11D48] font-black uppercase px-2 py-0.5 bg-red-450/40 rounded-full border border-red-500">
                  Transmitting
                </div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">DJ Subtitle (Live Output) :</p>
                <p className="font-bold text-sm leading-relaxed text-zinc-50">{speechText || "Broadcasting standard atmospheric signal..."}</p>
                
                {/* Speech wave visualizer */}
                <div className="mt-4 flex gap-1 items-center justify-center">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span 
                      key={i} 
                      className="w-1.5 bg-cyan-400 rounded-full" 
                      style={{ 
                        height: speechText ? `${Math.floor(Math.random() * 25) + 5}px` : '4px',
                        transition: 'height 0.1s ease',
                        animation: speechText ? 'pulse 0.4s infinite alternate' : 'none' 
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Script Roadmap */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Program Script Schedule</h4>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditingScripts(!isEditingScripts)}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isEditingScripts
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md'
                        : 'bg-cyan-100 text-[#293556] border border-cyan-200/50 hover:bg-cyan-200'
                    }`}
                  >
                    {isEditingScripts ? '💾 Save & Apply Script' : '✏️ Modify AI Script'}
                  </button>
                )}
              </div>

              {/* Admin DJ Presets selection */}
              {isAdmin && (
                <div className="flex flex-wrap items-center gap-2 bg-slate-550/10 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">DJ Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIntro('');
                      setStepFeatured('');
                      setStepInterlude('');
                      setStepOutro('');
                    }}
                    className="px-3 py-1 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-[9px] font-bold text-[#293556] transition-all cursor-pointer"
                  >
                    🔄 Default Midnight
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIntro('うわ、雷音だ！⚡ かっこいいバンドじゃん✨ クモルのプロジェクトとして「曇りの断層」をやってるんだね。メンバーも紹介してくれてありがと〜');
                      setStepFeatured('メンバーを紹介するよ！ボーカルとギターのANDREE（アンドレ）、ベースのMARO（真人）、リードギターのREN（蓮）、そしてドラムのPIKAS（ピカス）！って感じの最高にかっこいい布陣なんだよね。');
                      setStepInterlude('で、聞かせて？これ何に使うの？📝 プロフィールや紹介文を書く？曲やアルバムのコンセプト作り？ライナーノーツ？用途によって全力の入り方変わるから、パパッと書き始めたい！なにからいこうか〜');
                      setStepOutro('それじゃあ、RAION FMでの素晴らしい音楽をフルで楽しんでね。次の周波数まで、ステイ・エレクトリック！');
                    }}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-600 text-white hover:from-amber-600 hover:to-amber-700 text-[9px] font-black uppercase tracking-wider transition-all shadow-sm shadow-amber-500/15 cursor-pointer"
                  >
                    ⚡ Load "曇りの断層" Band Profile
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedScript.map((step, idx) => {
                  const isActive = isBroadcasting && currentScriptIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${isActive ? 'bg-cyan-50/40 border-cyan-400 ring-2 ring-cyan-200' : 'bg-zinc-50/50 border-zinc-100'}`}
                    >
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-black uppercase text-[#293556] bg-cyan-100/60 px-2.5 py-0.5 rounded-full">{step.title}</span>
                          <span className="text-[8px] font-mono font-bold text-zinc-400 bg-white border border-zinc-100 px-2 py-0.5 rounded-md">{step.timeRange}</span>
                        </div>
                        <p className="text-[9px] font-bold text-[#A0886F] uppercase tracking-wider italic">{step.action}</p>
                        
                        {isEditingScripts ? (
                          <div className="mt-2 space-y-1 w-full">
                            <textarea
                              className="w-full bg-white border border-zinc-200 rounded-2xl p-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
                              rows={4}
                              value={
                                idx === 0 ? stepIntro :
                                idx === 1 ? stepFeatured :
                                idx === 2 ? stepInterlude :
                                stepOutro
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (idx === 0) setStepIntro(val);
                                else if (idx === 1) setStepFeatured(val);
                                else if (idx === 2) setStepInterlude(val);
                                else setStepOutro(val);
                              }}
                              placeholder="Describe customized DJ broadcast command speech here..."
                            />
                            <p className="text-[8px] text-zinc-400 font-medium italic">
                              Overridden text when speaking. Clear text to restore station's dynamic auto-template.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-700 leading-relaxed font-bold">{step.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Song Indicator */}
            <div className="p-6 bg-[#FAF9F5] rounded-3xl border border-dashed border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-200 shadow-sm shrink-0">
                  <img src={featuredSong?.albumArtUrl || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400"} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[8px] font-black tracking-widest text-[#A0886F] bg-[#FFF4E4] px-2.5 py-0.5 rounded-full uppercase">Queue Featured Track</span>
                  <h4 className="font-black text-zinc-900 truncate max-w-sm text-base leading-tight mt-1">
                    {featuredSong?.songName?.en || 'Invisible'} 
                    <span className="text-zinc-300 mx-1">|</span> 
                    <span className="text-zinc-500 font-medium text-xs font-noto">{featuredSong?.songName?.ja}</span>
                  </h4>
                  <p className="text-[10px] text-zinc-450 font-bold mt-0.5 uppercase tracking-wider">Producer: {featuredSong?.singerName?.en || 'lightyAndrei'}</p>
                </div>
              </div>
              
              <button 
                onClick={() => onPlaySong(featuredSong)}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-black text-[9px] tracking-wider uppercase px-4 py-2.5 rounded-xl cursor-pointer self-stretch sm:self-auto flex items-center justify-center gap-2"
              >
                <Music size={12} /> Play Stream directly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TRANSMITTER SETTINGS & IDENTITY CREATION */}
      {activeTab === 'transmitter' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] soft-shadow border border-zinc-100 space-y-6 animate-fade-in">
            <h3 className="text-xl font-black italic uppercase text-zinc-950">🏷️ Station Slogan & Identity Settings</h3>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed">
              Design the tagline, frequency and branding coordinates of your RAION Radio Station. The script generated above automatically synchronizes with these identity values.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Broadcasting Host DJ Node name</label>
                <input 
                  className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-sm text-zinc-800 focus:ring-2 focus:ring-cyan-500"
                  value={djName}
                  onChange={e => setDjName(e.target.value)}
                  placeholder="e.g. DJ Raion, Luna, Akari..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Station Memorable Tagline</label>
                <input 
                  className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-sm text-zinc-800 focus:ring-2 focus:ring-cyan-500"
                  value={stationTagline}
                  onChange={e => setStationTagline(e.target.value)}
                  maxLength={40}
                  placeholder="Keep it under 5 words..."
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Detailed Station Description & Slogan</label>
                <textarea 
                  className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-xs text-zinc-800 focus:ring-2 focus:ring-cyan-500 min-h-[75px]"
                  value={stationSlogan}
                  onChange={e => setStationSlogan(e.target.value)}
                  placeholder="e.g. Your night light inside Tokyo's rain shadows..."
                />
              </div>
            </div>

            {/* Slider frequency selector */}
            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">Modulate Transmitter Frequency</label>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Toggle between FM and AM broadcasting bands</p>
                </div>
                
                {/* Select Radio Band */}
                <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      setBand('FM');
                      setFrequency(88.3);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      band === 'FM'
                        ? 'bg-[#293556] text-white shadow-sm'
                        : 'text-[#293556] hover:bg-zinc-200'
                    }`}
                  >
                    FM Band
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBand('AM');
                      setFrequency(880);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      band === 'AM'
                        ? 'bg-[#293556] text-white shadow-sm'
                        : 'text-[#293556] hover:bg-zinc-200'
                    }`}
                  >
                    AM Band
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-3xl border border-zinc-100/60">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Active Frequency Mode</span>
                <span className="text-xs font-mono font-black text-cyan-600 bg-cyan-50 px-3.5 py-1 rounded-full">
                  {band === 'FM' ? `${frequency.toFixed(1)} MHz` : `${Math.round(frequency)} kHz`} {band}
                </span>
              </div>

              <input 
                type="range"
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#293556]"
                min={band === 'FM' ? 87.5 : 530}
                max={band === 'FM' ? 108.0 : 1700}
                step={band === 'FM' ? 0.1 : 10}
                value={frequency}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setFrequency(val);
                  // Play a small static synth sound
                  const mockPitch = band === 'FM' ? (900 - val * 4) : (1000 - val * 0.4);
                  handlePlayTone(mockPitch);
                }}
              />
              <div className="flex justify-between text-[8px] font-mono font-black text-zinc-400 uppercase tracking-widest px-1">
                {band === 'FM' ? (
                  <>
                    <span>87.5 MHz (Lo-Fi Core)</span>
                    <span>98.0 MHz</span>
                    <span>108.0 MHz (Studio Visual)</span>
                  </>
                ) : (
                  <>
                    <span>530 kHz (Late Night)</span>
                    <span>1000 kHz</span>
                    <span>1700 kHz (Saturated High)</span>
                  </>
                )}
              </div>
            </div>

            {/* Voice Characteristics */}
            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">TTS Host Voice Saturation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                    <span>Vocal Tone Pitch (Voice depth)</span>
                    <span className="font-mono text-zinc-700 font-extrabold">{pitch.toFixed(2)}x (0.8x deep, 1.2x high)</span>
                  </div>
                  <input 
                    type="range"
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    value={pitch}
                    onChange={e => setPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                    <span>Enunciation Speed (DJ pace)</span>
                    <span className="font-mono text-zinc-700 font-extrabold">{speed.toFixed(2)}x (0.8x slow-smooth)</span>
                  </div>
                  <input 
                    type="range"
                    min={0.6}
                    max={1.4}
                    step={0.05}
                    value={speed}
                    onChange={e => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Feature picker scheduler */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Featured Broadcast Song Target</label>
              <select
                className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-xs text-zinc-800 focus:ring-2 focus:ring-cyan-500"
                value={selectedSongId}
                onChange={e => setSelectedSongId(e.target.value)}
              >
                {songs.map(song => (
                  <option key={song.id} value={song.id}>
                    {song.songName.en} — By {song.singerName.en} ({song.duration}s)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: MELODIES & SONG TONE LAB (FOR DESCENDING LOVE & METALS) */}
      {activeTab === 'melodies' && (
        <div className="space-y-6">
          
          {/* Song selection alert */}
          <div className="bg-white p-8 rounded-[40px] soft-shadow border border-zinc-100 space-y-5 animate-fade-in text-zinc-950">
            <div>
              <span className="text-[8px] font-black bg-red-100 text-red-700 px-3 py-1 rounded-full uppercase tracking-widest">
                TRACK ANATOMY LAB
              </span>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#293556] mt-2.5">
                🎸 SONG SPEC SHEET: "DESCENDING LOVE" (落下する恋)
              </h3>
              <p className="text-zinc-500 text-xs font-semibold leading-relaxed mt-1">
                A thorough physical gear, amp, and chord structure blueprint answering how to construct, record, and play the song.
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-3xl">
              <div className="text-center p-2">
                <p className="text-[8px] text-zinc-400 font-extrabold uppercase">Rhythm BPM</p>
                <p className="text-lg font-black text-cyan-600 font-mono mt-0.5">134</p>
              </div>
              <div className="text-center p-2 border-l border-zinc-200">
                <p className="text-[8px] text-zinc-400 font-extrabold uppercase">Time Signature</p>
                <p className="text-lg font-black text-[#293556] font-mono mt-0.5">4/4</p>
              </div>
              <div className="text-center p-2 border-l border-zinc-200">
                <p className="text-[8px] text-zinc-400 font-extrabold uppercase">Tonal Scale Key</p>
                <p className="text-lg font-black text-purple-600 font-mono mt-0.5">C minor (Cm)</p>
              </div>
              <div className="text-center p-2 border-l border-zinc-200">
                <p className="text-[8px] text-zinc-400 font-extrabold uppercase">Genre Style</p>
                <p className="text-sm font-black text-indigo-500 uppercase mt-1">Visual-Kei Pop</p>
              </div>
            </div>

            {/* Chord Progression section */}
            <div className="space-y-3.5 border-t border-zinc-100 pt-5">
              <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">1. Melodic Chord Progression</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <p className="text-[9px] font-black uppercase text-[#A0886F] tracking-wide">Haunting Verse Progression</p>
                  <p className="font-mono font-black text-lg text-zinc-800 tracking-widest mt-1.5">
                    Cm <span className="text-zinc-300 font-sans mx-1">→</span> Ab <span className="text-zinc-300 font-sans mx-1">→</span> Bb <span className="text-zinc-300 font-sans mx-1">→</span> Gm
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-2">Drives the initial dark tension, utilizing minor pivots.</p>
                </div>

                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <p className="text-[9px] font-black uppercase text-purple-600 tracking-wide">Soaring Chorus Progression (Peak)</p>
                  <p className="font-mono font-black text-lg text-zinc-800 tracking-widest mt-1.5">
                    Ab <span className="text-zinc-300 font-sans mx-1">→</span> Bb <span className="text-zinc-300 font-sans mx-1">→</span> Cm <span className="text-zinc-300 font-sans mx-1">→</span> Gm
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-2">The royal J-rock resolution scale giving a massive harmonic lift.</p>
                </div>
              </div>
            </div>

            {/* Instrument list & gears requirements */}
            <div className="space-y-4 border-t border-zinc-100 pt-5">
              <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">2. Physical Gear List & Setup Specs</h4>
              <div className="space-y-3 text-xs leading-relaxed">
                
                {/* Guitar */}
                <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#FFF4E4] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <span className="font-black uppercase text-[10px] tracking-wider text-zinc-800">Electric Lead Guitar Tone Chain</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 font-medium">
                    <li><strong className="text-zinc-800">Instrument:</strong> Active humbucker equipped solid-body (e.g., ESP Horizon, Ibanez RG series) tuned to drop C or half-step down.</li>
                    <li><strong className="text-zinc-800">Amplifier modeling:</strong> American High-Gain Stack (Mesa/Boogie Dual Rectifier or Marshall JCM800 combo).</li>
                    <li><strong className="text-zinc-800">Amp Settings:</strong> Gain: <code className="bg-zinc-200/60 px-1 rounded">7.5</code>, Bass: <code className="bg-zinc-200/60 px-1 rounded">6</code>, Middle: <code className="bg-zinc-200/60 px-1 rounded">4 (mid-scoop)</code>, Treble: <code className="bg-zinc-200/60 px-1 rounded">7</code>, Presence: <code className="bg-zinc-200/60 px-1 rounded">6</code>.</li>
                    <li><strong className="text-zinc-800">Pedals signal flow:</strong> Noise Gate <span className="text-zinc-300">→</span> Overdrive (Classic Tube Screamer style as tight mid-boost, Drive: 1, Level: 8.5) <span className="text-zinc-300">→</span> Stereo Chorus <span className="text-zinc-300">→</span> Digital Delay (380ms tap tempo, 3 repeats) <span className="text-zinc-300">→</span> Dense Plate Reverb.</li>
                  </ul>
                </div>

                {/* Bass */}
                <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#FFF4E4] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <span className="font-black uppercase text-[10px] tracking-wider text-zinc-800">Distorted Bass Gear Spec</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 font-medium">
                    <li><strong className="text-zinc-800">Instrument:</strong> Modern Active 4 or 5-String Bass (e.g., Dingwall, Fender Jazz Bass with active EQ).</li>
                    <li><strong className="text-zinc-800">Amplifier profile:</strong> Driven SVT Valve Amp (Ampeg SVT-CL or Fender Bassman).</li>
                    <li><strong className="text-zinc-800">Amp Settings:</strong> Gain: <code className="bg-zinc-200/60 px-1 rounded">6.5</code>, Blend/Dirt Drive: <code className="bg-zinc-200/60 px-1 rounded">7.0</code>, Bass: <code className="bg-zinc-200/60 px-1 rounded">8</code>, Mid: <code className="bg-zinc-200/60 px-1 rounded">5</code>, Treble: <code className="bg-zinc-200/60 px-1 rounded">6</code>.</li>
                    <li><strong className="text-zinc-800">Effects Chain:</strong> Optical Bass Compressor (sustained peak) <span className="text-zinc-300">→</span> Tech 21 SansAmp Bass Driver DI (emulating saturated tube buzz) <span className="text-zinc-300">→</span> Warm Analog Chorus (slow rate, thick depth for stereo expansion).</li>
                  </ul>
                </div>

                {/* Voice */}
                <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#FFF4E4] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <span className="font-black uppercase text-[10px] tracking-wider text-zinc-800">Vocal Processor & Distortion</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 font-medium">
                    <li><strong className="text-zinc-800">Signal processing:</strong> Studio Condenser mic fed into a pitch-correction unit (subtle Autotune preset tuned to Cm scale).</li>
                    <li><strong className="text-zinc-800">Eerie Distortion FX:</strong> Telephone Bandpass Filter on the secondary backing layer (cuts lows under 400Hz & highs above 4kHz to sound metallic/isolated).</li>
                    <li><strong className="text-zinc-800">Spatial effects:</strong> Visual-Kei style slapback delay (80ms single repeat) paired with a high-decay Hall Reverb to give an ethereal gothic stadium scale.</li>
                  </ul>
                </div>

                {/* Drums */}
                <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#FFF4E4] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <span className="font-black uppercase text-[10px] tracking-wider text-zinc-800">Drum Section Pattern</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 font-medium">
                    <li><strong className="text-zinc-800">Kit Style:</strong> Acoustic high-tension rock kit with heavy bronze cymbals and a dry, pingy metal snare.</li>
                    <li><strong className="text-zinc-800">Rhythm Structure:</strong> Driving double-bass drum kick rolls syncopated with a heavy snare smack on every 2 and 4 beat.</li>
                    <li><strong className="text-zinc-800">Dynamics:</strong> Closed-to-open hi-hat switches running 16th-note patterns, exploding into full crashes during the chorus royal lift.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Guitar synth playable meldody hook */}
            <div className="pt-5 border-t border-zinc-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">3. Live Melody Keyboard & Synth Tester</h4>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Click keys below to synthesize notes, or trigger the auto-guitar playalong.</p>
                </div>
                
                <div className="flex items-center gap-2.5 bg-zinc-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSynthType('guitar')}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${synthType === 'guitar' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800'}`}
                  >
                    🎸 Distorted Guitar Wave
                  </button>
                  <button
                    onClick={() => setSynthType('retro-8bit')}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${synthType === 'retro-8bit' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800'}`}
                  >
                    🎛️ Retro 8-bit Square
                  </button>
                </div>
              </div>

              {/* Play buttons */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[8px] font-black tracking-widest text-[#A0886F] uppercase">Melody Notes in C Minor:</span>
                <button
                  disabled={isPlayingMelodyLoop}
                  onClick={playDescendingLoveMelodyHook}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-black text-[9px] tracking-widest uppercase px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
                >
                  <Play size={10} fill="currentColor" /> {isPlayingMelodyLoop ? 'Playing Melody...' : 'Auto-Play Guitar Hook!'}
                </button>
              </div>

              {/* Interactive Virtual Melody Chord Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {descendingLoveNotes.map((note, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlayTone(note.freq)}
                    className="p-3.5 bg-zinc-50 hover:bg-cyan-50 border border-zinc-200 hover:border-cyan-400 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer group"
                  >
                    <span className="font-mono font-black text-sm text-zinc-800 group-hover:text-cyan-600 transition-colors">{note.label}</span>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{note.tag}</span>
                    <span className="text-[7px] text-zinc-400 font-mono mt-0.5">{note.freq.toFixed(1)} Hz</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Regional expansion Analysis breakdown */}
            <div className="pt-6 border-t border-zinc-100 space-y-4">
              <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">4. Core Regional Market Proposal Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium leading-relaxed">
                <div className="bg-[#FAF9F5] p-5 rounded-3xl space-y-1.5 border border-[#FFF4E4]">
                  <p className="font-extrabold text-[#293556] flex items-center gap-1.5">
                    🇯🇵 J-MARKET PROPOSAL
                  </p>
                  <p className="text-zinc-650">
                    Perfect fit for J-Rock curators or rhythm rhythm mobile games (such as Project Sekai or Bandori). Fits anime insert loops or midnight Tokyo FM.
                  </p>
                </div>
                <div className="bg-[#FAF9F5] p-5 rounded-3xl space-y-1.5 border border-[#FFF4E4]">
                  <p className="font-extrabold text-[#293556] flex items-center gap-1.5">
                    🇺🇸 NORTH AMERICA (NA)
                  </p>
                  <p className="text-zinc-650">
                    Introduce with "synthwave crossover guitar" branding. Target lovers of cyberpunk sci-fi games, retro midnight car-drive playlists, or dark indie-pop.
                  </p>
                </div>
                <div className="bg-[#FAF9F5] p-5 rounded-3xl space-y-1.5 border border-[#FFF4E4]">
                  <p className="font-extrabold text-[#293556] flex items-center gap-1.5">
                    🇧🇷 SOUTH AMERICA (SA)
                  </p>
                  <p className="text-zinc-650">
                    Heavy melodic-rock fans are extremely dedicated. Visual-kei style high-gain crunch matches classic rock-metal live-concert fandom perfectly. Highlight chord tensions.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
