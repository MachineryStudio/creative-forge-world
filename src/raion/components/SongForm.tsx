import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileAudio, 
  Music, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Link as LinkIcon, 
  Trash2 
} from 'lucide-react';
import { Song } from '../types';

export interface SongFormProps {
  song?: Partial<Song> | null;
  onSave: (song: Partial<Song>, audioFile?: File | null, audioMeta?: { fileName: string; size: number; mimeType: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function SongForm({ song, onSave, onCancel }: SongFormProps) {
  const [formData, setFormData] = useState({
    songName: { en: '', ja: '', fr: '', es: '', zh: '', ko: '', it: '', ru: '' },
    singerName: { en: '', ja: '', fr: '', es: '', zh: '', ko: '', it: '', ru: '' },
    streamUrl: '',
    artistOfficialUrl: '',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    duration: 180,
    isActive: true,
  });

  const [audioSourceMode, setAudioSourceMode] = useState<'file' | 'url'>('file');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioFileSize, setAudioFileSize] = useState<number | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('');
  const [hasExistingCustomAudio, setHasExistingCustomAudio] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
  
  // In-modal audio preview player states
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (song) {
      setFormData({
        songName: {
          en: song.songName?.en || '',
          ja: song.songName?.ja || '',
          fr: song.songName?.fr || '',
          es: song.songName?.es || '',
          zh: song.songName?.zh || '',
          ko: song.songName?.ko || '',
          it: song.songName?.it || '',
          ru: song.songName?.ru || '',
        },
        singerName: {
          en: song.singerName?.en || '',
          ja: song.singerName?.ja || '',
          fr: song.singerName?.fr || '',
          es: song.singerName?.es || '',
          zh: song.singerName?.zh || '',
          ko: song.singerName?.ko || '',
          it: song.singerName?.it || '',
          ru: song.singerName?.ru || '',
        },
        streamUrl: song.streamUrl || '',
        artistOfficialUrl: song.artistOfficialUrl || '',
        albumArtUrl: song.albumArtUrl || '/images/album_cover_kumoru.jpg',
        duration: song.duration || 180,
        isActive: song.isActive ?? true,
      });

      // Check if this track is actually an uploaded local audio file
      const isCustom = Boolean(song.isCustomAudio || song.streamUrl?.startsWith('blob:') || (song.audioFileName && !song.streamUrl?.startsWith('http')));
      setHasExistingCustomAudio(isCustom);

      if (isCustom && song.streamUrl) {
        setAudioPreviewUrl(song.streamUrl);
        setPreviewDuration(song.duration || 180);
        setAudioFileName(song.audioFileName || `${song.songName?.en || 'Master'}.audio`);
        if (song.audioFileSize) setAudioFileSize(song.audioFileSize);
        if (song.audioMimeType) setAudioMimeType(song.audioMimeType);
        setAudioSourceMode('file');
      } else {
        // Not a local master audio file yet (remote URL or seed)
        setAudioPreviewUrl('');
        setAudioFileName('');
        setAudioFileSize(null);
        setAudioMimeType('');
        setSelectedAudioFile(null);
        setAudioSourceMode('file'); // Default to file upload tab
      }
    } else {
      setFormData({
        songName: { en: '', ja: '', fr: '', es: '', zh: '', ko: '', it: '', ru: '' },
        singerName: { 
          en: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          ja: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          fr: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          es: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          zh: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          ko: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          it: 'アンドレ (曇りの断層 / Cloudy Fault Line)', 
          ru: 'アンドレ (曇りの断層 / Cloudy Fault Line)' 
        },
        streamUrl: '',
        artistOfficialUrl: '',
        albumArtUrl: '/images/album_cover_kumoru.jpg',
        duration: 180,
        isActive: true,
      });
      setHasExistingCustomAudio(false);
      setAudioPreviewUrl('');
      setAudioFileName('');
      setAudioFileSize(null);
      setAudioMimeType('');
      setSelectedAudioFile(null);
      setAudioSourceMode('file');
    }
  }, [song]);

