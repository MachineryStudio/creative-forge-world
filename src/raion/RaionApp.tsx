/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Radio, 
  Library, 
  Gamepad2, 
  Settings, 
  Play, 
  User as UserIcon, 
  LogIn,
  Sparkles,
  Headphones,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Globe,
  Shield,
  Database,
  Waves,
  BarChart3,
  FileAudio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './lib/i18n';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './lib/auth';
import { dbService } from './services/dbService';
import { saveAudioBlob, deleteAudioBlob } from './services/audioStorage';
import { Song, Language, MusicDatabase } from './types';
import RaionRadioView from './components/RaionRadioView';
import MusicAnalysisView from './components/MusicAnalysisView';
import AnimeGameMovieGenreAnalysisView from './components/AnimeGameMovieGenreAnalysisView';
import SongForm from './components/SongForm';

type View = 'home' | 'search' | 'radio' | 'library' | 'games' | 'settings' | 'admin' | 'workspace' | 'raion_fm' | 'analysis' | 'genre_analysis';

function RaionTextLogo({ size = 'small' }: { size?: 'small' | 'large' }) {
  const containerClass = size === 'large' ? 'gap-2' : 'gap-0.5 scale-[0.35] origin-center';
  const headphonesSize = size === 'large' ? 64 : 36;
  const raionSize = size === 'large' ? 'text-5xl' : 'text-2xl';
  const kanjiSize = size === 'large' ? 'text-4xl' : 'text-xl';

  return (
    <div className={`flex flex-col items-center ${containerClass}`}>
      <Headphones size={headphonesSize} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      <div className="text-center leading-none">
        <h1 className={`${raionSize} font-black italic tracking-tighter uppercase neon-blue text-cyan-400`}>RAION</h1>
        <h2 className={`${kanjiSize} font-black italic tracking-tighter uppercase neon-red text-red-500`}>雷音</h2>
      </div>
    </div>
  );
}

function RaionMascot({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: size, height: size }} className="drop-shadow-2xl">
      {/* Eggshell Back */}
      <path d="M40 140 C40 180 160 180 160 140" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Character Body (Blue Cat) */}
      <circle cx="100" cy="100" r="70" fill="#ADE8FF" />
      
      {/* Ears */}
      <path d="M50 50 L75 40 L85 65 Z" fill="#ADE8FF" />
      <path d="M150 50 L125 40 L115 65 Z" fill="#ADE8FF" />
      {/* Inner Ears */}
      <path d="M55 55 L70 48 L75 60 Z" fill="#FFC0DB" />
      <path d="M145 55 L130 48 L125 60 Z" fill="#FFC0DB" />

      {/* Headphones */}
      <path d="M50 100 A 70 70 0 0 1 150 100" fill="none" stroke="#2C9DD1" strokeWidth="12" strokeLinecap="round" />
      <rect x="35" y="85" width="25" height="45" rx="10" fill="#2C9DD1" />
      <rect x="140" y="85" width="25" height="45" rx="10" fill="#2C9DD1" />
      
      {/* Eyes */}
      <circle cx="75" cy="105" r="15" fill="black" />
      <circle cx="125" cy="105" r="15" fill="black" />
      <circle cx="80" cy="100" r="5" fill="white" />
      <circle cx="130" cy="100" r="5" fill="white" />
      <circle cx="72" cy="112" r="3" fill="white" />
      <circle cx="122" cy="112" r="3" fill="white" />
      
      {/* Cheeks */}
      <circle cx="60" cy="125" r="8" fill="#FF83A4" opacity="0.6" />
      <circle cx="140" cy="125" r="8" fill="#FF83A4" opacity="0.6" />
      
      {/* Mouth */}
      <path d="M90 120 C95 125 100 125 100 120 C100 125 105 125 110 120" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />

      {/* Eggshell Front */}
      <path d="M30 140 L50 125 L75 135 L100 120 L125 135 L150 125 L170 140 C170 175 30 175 30 140 Z" fill="#FFF5F8" stroke="#FFD1DC" strokeWidth="4" />
      {/* Hearts on Egg */}
      <path d="M95 160 Q100 155 105 160 Q100 170 95 160" fill="#FF83A4" />
      <path d="M135 155 Q140 150 145 155 Q140 165 135 155" fill="#FF83A4" />
    </svg>
  );
}

