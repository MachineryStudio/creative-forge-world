import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Tv, 
  Gamepad2, 
  Guitar, 
  Film, 
  Globe2, 
  Users2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Share2, 
  Check, 
  Play, 
  Pause,
  Zap,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song, PromptAnalysisResult } from '../types';
import { musicAnalysisService, PROMPT_PRESETS, PromptPreset } from '../services/musicAnalysisService';

interface AnimeGameMovieGenreAnalysisViewProps {
  songs: Song[];
  currentPlayingSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
}

export default function AnimeGameMovieGenreAnalysisView({
  songs,
  currentPlayingSong,
  isPlaying,
  onPlaySong
}: AnimeGameMovieGenreAnalysisViewProps) {
  const [promptText, setPromptText] = useState<string>(
    'Fast-paced melodic rock with distorted synth bass, double kick drums, soaring high-register Japanese vocals, and a high-tension chorus drop suited for high-speed mecha dogfights over Neo-Tokyo.'
  );
  const [bpm, setBpm] = useState<number>(148);
  const [vocalStyle, setVocalStyle] = useState<string>('High-octave passionate male/female lead');
  const [targetCategory, setTargetCategory] = useState<'Auto' | 'Animation' | 'Video Game' | 'Rock Band' | 'Movie'>('Auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'Animation' | 'Video Game' | 'Rock Band' | 'Movie'>('all');

  // Compute analysis result reactively or upon trigger
  const [result, setResult] = useState<PromptAnalysisResult>(() => {
    return musicAnalysisService.analyzeCustomPrompt(
      'Fast-paced melodic rock with distorted synth bass, double kick drums, soaring high-register Japanese vocals, and a high-tension chorus drop suited for high-speed mecha dogfights over Neo-Tokyo.',
      { bpm: 148, vocalStyle: 'High-octave passionate male/female lead', targetMediaCategory: 'Auto', songsCatalog: songs }
    );
  });

  const handleRunAnalysis = (textToAnalyze = promptText, overrideBpm = bpm, overrideCategory = targetCategory) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = musicAnalysisService.analyzeCustomPrompt(textToAnalyze, {
        bpm: overrideBpm,
        vocalStyle,
        targetMediaCategory: overrideCategory,
        songsCatalog: songs
      });
      setResult(res);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    setPromptText(preset.prompt);
    setBpm(preset.bpm);
    setVocalStyle(preset.vocalStyle);
    if (preset.category !== 'Crossover') {
      setTargetCategory(preset.category);
    } else {
      setTargetCategory('Auto');
    }
    handleRunAnalysis(preset.prompt, preset.bpm, preset.category !== 'Crossover' ? preset.category : 'Auto');
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * PROMPT_PRESETS.length);
    handleSelectPreset(PROMPT_PRESETS[randomIndex]);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = `=== RAION 雷音 - ANIME, VIDEO GAME & MOVIE GENRE ANALYSIS ===
Prompt Input: "${result.promptQuery}"
Target Category: ${result.primaryType} | BPM: ${result.soundSignature.tempoBpm} | Vocal: ${vocalStyle}
Hit Probability: ${result.probabilityToBeHit}% (${result.hitVerdict})

[Geographic Acceptance]
${result.acceptanceCountry.map(c => `- ${c.country}: ${c.percentage}%`).join('\n')}

[Audience Demographics]
- Gender: Male ${result.demographics.gender.male}% | Female ${result.demographics.gender.female}% | Non-Binary ${result.demographics.gender.nonBinary}%
- Age: Core ${result.demographics.ageGroups[0]?.range} (${result.demographics.ageGroups[0]?.percentage}%)

[Media Category Suitability & Sub-Genres]
1. Animation: ${result.mediaFit.animation.fitScore}% -> ${result.animationType}
   ${result.mediaFit.animation.description}
2. Video Game: ${result.mediaFit.videoGame.fitScore}% -> ${result.videoGameType}
   ${result.mediaFit.videoGame.description}
3. Rock Band: ${result.mediaFit.rockBand.fitScore}% -> ${result.rockBandGenre}
   ${result.mediaFit.rockBand.description}
4. Movie: ${result.mediaFit.movie.fitScore}% -> ${result.mediaFit.movie.subType}
   ${result.mediaFit.movie.description}

[Objective Judgment]
PRO:
${result.pros.map(p => `+ ${p}`).join('\n')}
AGAINST:
${result.against.map(a => `- ${a}`).join('\n')}

[RAION Optimization Recommendations to Improve Media Suitability]
${result.optimizationSuggestions.map(o => `[${o.targetCategory}] ${o.action}\n  -> Expected Impact: ${o.expectedImpact}`).join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const matchedSong = useMemo(() => {
    if (!result.closestCatalogMatch) return null;
    return songs.find(s => s.id === result.closestCatalogMatch?.songId) || null;
  }, [result, songs]);

  const getMediaIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'animation': return <Tv size={16} className="text-pink-500" />;
      case 'video game': return <Gamepad2 size={16} className="text-purple-500" />;
      case 'rock band': return <Guitar size={16} className="text-amber-500" />;
      case 'movie': return <Film size={16} className="text-cyan-500" />;
      default: return <Sparkles size={16} className="text-blue-500" />;
    }
  };

  return (
    <section className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-[#FFF4E4] p-8 md:p-10 rounded-[45px] soft-shadow border border-[#F3E7D3] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#293556] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                RAION 雷音 AI LAB
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A0886F]">
                Objective Intelligence & Media Suitability Optimizer
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-zinc-950">
              Anime - Video Game - Movie <span className="text-cyan-600 font-noto not-italic font-bold">ジャンル客観分析</span>
            </h2>
            <p className="text-zinc-600 font-medium text-xs md:text-sm leading-relaxed">
              Enter customer input prompts to objectively evaluate acceptance by country, age groups, gender distribution, and exact placement types across <strong>Animation</strong>, <strong>Video Games</strong>, <strong>Rock Band</strong>, and <strong>Cinema</strong>. Generates actionable production advice to enhance Media Category Suitability & Sub-Genres.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-white/60 text-center min-w-[130px]">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">Evaluated Type</span>
              <p className="text-base font-black text-[#293556] mt-0.5 flex items-center justify-center gap-1.5">
                {getMediaIcon(result.primaryType)}
                <span>{result.primaryType}</span>
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-white/60 text-center min-w-[130px]">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">Hit Probability</span>
              <p className="text-xl font-black text-cyan-600 mt-0.5">{result.probabilityToBeHit}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT INPUT & CONTROL STUDIO */}
      <div className="bg-white p-6 md:p-8 rounded-[40px] soft-shadow border border-zinc-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-600" />
            <h3 className="font-black italic uppercase text-base text-zinc-950">
              Media Prompt & Concept Input Console
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} /> Randomize Concept
            </button>
          </div>
        </div>

        {/* Prompt Presets Quick Selector */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
            Preset Concept Blueprints (Click to Inject)
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PROMPT_PRESETS.map(preset => {
              const isSelected = promptText === preset.prompt;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${isSelected ? 'bg-[#293556] text-white border-transparent shadow-md' : 'bg-zinc-50 text-zinc-700 border-zinc-200/80 hover:bg-zinc-100'}`}
                >
                  {getMediaIcon(preset.category)}
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <textarea
            id="prompt-input-field"
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            rows={4}
            placeholder="Enter musical concept, instrumentation, anime storyboard scene, video game stage, or cinematic atmosphere (e.g. 'Fast-paced melodic rock with distorted synth bass, double kick drums, soaring high-register Japanese vocals, and a high-tension chorus drop suited for high-speed mecha dogfights')..."
            className="w-full bg-zinc-50 border-2 border-zinc-200/80 rounded-3xl p-4 md:p-5 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all leading-relaxed"
          />
        </div>

        {/* Fine Tuning Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Target Media Override */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 space-y-1.5">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">
              Target Media Category
            </span>
            <select
              value={targetCategory}
              onChange={e => setTargetCategory(e.target.value as 'Auto' | 'Animation' | 'Video Game' | 'Rock Band' | 'Movie')}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs font-black text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="Auto">Auto-Detect (RAION Engine)</option>
              <option value="Animation">Animation (Anime OP/ED/OST)</option>
              <option value="Video Game">Video Game (Action/JRPG/Rhythm)</option>
              <option value="Rock Band">Rock Band (Visual-Kei/J-Rock)</option>
              <option value="Movie">Movie (Cinema/Trailer/Theme)</option>
            </select>
          </div>

          {/* BPM Slider */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                Target Tempo
              </span>
              <span className="text-xs font-black text-[#293556] bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-md">
                {bpm} BPM
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="180"
              value={bpm}
              onChange={e => setBpm(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </div>

          {/* Vocal Style */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 space-y-1.5">
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">
              Vocal Delivery Profile
            </span>
            <select
              value={vocalStyle}
              onChange={e => setVocalStyle(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs font-black text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="High-octave passionate male/female lead">High-octave passionate lead</option>
              <option value="Intimate breathy female vocal">Intimate breathy vocal</option>
              <option value="Theatrical vibrato & dynamic vocal rasp">Theatrical vibrato & rasp</option>
              <option value="Latin choir accents & operatic backing">Latin choir & operatic</option>
              <option value="Spoken-word radio voice / Ambient vocal chops">Spoken-word / Ambient chops</option>
              <option value="High-energy energetic anthemic vocal">High-energy anthemic</option>
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing}
            className="bg-[#293556] hover:bg-cyan-600 text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Zap size={16} className="animate-spin text-cyan-300" />
                Analyzing with RAION...
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-cyan-300" />
                Analyze Objectively with RAION 雷音
              </>
            )}
          </button>
        </div>
      </div>

      {/* RAION OBJECTIVE ANALYSIS RESULTS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result.songId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-8"
        >
          {/* Executive Overview Dossier */}
          <div className="bg-white p-6 md:p-10 rounded-[40px] soft-shadow border border-zinc-100 space-y-8">
            {/* Header with Commercial Hit Score */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#293556] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    RAION Analysis Dossier
                  </span>
                  <span className="bg-cyan-100 text-cyan-900 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    Primary: {result.primaryType}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">
                    {result.soundSignature.tempoBpm} BPM
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic uppercase text-zinc-950 mt-1">
                  Objective Evaluation Profile
                </h3>
                <p className="text-xs font-bold text-zinc-500 line-clamp-2">
                  "{result.promptQuery}"
                </p>
              </div>

              {/* Hit Probability Card */}
              <div className="bg-gradient-to-br from-[#293556] to-[#1a233a] text-white p-5 rounded-3xl soft-shadow min-w-[260px] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-cyan-300 tracking-widest block">
                    Hit Probability Index
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-cyan-400">
                      {result.probabilityToBeHit}%
                    </span>
                    <span className="text-xs font-bold text-zinc-300">
                      (Commercial Model)
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-zinc-300 mt-1">
                    Verdict: <strong className="text-white">{result.hitVerdict}</strong>
                  </p>
                </div>
                <button
                  onClick={handleCopyReport}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl text-white transition-colors cursor-pointer"
                  title="Copy Full Executive Report"
                >
                  {copiedReport ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                </button>
              </div>
            </div>

            {/* Closest Catalog Match Banner */}
            {result.closestCatalogMatch && matchedSong && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50/50 p-5 rounded-3xl border border-cyan-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 relative group flex-shrink-0 shadow-sm">
                    <img
                      src={matchedSong.albumArtUrl || '/images/album_cover_kumoru.jpg'}
                      alt={result.closestCatalogMatch.songTitle}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onPlaySong(matchedSong)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {currentPlayingSong?.id === matchedSong.id && isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-[#293556] text-white">
                        Closest Radio ION Track
                      </span>
                      <span className="text-[9px] font-black text-cyan-800">
                        {result.closestCatalogMatch.similarityScore}% Match
                      </span>
                    </div>
                    <h4 className="text-sm font-black uppercase text-zinc-950 mt-0.5">
                      {result.closestCatalogMatch.songTitle}
                    </h4>
                    <p className="text-[11px] text-zinc-600 font-medium mt-0.5">
                      {result.closestCatalogMatch.matchReason}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onPlaySong(matchedSong)}
                  className="bg-[#293556] hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                >
                  <Play size={13} fill="white" /> Listen Reference
                </button>
              </div>
            )}

            {/* Geographic Acceptance & Demographic Spectra */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Acceptance by Country % */}
              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <Globe2 size={16} className="text-cyan-600" /> Acceptance by Country / Region %
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">Geographic Share</span>
                </div>

                <div className="space-y-3 pt-2">
                  {result.acceptanceCountry.map(item => (
                    <div key={item.code} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-zinc-800">
                          <span>{item.flag}</span>
                          <span>{item.country}</span>
                        </span>
                        <span className="text-[#293556] font-black">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#293556] h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage * 2.2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender & Age Breakdown */}
              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <Users2 size={16} className="text-purple-600" /> Audience Demographic Profile
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">Demographics</span>
                </div>

                {/* Gender Split Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span>Male: {result.demographics.gender.male}%</span>
                    <span>Female: {result.demographics.gender.female}%</span>
                    <span>Non-Binary: {result.demographics.gender.nonBinary}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-200">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${result.demographics.gender.male}%` }}
                      title="Male"
                    />
                    <div
                      className="bg-pink-500 h-full transition-all duration-500"
                      style={{ width: `${result.demographics.gender.female}%` }}
                      title="Female"
                    />
                    <div
                      className="bg-purple-400 h-full transition-all duration-500"
                      style={{ width: `${result.demographics.gender.nonBinary}%` }}
                      title="Non-Binary"
                    />
                  </div>
                </div>

                {/* Age Brackets */}
                <div className="pt-2">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-2">
                    Age Bracket Distribution
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {result.demographics.ageGroups.map(age => (
                      <div key={age.range} className="bg-white p-3 rounded-2xl border border-zinc-200/60 text-center">
                        <span className="text-[9px] font-black text-zinc-400 uppercase">{age.range}</span>
                        <p className="text-sm font-black text-zinc-900 mt-0.5">{age.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MEDIA CATEGORY SUITABILITY & SUB-GENRES (THE CORE PANEL) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-black italic uppercase text-zinc-950">
                    Media Category Suitability & Sub-Genres
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Objective evaluation across Animation, Video Games, Rock Band and Cinema placement suitability.
                  </p>
                </div>
                <div className="inline-flex bg-zinc-100 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTabFilter('all')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTabFilter === 'all' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600'}`}
                  >
                    All (4)
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('Animation')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTabFilter === 'Animation' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600'}`}
                  >
                    Animation
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('Video Game')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTabFilter === 'Video Game' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600'}`}
                  >
                    Video Game
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('Rock Band')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTabFilter === 'Rock Band' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600'}`}
                  >
                    Rock Band
                  </button>
                  <button
                    onClick={() => setActiveTabFilter('Movie')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTabFilter === 'Movie' ? 'bg-[#293556] text-white shadow-sm' : 'text-zinc-600'}`}
                  >
                    Movie
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Animation */}
                {(activeTabFilter === 'all' || activeTabFilter === 'Animation') && (
                  <div className="bg-pink-50/50 p-5 rounded-[28px] border-2 border-pink-100 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-pink-700 flex items-center gap-1.5">
                          <Tv size={14} /> Animation / Anime
                        </span>
                        <span className="text-sm font-black text-pink-900 bg-pink-100/80 px-2 py-0.5 rounded-md">
                          {result.mediaFit.animation.fitScore}% Fit
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-zinc-900 mt-3 leading-snug">
                        {result.animationType}
                      </h5>
                      <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                        {result.mediaFit.animation.description}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-pink-800">
                        <span>Broadcast Synchronization</span>
                        <span>{result.mediaFit.animation.fitScore}%</span>
                      </div>
                      <div className="w-full bg-pink-200/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full" style={{ width: `${result.mediaFit.animation.fitScore}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Video Game */}
                {(activeTabFilter === 'all' || activeTabFilter === 'Video Game') && (
                  <div className="bg-purple-50/50 p-5 rounded-[28px] border-2 border-purple-100 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-purple-700 flex items-center gap-1.5">
                          <Gamepad2 size={14} /> Video Game
                        </span>
                        <span className="text-sm font-black text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded-md">
                          {result.mediaFit.videoGame.fitScore}% Fit
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-zinc-900 mt-3 leading-snug">
                        {result.videoGameType}
                      </h5>
                      <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                        {result.mediaFit.videoGame.description}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-purple-800">
                        <span>Gameplay Loop & Tension Match</span>
                        <span>{result.mediaFit.videoGame.fitScore}%</span>
                      </div>
                      <div className="w-full bg-purple-200/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${result.mediaFit.videoGame.fitScore}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Rock Band */}
                {(activeTabFilter === 'all' || activeTabFilter === 'Rock Band') && (
                  <div className="bg-amber-50/50 p-5 rounded-[28px] border-2 border-amber-100 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-amber-700 flex items-center gap-1.5">
                          <Guitar size={14} /> Rock Band Genre
                        </span>
                        <span className="text-sm font-black text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                          {result.mediaFit.rockBand.fitScore}% Fit
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-zinc-900 mt-3 leading-snug">
                        {result.rockBandGenre}
                      </h5>
                      <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                        {result.mediaFit.rockBand.description}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-amber-800">
                        <span>Genre Authenticity & Guitar Texture</span>
                        <span>{result.mediaFit.rockBand.fitScore}%</span>
                      </div>
                      <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${result.mediaFit.rockBand.fitScore}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Movie */}
                {(activeTabFilter === 'all' || activeTabFilter === 'Movie') && (
                  <div className="bg-cyan-50/50 p-5 rounded-[28px] border-2 border-cyan-100 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-cyan-700 flex items-center gap-1.5">
                          <Film size={14} /> Movie / Cinema
                        </span>
                        <span className="text-sm font-black text-cyan-900 bg-cyan-100/80 px-2 py-0.5 rounded-md">
                          {result.mediaFit.movie.fitScore}% Fit
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-zinc-900 mt-3 leading-snug">
                        {result.mediaFit.movie.subType}
                      </h5>
                      <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                        {result.mediaFit.movie.description}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-cyan-800">
                        <span>Cinematic Staging & Dynamic Width</span>
                        <span>{result.mediaFit.movie.fitScore}%</span>
                      </div>
                      <div className="w-full bg-cyan-200/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${result.mediaFit.movie.fitScore}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONABLE RAION OPTIMIZATION RECOMMENDATIONS */}
            <div className="bg-gradient-to-br from-zinc-900 to-[#1e273d] text-white p-6 md:p-8 rounded-[36px] space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Lightbulb size={20} className="text-yellow-400" />
                  <div>
                    <h4 className="text-base font-black uppercase italic tracking-wider text-white">
                      RAION Actionable Recommendations to Improve Media Suitability
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Objective production and arrangement modifications to boost placement eligibility and licensing appeal.
                    </p>
                  </div>
                </div>
                <span className="bg-yellow-400/20 text-yellow-300 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
                  Optimization Guide
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.optimizationSuggestions.map((rec, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300">
                        Target: {rec.targetCategory}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400">Step #{idx + 1}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-100 leading-relaxed">
                      {rec.action}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-1 border-t border-white/5">
                      <CheckCircle2 size={12} className="flex-shrink-0" />
                      <span>{rec.expectedImpact}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* OBJECTIVE JUDGMENT: PRO vs. AGAINST */}
            <div className="space-y-4">
              <h4 className="text-base font-black italic uppercase text-zinc-950">
                Objective Evaluation (PRO & AGAINST)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PRO */}
                <div className="bg-emerald-50/40 p-6 rounded-[32px] border border-emerald-200/70 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h5 className="font-black uppercase text-xs tracking-wider">
                      PRO (Strengths & Commercial Upsides)
                    </h5>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {result.pros.map((pro, idx) => (
                      <li key={idx} className="text-xs font-medium text-emerald-950 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AGAINST */}
                <div className="bg-amber-50/40 p-6 rounded-[32px] border border-amber-200/70 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle size={18} className="text-amber-600" />
                    <h5 className="font-black uppercase text-xs tracking-wider">
                      AGAINST (Market Constraints & Friction Points)
                    </h5>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {result.against.map((con, idx) => (
                      <li key={idx} className="text-xs font-medium text-amber-950 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ACOUSTIC & PRODUCTION PARAMETERS */}
            <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                Acoustic & Production Metrics (Scale 1-10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Energy</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{result.soundSignature.energy} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Emotional Depth</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{result.soundSignature.emotionalDepth} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Commercial Accessibility</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{result.soundSignature.commercialAccessibility} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Vocal Presence</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{result.soundSignature.vocalPresence} / 10</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