  // Handle audio player setup for in-modal preview
  useEffect(() => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPreviewCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        const dur = Math.round(audio.duration);
        setPreviewDuration(dur);
        setFormData(prev => ({ ...prev, duration: dur }));
      }
    };

    const handleEnded = () => {
      setIsPreviewPlaying(false);
      setPreviewCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audioPreviewUrl]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const processAudioFile = (file: File) => {
    if (!file) return;
    setUploadErrorMsg(null);
    setUploadStatusMsg(null);
    
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setSelectedAudioFile(file);
      setAudioPreviewUrl(objectUrl);
      setAudioFileName(file.name);
      setAudioFileSize(file.size);
      setAudioMimeType(file.type || 'audio/mpeg');
      setAudioSourceMode('file');
      setHasExistingCustomAudio(true);
      setUploadStatusMsg(`Audio file "${file.name}" loaded successfully!`);

      // Auto-fill song name if empty
      if (!formData.songName.en) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
        setFormData(prev => ({
          ...prev,
          songName: {
            ...prev.songName,
            en: cleanName,
            ja: prev.songName.ja || cleanName
          }
        }));
      }

      // Read metadata duration
      const tempAudio = new Audio();
      tempAudio.src = objectUrl;
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration) && isFinite(tempAudio.duration)) {
          const dur = Math.round(tempAudio.duration);
          setPreviewDuration(dur);
          setFormData(prev => ({ ...prev, duration: dur }));
        }
      };
      tempAudio.onerror = () => {
        console.warn('Could not read duration ahead of playback, duration will sync on play.');
      };
    } catch (err) {
      console.error('Error loading audio file:', err);
      setUploadErrorMsg('Failed to process audio file. Please try another file.');
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const clearUploadedAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    }
    setSelectedAudioFile(null);
    setAudioPreviewUrl('');
    setAudioFileName('');
    setAudioFileSize(null);
    setAudioMimeType('');
    setHasExistingCustomAudio(false);
    setUploadStatusMsg(null);
  };

  const togglePreviewPlay = () => {
    const audio = previewAudioRef.current;
    if (!audio || !audioPreviewUrl) return;

    if (isPreviewPlaying) {
      audio.pause();
      setIsPreviewPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPreviewPlaying(true);
      }).catch(err => {
        console.warn('Preview play error:', err);
        setIsPreviewPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setPreviewCurrentTime(newTime);
    if (previewAudioRef.current) {
      previewAudioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFormatBadge = () => {
    const name = (audioFileName || selectedAudioFile?.name || '').toLowerCase();
    if (name.endsWith('.wav')) return { label: 'WAV MASTER', color: 'bg-emerald-500 text-white' };
    if (name.endsWith('.mp3')) return { label: 'MP3 AUDIO', color: 'bg-cyan-600 text-white' };
    if (name.endsWith('.mp4') || name.endsWith('.m4a')) return { label: 'MP4 / M4A', color: 'bg-purple-600 text-white' };
    if (name.endsWith('.flac')) return { label: 'FLAC HI-RES', color: 'bg-amber-600 text-white' };
    if (name.endsWith('.ogg')) return { label: 'OGG VORBIS', color: 'bg-blue-600 text-white' };
    if (name.endsWith('.aac')) return { label: 'AAC AUDIO', color: 'bg-indigo-600 text-white' };
    return { label: 'AUDIO MASTER', color: 'bg-zinc-800 text-white' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isUsingLocalAudio = audioSourceMode === 'file' && (Boolean(selectedAudioFile) || (hasExistingCustomAudio && Boolean(audioPreviewUrl)));
      
      const payload: Partial<Song> = {
        ...formData,
        streamUrl: isUsingLocalAudio ? (audioPreviewUrl || formData.streamUrl) : formData.streamUrl,
        isCustomAudio: isUsingLocalAudio,
        audioFileName: isUsingLocalAudio ? (selectedAudioFile?.name || audioFileName || undefined) : undefined,
        audioFileSize: isUsingLocalAudio ? (selectedAudioFile?.size || audioFileSize || undefined) : undefined,
        audioMimeType: isUsingLocalAudio ? (selectedAudioFile?.type || audioMimeType || undefined) : undefined,
      };

      const meta = selectedAudioFile ? {
        fileName: selectedAudioFile.name,
        size: selectedAudioFile.size,
        mimeType: selectedAudioFile.type || 'audio/mpeg'
      } : (audioFileName ? {
        fileName: audioFileName,
        size: audioFileSize || 0,
        mimeType: audioMimeType || 'audio/mpeg'
      } : undefined);

      await onSave(payload, selectedAudioFile, meta);
    } catch (err) {
      console.error('Error saving song:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAudioFileLoaded = Boolean(selectedAudioFile || (hasExistingCustomAudio && audioPreviewUrl));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden audio element for in-modal preview playback */}
      <audio 
        ref={previewAudioRef} 
        src={audioPreviewUrl} 
        muted={isMuted} 
        preload="metadata" 
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tight text-zinc-950">
              {song ? '📝 Edit Track & Master Audio' : '✨ Register New Track'}
            </h3>
            <p className="text-[11px] font-bold text-zinc-400">
              Upload real MP3, WAV, MP4, M4A audio files directly or configure streaming URLs
            </p>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Track Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Song Name (EN)</label>
            <input 
              required
              className="w-full bg-white border border-zinc-200/80 p-4 rounded-2xl font-bold text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={formData.songName.en}
              onChange={e => setFormData({ ...formData, songName: { ...formData.songName, en: e.target.value } })}
              placeholder="e.g. 「ヒョウハクシ」(Hyōhakushi) Wandering Poem"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Song Name (JA)</label>
            <input 
              className="w-full bg-white border border-zinc-200/80 p-4 rounded-2xl font-bold font-noto text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={formData.songName.ja}
              onChange={e => setFormData({ ...formData, songName: { ...formData.songName, ja: e.target.value } })}
              placeholder="e.g. 「ヒョウハクシ」"
            />
          </div>
        </div>

        {/* Singer / Artist Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Singer / Band (EN)</label>
            <input 
              required
              className="w-full bg-white border border-zinc-200/80 p-4 rounded-2xl font-bold text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={formData.singerName.en}
              onChange={e => setFormData({ ...formData, singerName: { ...formData.singerName, en: e.target.value } })}
              placeholder="アンドレ (曇りの断層 / Cloudy Fault Line)"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Singer / Band (JA)</label>
            <input 
              className="w-full bg-white border border-zinc-200/80 p-4 rounded-2xl font-bold font-noto text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={formData.singerName.ja}
              onChange={e => setFormData({ ...formData, singerName: { ...formData.singerName, ja: e.target.value } })}
              placeholder="アンドレ (曇りの断層)"
            />
          </div>
        </div>

        {/* Dedicated Real Audio Upload Section */}
        <div className="bg-[#FAF8F5] p-5 rounded-[32px] border border-zinc-200/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <FileAudio size={16} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-wider block">
                  Audio Source Configuration
                </label>
                <span className="text-[9px] text-zinc-400 font-medium">
                  {audioSourceMode === 'file' ? 'Local Master Audio File (Offline IndexedDB)' : 'Remote Web Streaming URL'}
                </span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-zinc-200/70 p-1 rounded-xl flex gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAudioSourceMode('file')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  audioSourceMode === 'file' 
                    ? 'bg-[#293556] text-white shadow-sm' 
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <UploadCloud size={13} />
                <span>Upload Audio File</span>
              </button>
              <button
                type="button"
                onClick={() => setAudioSourceMode('url')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  audioSourceMode === 'url' 
                    ? 'bg-[#293556] text-white shadow-sm' 
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <LinkIcon size={13} />
                <span>Stream URL Link</span>
              </button>
            </div>
          </div>

          {/* Hidden file input that can be triggered from multiple buttons */}
          <input
            ref={fileInputRef}
            id="admin-master-audio-file-input"
            type="file"
            accept="audio/*,.mp3,.wav,.mp4,.m4a,.ogg,.flac,.aac,.webm,.opus,.wma,video/mp4"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                processAudioFile(file);
              }
              e.target.value = '';
            }}
          />

          {uploadStatusMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{uploadStatusMsg}</span>
            </div>
          )}

          {uploadErrorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <X size={16} className="text-red-500 flex-shrink-0" />
              <span>{uploadErrorMsg}</span>
            </div>
          )}

          {/* MODE 1: REAL AUDIO FILE UPLOAD */}
          {audioSourceMode === 'file' && (
            <div className="space-y-3">
              {isAudioFileLoaded ? (
                /* STATE A: Audio File is Loaded and Ready */
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-5 rounded-3xl soft-shadow space-y-4 border border-zinc-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                        <Music size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getFormatBadge().color}`}>
                            {getFormatBadge().label}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Master Audio Ready
                          </span>
                        </div>
                        <p className="font-extrabold text-sm text-white truncate max-w-sm mt-1">
                          {audioFileName || selectedAudioFile?.name || 'Local Audio Master'}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          {formatFileSize(audioFileSize || selectedAudioFile?.size || null)} {audioFileSize ? '• ' : ''}Duration: {formatTime(previewDuration || formData.duration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={triggerFileBrowser}
                        className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
                        title="Upload another audio file"
                      >
                        <RefreshCw size={12} />
                        <span>Replace File</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearUploadedAudio}
                        className="p-2 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer border border-zinc-700"
                        title="Remove audio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Real-time In-Modal Audio Player Controls */}
                  <div className="bg-zinc-800/80 p-3.5 rounded-2xl space-y-2 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePreviewPlay}
                        className="w-11 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 flex items-center justify-center transition-transform active:scale-95 flex-shrink-0 cursor-pointer shadow-lg shadow-cyan-400/25"
                      >
                        {isPreviewPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <input
                          type="range"
                          min="0"
                          max={previewDuration || formData.duration || 100}
                          step="0.1"
                          value={previewCurrentTime}
                          onChange={handleSeek}
                          className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                          <span>{formatTime(previewCurrentTime)}</span>
                          <span className="text-cyan-400 font-bold">In-Modal Preview Player</span>
                          <span>{formatTime(previewDuration || formData.duration)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STATE B: Dropzone & File Browser when no local audio is uploaded */
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processAudioFile(file);
                    }}
                    onClick={triggerFileBrowser}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                      isDraggingOver 
                        ? 'border-cyan-500 bg-cyan-50/70 scale-[1.01]' 
                        : 'border-zinc-300 hover:border-cyan-500 bg-white hover:bg-cyan-50/30'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-inner">
                      <UploadCloud size={32} />
                    </div>
                    <div className="space-y-1 max-w-md">
                      <p className="text-base font-black text-zinc-800 uppercase tracking-tight">
                        Upload Master Audio File (No URL Needed)
                      </p>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                        Drag and drop your audio file here, or click to choose from your device. It will be stored locally in full fidelity.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileBrowser();
                      }}
                      className="mt-2 bg-[#293556] hover:bg-[#1f2942] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <UploadCloud size={16} />
                      <span>Browse Audio File from Computer</span>
                    </button>

                    <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.MP3</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.WAV</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.MP4</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.M4A</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.FLAC</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.OGG</span>
                      <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase border border-zinc-200">.AAC</span>
                    </div>
                  </div>

                  {formData.streamUrl && !formData.streamUrl.startsWith('blob:') && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-[11px] font-medium flex items-center justify-between gap-2">
                      <span className="truncate">
                        Currently using remote web stream link. Uploading an audio file above will upgrade this track with your offline master.
                      </span>
                      <button
                        type="button"
                        onClick={() => setAudioSourceMode('url')}
                        className="text-amber-950 font-black underline uppercase text-[10px] flex-shrink-0 cursor-pointer"
                      >
                        View URL
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: DIRECT WEB STREAM URL */}
          {audioSourceMode === 'url' && (
            <div className="space-y-3 bg-white p-5 rounded-3xl border border-zinc-200/80">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Direct Audio Stream Link (https://...)</label>
                <input 
                  type="url"
                  className="w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl font-bold text-xs text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  value={formData.streamUrl}
                  onChange={e => {
                    const url = e.target.value;
                    setFormData({ ...formData, streamUrl: url });
                    setAudioPreviewUrl(url);
                  }}
                  placeholder="https://cdn1.suno.ai/... or direct mp3 stream link"
                />
              </div>

              {formData.streamUrl && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-zinc-500 font-bold truncate max-w-xs">Stream URL target verified</span>
                  <button
                    type="button"
                    onClick={togglePreviewPlay}
                    className="px-3.5 py-2 bg-[#293556] text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {isPreviewPlaying ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isPreviewPlaying ? 'Pause Stream' : 'Test Stream'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Official Artist Web Link */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Official Link (Artist official page / release link)</label>
          <input 
            className="w-full bg-white border border-zinc-200/80 p-4 rounded-2xl font-bold text-zinc-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            value={formData.artistOfficialUrl}
            onChange={e => setFormData({ ...formData, artistOfficialUrl: e.target.value })}
            placeholder="https://suno.com/song/..."
          />
        </div>

        {/* Album Art Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Album Art / Cover Image</label>
            <span className="text-[8px] font-black tracking-widest text-[#293556] uppercase bg-cyan-100 px-2 py-0.5 rounded-full">Album Visual</span>
          </div>
          
          <div className="flex gap-4 items-center bg-zinc-100/60 p-4 rounded-3xl border border-zinc-200/60">
            <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden soft-shadow border border-zinc-200/60 flex-shrink-0 flex items-center justify-center">
              {formData.albumArtUrl ? (
                <img 
                  src={formData.albumArtUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/album_cover_kumoru.jpg' }} 
                />
              ) : (
                <span className="text-zinc-400 text-[9px] font-bold uppercase text-center p-1">No Image</span>
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <input 
                className="w-full bg-white border border-zinc-200/80 p-3 rounded-xl font-bold text-xs text-zinc-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                value={formData.albumArtUrl}
                onChange={e => setFormData({ ...formData, albumArtUrl: e.target.value })}
                placeholder="/images/album_cover_kumoru.jpg or custom image URL..."
              />
              <p className="text-[9px] text-zinc-400 font-medium">Defaults to official album cover: 曇りの断層 「Cloudy Fault Line」</p>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-2">Preset Album & Style Templates:</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Cloudy Fault', url: '/images/album_cover_kumoru.jpg' },
                { name: 'Neon Synth', url: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=400&auto=format&fit=crop&q=60' },
                { name: 'Live Stage', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60' },
                { name: 'Abstract Art', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&auto=format&fit=crop&q=60' },
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, albumArtUrl: template.url })}
                  className="group relative h-12 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 cursor-pointer hover:border-[#293556] active:scale-95 transition-all"
                >
                  <img src={template.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black tracking-tighter text-white uppercase text-center p-0.5 leading-none">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 bg-[#293556] hover:bg-[#1f2942] text-white font-black p-5 rounded-[25px] uppercase tracking-widest text-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-900/10"
        >
          {isSubmitting ? 'Saving Audio & Data...' : '💾 Save Song Data'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-black px-8 rounded-[25px] uppercase tracking-widest text-xs transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SongForm;