function MainLayout() {
  const { t, i18n } = useTranslation();
  const { user, profile, signIn, logOut, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [listenUnlocked, setListenUnlocked] = useState(false);
  const [showPassGate, setShowPassGate] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);
  const [pendingSong, setPendingSong] = useState<Song | null>(null);

  useEffect(() => {
    let alive = true;
    import('@/lib/listenGate.functions')
      .then(({ listeningStatus }) => listeningStatus())
      .then((r) => { if (alive && r?.unlocked) setListenUnlocked(true); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);


  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio and end-of-track listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Sync audio with current song and play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong && isPlaying) {
      if (audio.src !== currentSong.streamUrl) {
        audio.src = currentSong.streamUrl;
      }
      audio.play().catch((err) => {
        console.warn("Audio play interrupted or stream link is blocked/expired:", err);
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const [activeDbId, setActiveDbId] = useState<string>(dbService.getActiveDatabaseId());
  const [databases, setDatabases] = useState<MusicDatabase[]>(dbService.getDatabases());
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [newDbForm, setNewDbForm] = useState({
    name: '',
    description: '',
    filterType: 'all' as 'all' | 'band' | 'genre' | 'none',
    filterValue: ''
  });

  const fetchSongs = async (adminView = false) => {
    const data = await dbService.getSongs(adminView);
    setSongs(data);
  };

  useEffect(() => {
    fetchSongs(currentView === 'admin');
  }, [currentView, activeDbId]);

  const handleSwitchDatabase = async (dbId: string) => {
    dbService.setActiveDatabaseId(dbId);
    setActiveDbId(dbId);
    await fetchSongs(currentView === 'admin');
  };

  const handleCreateDatabase = () => {
    if (!newDbForm.name.trim()) {
      setDbError("Database name is required.");
      return;
    }
    try {
      const newId = dbService.createDatabase(
        newDbForm.name,
        newDbForm.description,
        newDbForm.filterType,
        newDbForm.filterValue
      );
      setDatabases(dbService.getDatabases());
      handleSwitchDatabase(newId);
      setShowCreateDbModal(false);
      setNewDbForm({ name: '', description: '', filterType: 'all', filterValue: '' });
      setDbError(null);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An error occurred while creating database.";
      setDbError(errMsg);
    }
  };

  const handleDeleteDatabase = (dbId: string) => {
    try {
      dbService.deleteDatabase(dbId);
      setDatabases(dbService.getDatabases());
      const remainingActive = dbService.getActiveDatabaseId();
      setActiveDbId(remainingActive);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Cannot delete database";
      setDbError(errMsg);
    }
  };

  const [editingSong, setEditingSong] = useState<Partial<Song> | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);

  const handleSaveSong = async (
    songData: Partial<Song>,
    audioFile?: File | null,
    audioMeta?: { fileName: string; size: number; mimeType: string }
  ) => {
    let songId = editingSong?.id;
    if (!songId) {
      songId = 'song-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
      songData.id = songId;
    }

    if (audioFile) {
      const blobUrl = await saveAudioBlob(songId, audioFile, audioMeta?.fileName);
      songData.streamUrl = blobUrl;
      songData.isCustomAudio = true;
      songData.audioFileName = audioMeta?.fileName || audioFile.name;
      songData.audioFileSize = audioMeta?.size || audioFile.size;
      songData.audioMimeType = audioMeta?.mimeType || audioFile.type;
    } else if (songData.isCustomAudio === false && editingSong?.id) {
      // If the song was switched to URL mode or local audio removed
      await deleteAudioBlob(editingSong.id);
    }

    if (editingSong?.id) {
      await dbService.updateSong(editingSong.id, songData);
    } else {
      await dbService.addSong(songData);
    }
    await fetchSongs(currentView === 'admin');
    
    if (currentSong && currentSong.id === songId) {
      const updated = (await dbService.getSongs(true)).find(s => s.id === songId);
      if (updated) {
        setCurrentSong(updated);
      }
    }

    setIsAddingSong(false);
    setEditingSong(null);
  };

  const handleDeleteSong = (id: string) => {
    setSongToDelete(id);
  };

  const confirmDeleteSong = async () => {
    if (songToDelete) {
      await deleteAudioBlob(songToDelete);
      await dbService.deleteSong(songToDelete);
      setSongs(songs.filter(s => s.id !== songToDelete));
      setSongToDelete(null);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: t('home', 'Home') },
    { id: 'workspace', icon: Database, label: 'Workspace' },
    { id: 'genre_analysis', icon: Sparkles, label: 'Genre' },
    { id: 'analysis', icon: BarChart3, label: 'Analysis' },
    { id: 'raion_fm', icon: Waves, label: 'RAION 雷音' },
    { id: 'radio', icon: Radio, label: t('radio', 'Radio') },
    { id: 'games', icon: Gamepad2, label: t('games', 'Games') },
    { id: 'library', icon: Library, label: t('library', 'Library') },
    { id: 'settings', icon: Settings, label: t('settings', 'Settings') },
  ];

  if (profile?.isAdmin) {
    navItems.push({ id: 'admin', icon: UserIcon, label: 'Admin' });
  }

  const playNow = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    dbService.incrementPlayCount(song.id);
  };

  const handlePlaySong = (song: Song) => {
    if (!listenUnlocked) {
      setPendingSong(song);
      setPassInput('');
      setPassError(false);
      setShowPassGate(true);
      return;
    }
    playNow(song);
  };

  const submitPass = () => {
    if (passInput.trim() === 'cloudandre') {
      setListenUnlocked(true);
      if (typeof window !== 'undefined') sessionStorage.setItem('raion_listen_pass', 'ok');
      setShowPassGate(false);
      if (pendingSong) playNow(pendingSong);
      setPendingSong(null);
      setPassInput('');
    } else {
      setPassError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF0] flex items-center justify-center">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-12 h-12 bg-cyan-500 rounded-2xl"
         />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#1A1A1A] font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      {/* Header following kumaGO pattern */}
      <header className="p-6 flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-black rounded-2xl soft-shadow flex items-center justify-center p-1 border border-white/10 overflow-hidden">
             <RaionTextLogo />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">RAION 雷音 × LIGHTHOUSE 橋</p>
            <h1 className="text-2xl font-black tracking-tight leading-none italic uppercase">RAION <span className="text-cyan-500 italic">雷音</span></h1>
          </div>
        </div>
        <div className="flex gap-2">
          {!user ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-[#293556] text-[#ffffff] rounded-full px-5 py-2.5 soft-shadow flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:opacity-90 transition-all border border-white/10"
            >
              <LogIn size={14} /> {t('login', 'LOGIN')}
            </button>
          ) : (
            <button className="bg-white rounded-full px-4 py-2 soft-shadow flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-colors">
              <Sparkles size={14} className="text-cyan-400" /> {t('sleep', 'SLEEP')}
            </button>
          )}
        </div>
      </header>

      {/* Language Toggle following kumaGO pattern */}
      <div className="px-6 mb-6 overflow-x-auto no-scrollbar">
        <div className="bg-[#EAE6D6] p-1 rounded-full inline-flex gap-1 min-w-max">
           {[
             { code: 'en', label: 'EN' },
             { code: 'ja', label: '日本語' },
             { code: 'fr', label: 'FR' },
             { code: 'es', label: 'ES' },
             { code: 'zh', label: '中文' },
             { code: 'ko', label: '한국어' },
             { code: 'it', label: 'IT' },
             { code: 'ru', label: 'RU' }
           ].map((lang) => (
             <button 
               key={lang.code}
               onClick={() => i18n.changeLanguage(lang.code)}
               className={`px-6 py-1.5 rounded-full text-[10px] font-black transition-all ${i18n.language === lang.code ? 'bg-[#293556] text-white shadow-lg' : 'text-[#293556]'}`}
             >
               {lang.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 px-6">
        {/* Persistent Stream Player (Moved from bottom overlay to prevent blocking interactive controls in workspace) */}
        <div className="mb-6">
          <motion.div
             layout
             className="bg-white rounded-[35px] p-4 flex items-center gap-4 soft-shadow border border-zinc-100"
          >
            <div className="w-16 h-16 bg-[#FDFBF0] rounded-[22px] overflow-hidden flex-shrink-0 soft-shadow p-1">
               {currentSong ? (
                 <img src={currentSong.albumArtUrl || `https://picsum.photos/seed/${currentSong.id}/400`} className="w-full h-full object-cover rounded-xl animate-fade-in" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl" />
               )}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-black truncate uppercase text-lg italic tracking-tight">
                {currentSong ? (currentSong.songName[i18n.language as Language] || Object.values(currentSong.songName)[0]) : (
                  <>RADIO RAION <span className="text-red-500 neon-red">雷音</span></>
                )}
              </h4>
              <p className="text-[11px] font-bold text-cyan-600 truncate uppercase mt-0.5 tracking-widest">
                {currentSong ? (currentSong.singerName[i18n.language as Language] || Object.values(currentSong.singerName)[0]) : 'STORM PULSE'}
              </p>
            </div>
            <button
               onClick={() => {
                 if (!listenUnlocked) {
                   setPendingSong(currentSong);
                   setPassInput('');
                   setPassError(false);
                   setShowPassGate(true);
                   return;
                 }
                 setIsPlaying(!isPlaying);
               }}
               className="w-14 h-14 bg-[#293556] text-white rounded-[20px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all soft-shadow cursor-pointer"
             >
                {isPlaying ? <div className="w-5 h-6 flex gap-1.5 justify-center"><div className="w-2 h-full bg-white rounded-full" /><div className="w-2 h-full bg-white rounded-full" /></div> : <Play size={26} fill="white" className="ml-1" />}
            </button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' && (
              <section className="space-y-10">
                {/* Main Hero Card following kumaGO mascot layout */}
                <div className="bg-[#FFF4E4] rounded-[50px] p-8 soft-shadow relative overflow-hidden group">
                   <div className="absolute top-10 right-10">
                      <p className="text-3xl font-black text-[#A0886F] opacity-30 italic uppercase">Thunder</p>
                   </div>
                   <div className="flex flex-col items-center py-6">
                      <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="relative"
                      >
                        <div className="w-64 h-64 bg-white rounded-full soft-shadow flex items-center justify-center border-[8px] border-white overflow-hidden">
                           <RaionMascot size={220} />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-2xl soft-shadow font-black text-lg italic text-cyan-500">Zzz</div>
                      </motion.div>
                   </div>
                   
                   <div className="bg-white/80 backdrop-blur-md rounded-[30px] p-4 text-center soft-shadow mt-4">
                      <p className="font-bold text-[#A0886F]">{t('appName')} ... Feel the Thunder today ⚡</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter">こんにちは、{user?.displayName || 'User'} 先生だよ</h2>
                      <p className="text-zinc-500 font-medium text-xs">一緒に日本語ゲームを楽しもう。Feel the Radio ION soundstream.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                      <button
                        onClick={() => setCurrentView('genre_analysis')}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                      >
                        <Sparkles size={14} /> Genre Analysis
                      </button>
                      <button
                        onClick={() => setCurrentView('analysis')}
                        className="bg-[#293556] hover:bg-[#1a233a] text-white px-5 py-3 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                      >
                        <BarChart3 size={14} /> Music Matrix
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   {songs.map(song => (
                     <div 
                       key={song.id}
                       onClick={() => handlePlaySong(song)}
                       className="bg-white rounded-3xl p-5 soft-shadow flex items-center gap-4 group cursor-pointer hover:bg-zinc-50 transition-all border-l-8 border-cyan-500"
                     >
                        <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                           <img src={song.albumArtUrl || `https://picsum.photos/seed/${song.id}/400`} alt="art" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-lg leading-tight">{song.songName[i18n.language as Language] || Object.values(song.songName)[0]}</h4>
                           <p className="text-sm text-zinc-400 font-medium">{song.singerName[i18n.language as Language] || Object.values(song.singerName)[0]}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#293556] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                           <Play size={18} fill="white" className="ml-0.5" />
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )}

            {currentView === 'admin' && (
              <section className="space-y-8 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase animate-fade-in">Admin Panel</h2>
                  <button 
                    onClick={() => setIsAddingSong(true)}
                    className="bg-cyan-500 text-black px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={3} /> Add Song
                  </button>
                </div>

                {/* Professional Database Registries Widget */}
                <div className="bg-white p-8 rounded-[40px] soft-shadow border border-zinc-50 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight text-zinc-950">🗄️ Database Registries</h3>
                      <p className="text-zinc-500 font-medium text-xs mt-1">
                        Active Database ID: <code className="bg-zinc-100 font-mono px-2 py-0.5 rounded text-[10px] text-cyan-600 font-bold">{activeDbId}</code>
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowCreateDbModal(true)}
                      className="bg-[#293556] text-white px-5 py-2.5 rounded-full flex items-center justify-center gap-2 font-black uppercase text-[9px] tracking-widest shadow-md cursor-pointer self-start transition-all hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <Plus size={12} strokeWidth={3} /> Create Database
                    </button>
                  </div>

                  {dbError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-[10px] font-bold">
                      ⚠️ {dbError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {databases.map((db) => {
                      const isActive = db.id === activeDbId;
                      return (
                        <div 
                          key={db.id} 
                          className={`p-5 rounded-[28px] border-2 transition-all flex flex-col justify-between cursor-pointer ${isActive ? 'bg-cyan-50/50 border-cyan-400' : 'bg-zinc-50/30 border-zinc-100 hover:bg-zinc-50'}`}
                          onClick={() => handleSwitchDatabase(db.id)}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-extrabold italic uppercase text-sm">{db.name}</h4>
                              {isActive && (
                                <span className="bg-[#293556] text-white font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">Active</span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-500 font-medium mt-1.5 leading-relaxed">{db.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center">
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">
                              {db.filterType === 'all' ? 'Universal DB' : `Filter: ${db.filterType} = ${db.filterValue}`}
                            </span>
                            {db.id !== 'db-default' && db.id !== 'db-cloud-tears' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDatabase(db.id);
                                }}
                                className="text-red-500 hover:text-red-700 text-[9px] font-black uppercase tracking-wider p-1"
                              >
                                Delete DB
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Database Explorer (Songs in {databases.find(d => d.id === activeDbId)?.name || 'Active DB'})</h3>
                  {songs.length === 0 ? (
                    <div className="bg-white/50 border border-dashed border-zinc-200 p-12 rounded-[35px] text-center">
                      <p className="text-sm font-bold text-zinc-400">This database contains no tracks yet.</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Click "Add Song" above to create tracks inside this database.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {songs.map(song => (
                        <div key={song.id} className="bg-white p-6 rounded-[35px] soft-shadow flex items-center gap-4 group border border-zinc-50">
                          <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                             <img src={song.albumArtUrl || `https://picsum.photos/seed/${song.id}/400`} alt="art" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 flex-wrap">
                               <h4 className="font-black italic uppercase truncate text-lg tracking-tight">
                                 {song.songName.en} <span className="text-zinc-300 mx-1">|</span> <span className="text-zinc-400 font-noto">{song.songName.ja}</span>
                               </h4>
                               {song.isCustomAudio ? (
                                 <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                   <FileAudio size={10} /> Local Audio Master
                                 </span>
                               ) : (
                                 <span className="bg-zinc-100 text-zinc-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                                   Stream URL
                                 </span>
                               )}
                             </div>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                               {song.singerName.en} • {song.duration}s {song.audioFileName ? `• ${song.audioFileName}` : ''}
                             </p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => setEditingSong(song)}
                               className="p-3 bg-zinc-100 text-zinc-600 rounded-2xl hover:bg-zinc-200 transition-colors"
                             >
                               <Edit size={16} />
                             </button>
                             <button 
                               onClick={() => handleDeleteSong(song.id)}
                               className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                             >
                               <Trash2 size={16} />
                             </button>
                             {song.artistOfficialUrl && (
                               <a 
                                 href={song.artistOfficialUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="p-3 bg-cyan-50 text-cyan-500 rounded-2xl hover:bg-cyan-100 transition-colors"
                               >
                                 <ExternalLink size={16} />
                               </a>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#FFF4E4] p-10 rounded-[50px] soft-shadow text-center">
                   <Globe size={48} className="mx-auto text-[#A0886F] mb-6 opacity-30" />
                   <h3 className="text-2xl font-black italic uppercase mb-2">Global Pipeline</h3>
                   <p className="text-zinc-500 font-medium max-w-xs mx-auto text-sm">You are managing the core audio stream for RAION 雷音. Ensure all links are direct streamable assets.</p>
                </div>
              </section>
            )}

            {currentView === 'workspace' && (
              <section className="space-y-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#FFF4E4] p-8 rounded-[40px] soft-shadow gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 animate-pulse">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      <span className="text-[9px] font-black tracking-widest text-[#A0886F] uppercase">System Workspace Active ⚡</span>
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase text-zinc-950">MUSIC WORKS</h2>
                    <p className="text-[#A0886F] font-bold text-xs max-w-sm">
                      Select and explore any live database instance organized by band catalog, bands or music styles.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setCurrentView('genre_analysis')}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                    >
                      <Sparkles size={15} /> Genre Analysis
                    </button>
                    <button
                      onClick={() => setCurrentView('analysis')}
                      className="bg-[#293556] hover:bg-[#1a233a] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                    >
                      <BarChart3 size={15} /> Music Matrix
                    </button>
                    <Database size={56} className="text-[#A0886F] opacity-35 hidden sm:block flex-shrink-0" />
                  </div>
                </div>

                {/* Database Switcher for Customer/User */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Switch Databases / Band Catalogs</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {databases.map((db) => {
                      const isActive = db.id === activeDbId;
                      return (
                        <button
                          key={db.id}
                          onClick={() => handleSwitchDatabase(db.id)}
                          className={`px-6 py-4 rounded-[26px] font-bold text-xs uppercase tracking-wider transition-all border shrink-0 flex items-center gap-3 ${isActive ? 'bg-[#293556] text-white border-transparent shadow-lg shadow-blue-900/10 scale-105' : 'bg-white text-zinc-700 border-zinc-100 hover:bg-zinc-50'}`}
                        >
                          <Database size={14} className={isActive ? 'text-cyan-400' : 'text-zinc-400'} />
                          <div className="text-left">
                            <p className="font-extrabold">{db.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Database Metadata detail */}
                {(() => {
                  const activeDbObj = databases.find(d => d.id === activeDbId) || databases[0];
                  return activeDbObj ? (
                    <div className="bg-white p-6 rounded-[35px] soft-shadow border border-zinc-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[8px] font-black bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Type: {activeDbObj.filterType === 'all' ? 'Universal Database' : `Filter: ${activeDbObj.filterType} = ${activeDbObj.filterValue}`}
                          </span>
                          <span className="text-[8px] font-black bg-[#293556]/10 text-[#293556] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Tracks: {songs.length}
                          </span>
                        </div>
                        <p className="text-zinc-500 font-medium text-xs mt-2.5 leading-relaxed">{activeDbObj.description}</p>
                      </div>
                      <div className="text-xs font-bold text-zinc-400 shrink-0 self-end sm:self-auto bg-zinc-50 px-4 py-2 rounded-2xl">
                        ID: <code className="font-mono text-zinc-600">{activeDbObj.id}</code>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Songs listed for active workspace database */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{databases.find(d => d.id === activeDbId)?.name || 'Universal'} Catalog List</h3>
                  {songs.length === 0 ? (
                    <div className="bg-white/50 border border-dashed border-zinc-200 p-12 rounded-[35px] text-center">
                      <p className="text-sm font-bold text-zinc-400">This database contains no tracks yet.</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Sign-in as Administrator in settings to seed/register songs in this custom database.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {songs.map(song => (
                        <div 
                          key={song.id}
                          onClick={() => handlePlaySong(song)}
                          className="bg-white rounded-[32px] p-5 soft-shadow flex items-center gap-4 group cursor-pointer hover:bg-zinc-50 transition-all border-l-8 border-cyan-500"
                        >
                          <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                            <img src={song.albumArtUrl || `https://picsum.photos/seed/${song.id}/400`} alt="art" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg leading-tight truncate">{song.songName[i18n.language as Language] || Object.values(song.songName)[0]}</h4>
                            <p className="text-sm text-zinc-400 font-medium truncate mt-0.5">{song.singerName[i18n.language as Language] || Object.values(song.singerName)[0]}</p>
                          </div>
                          <div className="w-10 h-10 bg-[#293556] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0 shadow-md">
                            <Play size={18} fill="white" className="ml-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
            
            {currentView === 'radio' && (
               <section className="py-10 text-center">
                  <div className="w-full aspect-square bg-white rounded-[50px] soft-shadow flex items-center justify-center mb-10 overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-50" />
                     <Radio size={120} className="text-cyan-500 animate-pulse relative z-10" />
                  </div>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">RADIO RAION</h2>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-red-500 neon-red mb-4">雷音</h3>
                  <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Streaming Worldwide Radio</p>
                  <button className="mt-10 w-full bg-[#293556] text-white font-black p-6 rounded-[30px] uppercase tracking-widest shadow-xl shadow-cyan-900/20">
                     Enter the Pulse
                  </button>
               </section>
            )}

            {currentView === 'raion_fm' && (
              <RaionRadioView songs={songs} onPlaySong={handlePlaySong} isAdmin={!!profile?.isAdmin} />
            )}

            {currentView === 'genre_analysis' && (
              <AnimeGameMovieGenreAnalysisView 
                songs={songs} 
                currentPlayingSong={currentSong} 
                isPlaying={isPlaying} 
                onPlaySong={handlePlaySong} 
              />
            )}

            {currentView === 'analysis' && (
              <MusicAnalysisView 
                songs={songs} 
                currentPlayingSong={currentSong} 
                isPlaying={isPlaying} 
                onPlaySong={handlePlaySong} 
              />
            )}

            {currentView === 'settings' && (
              <section className="space-y-10 py-6">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Settings</h2>
                <div className="space-y-4">
                  {!user ? (
                    <div className="bg-white p-8 rounded-[40px] soft-shadow text-center space-y-6">
                       <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto flex items-center justify-center">
                          <UserIcon size={32} className="text-zinc-300" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black italic uppercase">You are not logged in</h3>
                          <p className="text-zinc-400 text-xs font-bold mt-1">Sign in to save your library and progress</p>
                       </div>
                       <button 
                         onClick={() => setShowLoginModal(true)}
                         className="w-full bg-[#293556] text-white font-black p-5 rounded-[30px] uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                       >
                         🔑 Choose Access: User / Admin (CRUD DB)
                       </button>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-[40px] soft-shadow flex items-center gap-4">
                       <img src={user.photoURL || ''} className="w-16 h-16 rounded-3xl soft-shadow" alt="profile" />
                       <div className="flex-1">
                          <p className="font-black text-xl italic uppercase font-noto leading-tight">{user.displayName}</p>
                          <p className="text-xs text-zinc-400 font-bold">{user.email}</p>
                       </div>
                    </div>
                  )}
                  
                  <div className="bg-white p-8 rounded-[40px] soft-shadow space-y-6">
                     <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Account Tier</p>
                        <div className="flex justify-between items-center bg-[#FDFBF0] p-4 rounded-3xl">
                           <span className="font-black italic uppercase">Basic Member</span>
                           <button className="bg-cyan-500 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Upgrade</button>
                        </div>
                     </div>
                     
                     <div className="pt-4">
                        <button 
                          onClick={() => {
                            logOut();
                            setCurrentView('home');
                          }}
                          className="w-full bg-red-50 text-red-500 font-black p-5 rounded-[30px] uppercase tracking-widest text-xs hover:bg-red-100 transition-colors"
                        >
                          {t('logout', 'Sign Out (ログアウト)')}
                        </button>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-20">
                   <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center p-3 mb-4 soft-shadow">
                      <div className="w-full h-full bg-cyan-400 rounded-lg" />
                   </div>
                   <p className="font-black text-lg italic uppercase">LIGHTHOUSE 橋</p>
                   <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400">PROTOTYPE SOFTWARE PIPELINE</p>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>



      {/* Bottom Nav following kumaGO theme but refined */}
      <nav className="bg-white/80 backdrop-blur-2xl border-t border-zinc-100 fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center p-3 pb-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex flex-col items-center gap-1.5 p-2 transition-all group ${isActive ? 'text-[#293556]' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <div className="relative p-2 rounded-2xl group-hover:bg-zinc-50 transition-colors">
                <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-[#293556]/5 rounded-2xl -z-10"
                  />
                )}
              </div>
              {isActive && (
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Listening Pass Gate */}
      <AnimatePresence>
        {showPassGate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPassGate(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FDFBF0] rounded-[32px] max-w-xs w-full p-6 relative z-10 soft-shadow border border-zinc-200 text-center"
            >
              <h3 className="text-lg font-black italic uppercase tracking-tighter">Listening Pass</h3>
              <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest mt-1">
                視聴パスキーが必要です
              </p>
              <p className="text-xs text-zinc-500 font-medium mt-2">
                Songs are visible to everyone, but playback requires a passkey.
              </p>
              <input
                type="password"
                autoFocus
                value={passInput}
                onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitPass(); }}
                placeholder="PASSKEY"
                className="w-full mt-4 px-4 py-3 rounded-2xl bg-white border border-zinc-300 text-sm font-mono tracking-widest text-center outline-none focus:border-cyan-500"
              />
              {passError && (
                <p className="text-[11px] font-black uppercase text-red-500 mt-2 tracking-wider">
                  Incorrect passkey · パスキーが違います
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPassGate(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-zinc-200 text-zinc-700 font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPass}
                  className="flex-1 px-4 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Unlock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Control Modal for dynamic access selection */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />
            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FDFBF0] rounded-[40px] max-w-md w-full p-8 relative z-10 soft-shadow border border-zinc-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black rounded-3xl mx-auto flex items-center justify-center mb-4 soft-shadow p-1 border border-white/5 overflow-hidden">
                  <RaionTextLogo />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Select Access Portal</h3>
                <p className="text-zinc-500 font-medium text-xs mt-1 font-mono">Simulate Standard / Owner Permissions</p>
              </div>

              <div className="space-y-4">
                {/* Standard Listener mode */}
                <button
                  onClick={async () => {
                    await signIn(false);
                    setShowLoginModal(false);
                    setCurrentView('home');
                  }}
                  className="w-full text-left bg-white hover:bg-zinc-50 border-2 border-zinc-100 hover:border-cyan-400 p-5 rounded-[28px] flex items-center gap-4 transition-all group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-cyan-50 transition-colors flex-shrink-0">
                    <Headphones className="text-zinc-400 group-hover:text-cyan-500 transition-colors" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm">Standard Listener</h4>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">Browse the live dashboard, play songs, and experience custom content.</p>
                  </div>
                </button>

                {/* Administrative DB & CRUD mode */}
                <button
                  onClick={async () => {
                    await signIn(true);
                    setShowLoginModal(false);
                    setCurrentView('admin');
                  }}
                  className="w-full text-left bg-white hover:bg-zinc-55 border-2 border-zinc-100 hover:border-purple-400 p-5 rounded-[28px] flex items-center gap-4 transition-all group shadow-sm hover:shadow-md cursor-pointer animate-pulse"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors flex-shrink-0">
                    <Shield className="text-purple-500 transition-colors animate-bounce" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold uppercase text-sm text-purple-900">Admin (Friendly DB CRUD)</h4>
                      <span className="bg-purple-500 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded-full tracking-wider shadow-sm shadow-purple-500/20">Owner Access</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">Manage records. Create, update, or remove tracks from the database instantly.</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-6 w-full text-center text-zinc-400 hover:text-zinc-600 text-xs font-black uppercase tracking-wider py-2 cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Beautiful Custom Confirm Delete Dialog Modal */}
      <AnimatePresence>
        {songToDelete !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSongToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FDFBF0] rounded-[40px] max-w-sm w-full p-8 relative z-[70] soft-shadow border border-zinc-200 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl mx-auto flex items-center justify-center mb-6">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-black italic tracking-tighter uppercase text-zinc-950">Delete Track?</h3>
              <p className="text-zinc-500 font-medium text-xs mt-2 max-w-[240px] mx-auto leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-zinc-950">"{songs.find(s => s.id === songToDelete)?.songName.en || 'this song'}"</span>? This will permanently erase it from our catalog.
              </p>

              <div className="space-y-3 mt-6">
                <button
                  onClick={confirmDeleteSong}
                  className="w-full bg-red-500 hover:bg-red-650 text-white font-black py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-[9px] cursor-pointer shadow-md shadow-red-500/10"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setSongToDelete(null)}
                  className="w-full bg-white border-2 border-zinc-100 text-zinc-400 hover:text-zinc-600 font-black py-4 px-6 rounded-2xl transition-all uppercase tracking-widest text-[9px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant Create Database Modal */}
      <AnimatePresence>
        {showCreateDbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowCreateDbModal(false); setDbError(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Form Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              className="bg-[#FDFBF0] rounded-[45px] max-w-lg w-full p-8 md:p-10 relative z-10 soft-shadow border border-zinc-200 overflow-hidden text-zinc-950"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-zinc-950">🗄️ Register New DB</h3>
                  <p className="text-zinc-500 font-medium text-xs mt-1">Structure songs by categorizing bands or genres.</p>
                </div>

                {dbError && (
                  <div className="p-3.5 bg-red-50 border border-red-150 text-red-600 rounded-2xl text-[10px] font-bold">
                    ⚠️ {dbError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Database Name</label>
                    <input 
                      required
                      placeholder="e.g. Band CLOUD-TEARS, Visual-Kei Classics..."
                      className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-sm text-zinc-800"
                      value={newDbForm.name}
                      onChange={e => setNewDbForm({ ...newDbForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Description</label>
                    <textarea 
                      placeholder="e.g. Dedicated library of dynamic audio tracks for this band/genre..."
                      className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-xs text-zinc-800 min-h-[75px]"
                      value={newDbForm.description}
                      onChange={e => setNewDbForm({ ...newDbForm, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400">Database Seeding Type</label>
                      <select 
                        className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-xs text-zinc-800"
                        value={newDbForm.filterType}
                        onChange={e => setNewDbForm({ ...newDbForm, filterType: e.target.value as 'all' | 'band' | 'genre' | 'none' })}
                      >
                        <option value="all">Universal Seeds (Clone Default)</option>
                        <option value="band">Band Filter</option>
                        <option value="genre">Genre Filter</option>
                        <option value="none">Empty Database</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400">Filter Value / Identifier</label>
                      <input 
                        disabled={newDbForm.filterType === 'all' || newDbForm.filterType === 'none'}
                        placeholder={newDbForm.filterType === 'band' ? 'CLOUD-TEARS' : (newDbForm.filterType === 'genre' ? 'visual-kei' : 'None needed')}
                        className="w-full bg-zinc-50 border-none p-4 rounded-2xl font-bold text-xs text-zinc-800 disabled:opacity-40"
                        value={newDbForm.filterValue}
                        onChange={e => setNewDbForm({ ...newDbForm, filterValue: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={handleCreateDatabase}
                    className="flex-1 bg-[#293556] text-white font-black p-4 rounded-[22px] uppercase tracking-widest text-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Confirm DB Creation
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowCreateDbModal(false); setDbError(null); }}
                    className="bg-zinc-100 text-zinc-400 font-bold px-6 rounded-[22px] uppercase tracking-widest text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant Add/Edit Song Form Modal */}
      <AnimatePresence>
        {(isAddingSong || editingSong !== null) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingSong(false); setEditingSong(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Form Drawer box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              className="bg-[#FDFBF0] rounded-[45px] max-w-xl w-full p-8 md:p-10 relative z-10 soft-shadow border border-zinc-200 object-contain max-h-[85vh] overflow-y-auto scrollbar-none"
            >
              <SongForm 
                song={editingSong || undefined} 
                onSave={handleSaveSong} 
                onCancel={() => { setIsAddingSong(false); setEditingSong(null); }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

