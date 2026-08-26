import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Play, 
  Pause, 
  Film, 
  Gamepad2, 
  Tv, 
  Guitar, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Check, 
  Layers, 
  Filter, 
  TrendingUp, 
  Globe2, 
  Users2, 
  Music,
  Scale,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Song, Language, SongAnalysis } from '../types';
import { musicAnalysisService } from '../services/musicAnalysisService';
import { useTranslation } from 'react-i18next';
import AnimeGameMovieGenreAnalysisView from './AnimeGameMovieGenreAnalysisView';

interface MusicAnalysisViewProps {
  songs: Song[];
  currentPlayingSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  initialTab?: TabMode;
}

export type TabMode = 'matrix' | 'inspector' | 'compare' | 'genre_ai';

export default function MusicAnalysisView({
  songs,
  currentPlayingSong,
  isPlaying,
  onPlaySong,
  initialTab = 'matrix'
}: MusicAnalysisViewProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language as Language) || Language.EN;

  const [activeTab, setActiveTab] = useState<TabMode>(initialTab);
  const [selectedSongId, setSelectedSongId] = useState<string>(songs[0]?.id || 'suno-justine');
  const [compareSongAId, setCompareSongAId] = useState<string>(songs[0]?.id || 'suno-justine');
  const [compareSongBId, setCompareSongBId] = useState<string>(songs[1]?.id || 'suno-invisible');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hit' | 'name' | 'energy' | 'country'>('hit');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Derive analysis for all songs
  const catalogData = useMemo(() => {
    return songs.map(song => ({
      song,
      analysis: musicAnalysisService.getAnalysisForSong(song)
    }));
  }, [songs]);

  const overview = useMemo(() => {
    return musicAnalysisService.getCatalogOverview(songs);
  }, [songs]);

  // Filtered & sorted songs for matrix
  const processedSongs = useMemo(() => {
    const list = catalogData.filter(item => {
      const name = (item.song.songName[lang] || Object.values(item.song.songName)[0] || '').toLowerCase();
      const artist = (item.song.singerName[lang] || Object.values(item.song.singerName)[0] || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || name.includes(q) || artist.includes(q);
      
      const matchesFilter = filterType === 'all' || item.analysis.primaryType.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    list.sort((a, b) => {
      if (sortBy === 'hit') return b.analysis.probabilityToBeHit - a.analysis.probabilityToBeHit;
      if (sortBy === 'energy') return b.analysis.soundSignature.energy - a.analysis.soundSignature.energy;
      if (sortBy === 'country') return (b.analysis.acceptanceCountry[0]?.percentage || 0) - (a.analysis.acceptanceCountry[0]?.percentage || 0);
      const nameA = a.song.songName[lang] || '';
      const nameB = b.song.songName[lang] || '';
      return nameA.localeCompare(nameB);
    });

    return list;
  }, [catalogData, searchQuery, filterType, sortBy, lang]);

  const selectedItem = useMemo(() => {
    return catalogData.find(item => item.song.id === selectedSongId) || catalogData[0];
  }, [catalogData, selectedSongId]);

  const compareItemA = useMemo(() => {
    return catalogData.find(item => item.song.id === compareSongAId) || catalogData[0];
  }, [catalogData, compareSongAId]);

  const compareItemB = useMemo(() => {
    return catalogData.find(item => item.song.id === compareSongBId) || catalogData[1] || catalogData[0];
  }, [catalogData, compareSongBId]);

  const handleCopyReport = (analysis: SongAnalysis, song: Song) => {
    const text = `=== RADIO ION - OBJECTIVE MUSIC ANALYSIS ===
Track: ${song.songName.en || Object.values(song.songName)[0]}
Artist: ${song.singerName.en || Object.values(song.singerName)[0]}
Hit Probability: ${analysis.probabilityToBeHit}% (${analysis.hitVerdict})

[Target Demographics]
Gender: Male ${analysis.demographics.gender.male}% | Female ${analysis.demographics.gender.female}% | Non-Binary ${analysis.demographics.gender.nonBinary}%
Primary Age: ${analysis.demographics.ageGroups[0]?.range} (${analysis.demographics.ageGroups[0]?.percentage}%)

[Country Acceptance]
${analysis.acceptanceCountry.map(c => `- ${c.country}: ${c.percentage}%`).join('\n')}

[Media Suitability]
- Primary Type: ${analysis.primaryType}
- Animation Fit: ${analysis.mediaFit.animation.fitScore}% (${analysis.animationType})
- Video Game Fit: ${analysis.mediaFit.videoGame.fitScore}% (${analysis.videoGameType})
- Rock Band Genre: ${analysis.mediaFit.rockBand.fitScore}% (${analysis.rockBandGenre})
- Movie Fit: ${analysis.mediaFit.movie.fitScore}% (${analysis.mediaFit.movie.subType})

[Objective Judgment]
PRO:
${analysis.pros.map(p => `+ ${p}`).join('\n')}
AGAINST:
${analysis.against.map(a => `- ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const getMediaIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'animation': return <Tv size={14} className="text-pink-500" />;
      case 'video game': return <Gamepad2 size={14} className="text-purple-500" />;
      case 'rock band': return <Guitar size={14} className="text-amber-500" />;
      case 'movie': return <Film size={14} className="text-cyan-500" />;
      default: return <Music size={14} className="text-blue-500" />;
    }
  };

  return (
    <section className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-[#FFF4E4] p-8 md:p-10 rounded-[45px] soft-shadow border border-[#F3E7D3] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#293556] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                RADIO ION 雷音
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A0886F]">
                Objective Intelligence & Evaluation
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-zinc-950">
              MUSIC ANALYSIS <span className="text-cyan-600 font-noto not-italic font-bold">音楽分析</span>
            </h2>
            <p className="text-zinc-600 font-medium text-xs md:text-sm max-w-xl leading-relaxed">
              Objective evaluation matrix for all music inside Radio ION. Evaluates hit probability, geographic acceptance, demographic profiles, media suitability (Animation, Video Game, Rock Band, Movie), and critical pros/cons.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 text-center">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Catalog Songs</p>
              <p className="text-xl font-black text-[#293556] mt-0.5">{overview.totalAnalyzed}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 text-center">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Avg Hit Prob</p>
              <p className="text-xl font-black text-cyan-600 mt-0.5">{overview.avgHitProbability}%</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 text-center">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Lead Media</p>
              <p className="text-sm font-black text-zinc-800 mt-1 truncate">{overview.primaryFitLeader}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 text-center">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Top Market</p>
              <p className="text-xs font-black text-zinc-800 mt-1 truncate">🇯🇵 Japan / 🇺🇸 US</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div className="inline-flex bg-zinc-200/60 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <Layers size={14} /> Full Matrix ({processedSongs.length})
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'inspector' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <BarChart3 size={14} /> Deep Inspector
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'compare' ? 'bg-[#293556] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900'}`}
          >
            <Scale size={14} /> A/B Comparison
          </button>
          <button
            onClick={() => setActiveTab('genre_ai')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'genre_ai' ? 'bg-cyan-600 text-white shadow-md' : 'text-zinc-600 hover:text-cyan-700 font-black'}`}
          >
            <Sparkles size={14} /> Anime-Game-Movie AI Analysis
          </button>
        </div>

        {activeTab === 'matrix' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tracks..."
                className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5">
              <Filter size={12} className="text-zinc-400" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="text-xs font-bold text-zinc-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="all">All Media</option>
                <option value="animation">Animation</option>
                <option value="video game">Video Game</option>
                <option value="rock band">Rock Band</option>
                <option value="movie">Movie</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5">
              <TrendingUp size={12} className="text-zinc-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'hit' | 'name' | 'energy' | 'country')}
                className="text-xs font-bold text-zinc-700 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="hit">Sort: Hit Probability</option>
                <option value="energy">Sort: Energy</option>
                <option value="country">Sort: Market Share</option>
                <option value="name">Sort: Track Name</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: FULL MATRIX TABLE & GRID */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {processedSongs.map(({ song, analysis }) => {
              const isCurrent = currentPlayingSong?.id === song.id;
              const isSelected = selectedSongId === song.id;
              const songTitle = song.songName[lang] || Object.values(song.songName)[0] || 'Unknown Track';
              const artistTitle = song.singerName[lang] || Object.values(song.singerName)[0] || 'Artist';

              return (
                <motion.div
                  key={song.id}
                  layout
                  className={`bg-white rounded-[32px] p-5 md:p-6 soft-shadow border-2 transition-all ${isSelected ? 'border-cyan-500 bg-cyan-50/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Track info with direct playback */}
                    <div className="flex items-center gap-4 min-w-[260px]">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-zinc-100 group">
                        <img
                          src={song.albumArtUrl || '/images/album_cover_kumoru.jpg'}
                          alt={songTitle}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onPlaySong(song)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isCurrent && isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                            {song.duration}s
                          </span>
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                            BPM {analysis.soundSignature.tempoBpm}
                          </span>
                        </div>
                        <h3 className="text-base font-black italic uppercase truncate text-zinc-950 mt-1">
                          {songTitle}
                        </h3>
                        <p className="text-xs font-bold text-zinc-400 truncate">
                          {artistTitle}
                        </p>
                      </div>
                    </div>

                    {/* Matrix Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      {/* Probability to be Hit */}
                      <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100/80">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">
                          Hit Probability
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xl font-black text-[#293556]">
                            {analysis.probabilityToBeHit}%
                          </span>
                          <span className="text-[9px] font-bold text-cyan-600 uppercase">
                            {analysis.hitVerdict.split(' ')[0]}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${analysis.probabilityToBeHit}%` }}
                          />
                        </div>
                      </div>

                      {/* Acceptance Country */}
                      <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100/80">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">
                          Top Acceptance
                        </span>
                        <p className="text-xs font-black text-zinc-800 mt-1 flex items-center gap-1">
                          <span>{analysis.acceptanceCountry[0]?.flag}</span>
                          <span>{analysis.acceptanceCountry[0]?.country}</span>
                          <span className="text-cyan-600 font-bold ml-auto">{analysis.acceptanceCountry[0]?.percentage}%</span>
                        </p>
                        <p className="text-[9px] font-bold text-zinc-400 mt-1 truncate">
                          #2: {analysis.acceptanceCountry[1]?.flag} {analysis.acceptanceCountry[1]?.country} ({analysis.acceptanceCountry[1]?.percentage}%)
                        </p>
                      </div>

                      {/* Gender & Age Demographics */}
                      <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100/80">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">
                          Gender & Age
                        </span>
                        <p className="text-[11px] font-black text-zinc-800 mt-1">
                          ♂ {analysis.demographics.gender.male}% | ♀ {analysis.demographics.gender.female}%
                        </p>
                        <p className="text-[9px] font-bold text-cyan-700 mt-1">
                          Core: {analysis.demographics.ageGroups[0]?.range} ({analysis.demographics.ageGroups[0]?.percentage}%)
                        </p>
                      </div>

                      {/* Media Fit Categories */}
                      <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100/80">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">
                          Primary Media Fit
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getMediaIcon(analysis.primaryType)}
                          <span className="text-xs font-black text-zinc-800">
                            {analysis.primaryType}
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-500 truncate mt-1">
                          {analysis.primaryType === 'Animation' && analysis.animationType}
                          {analysis.primaryType === 'Video Game' && analysis.videoGameType}
                          {analysis.primaryType === 'Rock Band' && analysis.rockBandGenre}
                          {analysis.primaryType === 'Movie' && analysis.mediaFit.movie.subType}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => {
                          setSelectedSongId(song.id);
                          setActiveTab('inspector');
                        }}
                        className="bg-[#293556] text-white hover:bg-cyan-600 transition-colors px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <BarChart3 size={13} /> Deep Analysis
                      </button>
                    </div>
                  </div>

                  {/* Summary Breakdown Strip */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2 text-zinc-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-800 uppercase text-[9px] block">Key Pro:</span>
                        <span className="font-medium text-[11px] text-emerald-950">{analysis.pros[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-amber-800 uppercase text-[9px] block">Key Against:</span>
                        <span className="font-medium text-[11px] text-amber-950">{analysis.against[0]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DEEP SONG INSPECTOR */}
      {activeTab === 'inspector' && selectedItem && (
        <div className="space-y-8">
          {/* Song Selector Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {catalogData.map(({ song, analysis }) => {
              const isSelected = song.id === selectedItem.song.id;
              const title = song.songName[lang] || Object.values(song.songName)[0] || 'Track';
              return (
                <button
                  key={song.id}
                  onClick={() => setSelectedSongId(song.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 border ${isSelected ? 'bg-[#293556] text-white border-transparent shadow-lg' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  <img
                    src={song.albumArtUrl || '/images/album_cover_kumoru.jpg'}
                    alt="art"
                    className="w-5 h-5 rounded-md object-cover"
                  />
                  <span className="truncate max-w-[140px]">{title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-cyan-400 text-black' : 'bg-zinc-100 text-zinc-600'}`}>
                    {analysis.probabilityToBeHit}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dossier Container */}
          <div className="bg-white p-6 md:p-10 rounded-[40px] soft-shadow border border-zinc-100 space-y-8">
            {/* Header with Artwork & Main Hit Score */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-zinc-100 rounded-3xl overflow-hidden shadow-md flex-shrink-0 relative group">
                  <img
                    src={selectedItem.song.albumArtUrl || '/images/album_cover_kumoru.jpg'}
                    alt="art"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onPlaySong(selectedItem.song)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {currentPlayingSong?.id === selectedItem.song.id && isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-0.5" />}
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-100 text-cyan-900 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Target Analysis Profile
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      ID: {selectedItem.song.id}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase text-zinc-950 mt-1">
                    {selectedItem.song.songName[lang] || Object.values(selectedItem.song.songName)[0]}
                  </h3>
                  <p className="text-sm font-bold text-zinc-500">
                    {selectedItem.song.singerName[lang] || Object.values(selectedItem.song.singerName)[0]}
                  </p>
                </div>
              </div>

              {/* Hit Probability Card */}
              <div className="bg-gradient-to-br from-[#293556] to-[#1a233a] text-white p-5 rounded-3xl soft-shadow min-w-[240px] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-cyan-300 tracking-widest block">
                    Probability to be Hit
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-cyan-400">
                      {selectedItem.analysis.probabilityToBeHit}%
                    </span>
                    <span className="text-xs font-bold text-zinc-300">
                      (Objective Index)
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-zinc-300 mt-1">
                    Verdict: <strong className="text-white">{selectedItem.analysis.hitVerdict}</strong>
                  </p>
                </div>
                <button
                  onClick={() => handleCopyReport(selectedItem.analysis, selectedItem.song)}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl text-white transition-colors"
                  title="Copy Report"
                >
                  {copiedReport ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                </button>
              </div>
            </div>

            {/* Geographic Acceptance & Demographic Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Country Acceptance % */}
              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <Globe2 size={16} className="text-cyan-600" /> Acceptance by Country / Region %
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">Global Index</span>
                </div>

                <div className="space-y-3 pt-2">
                  {selectedItem.analysis.acceptanceCountry.map((item) => (
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
                          className="bg-[#293556] h-full rounded-full"
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
                    <Users2 size={16} className="text-purple-600" /> Audience Gender & Age Spectrum
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">Demographics</span>
                </div>

                {/* Gender Split Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span>Male: {selectedItem.analysis.demographics.gender.male}%</span>
                    <span>Female: {selectedItem.analysis.demographics.gender.female}%</span>
                    <span>Non-Binary: {selectedItem.analysis.demographics.gender.nonBinary}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-200">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${selectedItem.analysis.demographics.gender.male}%` }}
                      title="Male"
                    />
                    <div
                      className="bg-pink-500 h-full"
                      style={{ width: `${selectedItem.analysis.demographics.gender.female}%` }}
                      title="Female"
                    />
                    <div
                      className="bg-purple-400 h-full"
                      style={{ width: `${selectedItem.analysis.demographics.gender.nonBinary}%` }}
                      title="Non-Binary"
                    />
                  </div>
                </div>

                {/* Age Brackets */}
                <div className="pt-2">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-2">Age Distribution Bracket</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedItem.analysis.demographics.ageGroups.map((age) => (
                      <div key={age.range} className="bg-white p-3 rounded-2xl border border-zinc-200/60 text-center">
                        <span className="text-[9px] font-black text-zinc-400 uppercase">{age.range}</span>
                        <p className="text-sm font-black text-zinc-900 mt-0.5">{age.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Fit Breakdown (Animation, Video Game, Rock Band, Movie) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black italic uppercase text-zinc-950">
                    Media Category Suitability & Sub-Genres
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Objective placement match across Animation, Video Games, Rock Band catalog, and Cinematic Movies.
                  </p>
                </div>
                <span className="bg-zinc-100 text-zinc-700 text-[9px] font-black uppercase px-3 py-1 rounded-full">
                  Primary: {selectedItem.analysis.primaryType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Animation */}
                <div className="bg-pink-50/50 p-5 rounded-[28px] border border-pink-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-pink-700 flex items-center gap-1.5">
                        <Tv size={14} /> Animation
                      </span>
                      <span className="text-sm font-black text-pink-900">
                        {selectedItem.analysis.mediaFit.animation.fitScore}%
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-zinc-900 mt-2 leading-snug">
                      {selectedItem.analysis.animationType}
                    </h5>
                    <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                      {selectedItem.analysis.mediaFit.animation.description}
                    </p>
                  </div>
                  <div className="w-full bg-pink-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${selectedItem.analysis.mediaFit.animation.fitScore}%` }} />
                  </div>
                </div>

                {/* 2. Video Game */}
                <div className="bg-purple-50/50 p-5 rounded-[28px] border border-purple-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-purple-700 flex items-center gap-1.5">
                        <Gamepad2 size={14} /> Video Game
                      </span>
                      <span className="text-sm font-black text-purple-900">
                        {selectedItem.analysis.mediaFit.videoGame.fitScore}%
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-zinc-900 mt-2 leading-snug">
                      {selectedItem.analysis.videoGameType}
                    </h5>
                    <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                      {selectedItem.analysis.mediaFit.videoGame.description}
                    </p>
                  </div>
                  <div className="w-full bg-purple-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${selectedItem.analysis.mediaFit.videoGame.fitScore}%` }} />
                  </div>
                </div>

                {/* 3. Rock Band */}
                <div className="bg-amber-50/50 p-5 rounded-[28px] border border-amber-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-amber-700 flex items-center gap-1.5">
                        <Guitar size={14} /> Rock Band Genre
                      </span>
                      <span className="text-sm font-black text-amber-900">
                        {selectedItem.analysis.mediaFit.rockBand.fitScore}%
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-zinc-900 mt-2 leading-snug">
                      {selectedItem.analysis.rockBandGenre}
                    </h5>
                    <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                      {selectedItem.analysis.mediaFit.rockBand.description}
                    </p>
                  </div>
                  <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedItem.analysis.mediaFit.rockBand.fitScore}%` }} />
                  </div>
                </div>

                {/* 4. Movie */}
                <div className="bg-cyan-50/50 p-5 rounded-[28px] border border-cyan-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-cyan-700 flex items-center gap-1.5">
                        <Film size={14} /> Movie / Cinema
                      </span>
                      <span className="text-sm font-black text-cyan-900">
                        {selectedItem.analysis.mediaFit.movie.fitScore}%
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-zinc-900 mt-2 leading-snug">
                      {selectedItem.analysis.mediaFit.movie.subType}
                    </h5>
                    <p className="text-[11px] text-zinc-600 font-medium mt-2 leading-relaxed">
                      {selectedItem.analysis.mediaFit.movie.description}
                    </p>
                  </div>
                  <div className="w-full bg-cyan-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${selectedItem.analysis.mediaFit.movie.fitScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Objective Judgment (PRO & AGAINST) */}
            <div className="space-y-4">
              <h4 className="text-base font-black italic uppercase text-zinc-950">
                Objective Evaluation (Pro vs. Against)
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
                    {selectedItem.analysis.pros.map((pro, idx) => (
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
                      AGAINST (Market Constraints & Friction Factors)
                    </h5>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {selectedItem.analysis.against.map((con, idx) => (
                      <li key={idx} className="text-xs font-medium text-amber-950 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Acoustic Signature Parameters */}
            <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                Acoustic & Production Metrics (Scale 1-10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Energy</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{selectedItem.analysis.soundSignature.energy} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Emotional Depth</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{selectedItem.analysis.soundSignature.emotionalDepth} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Commercial Accessibility</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{selectedItem.analysis.soundSignature.commercialAccessibility} / 10</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/60">
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Vocal Presence</span>
                  <p className="text-lg font-black text-zinc-900 mt-1">{selectedItem.analysis.soundSignature.vocalPresence} / 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SIDE-BY-SIDE COMPARISON */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl soft-shadow border border-zinc-100 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase text-zinc-400">Track A:</span>
              <select
                value={compareSongAId}
                onChange={e => setCompareSongAId(e.target.value)}
                className="flex-1 bg-zinc-50 p-2.5 rounded-xl font-bold text-xs text-zinc-800 focus:outline-none"
              >
                {catalogData.map(({ song }) => (
                  <option key={song.id} value={song.id}>
                    {song.songName[lang] || Object.values(song.songName)[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-2xl soft-shadow border border-zinc-100 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase text-zinc-400">Track B:</span>
              <select
                value={compareSongBId}
                onChange={e => setCompareSongBId(e.target.value)}
                className="flex-1 bg-zinc-50 p-2.5 rounded-xl font-bold text-xs text-zinc-800 focus:outline-none"
              >
                {catalogData.map(({ song }) => (
                  <option key={song.id} value={song.id}>
                    {song.songName[lang] || Object.values(song.songName)[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[compareItemA, compareItemB].map((item, idx) => {
              const label = idx === 0 ? 'Track A' : 'Track B';
              const title = item.song.songName[lang] || Object.values(item.song.songName)[0];
              const artist = item.song.singerName[lang] || Object.values(item.song.singerName)[0];

              return (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-[36px] soft-shadow border border-zinc-100 space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
                    <img
                      src={item.song.albumArtUrl || '/images/album_cover_kumoru.jpg'}
                      alt="art"
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-[#293556] text-white">
                        {label}
                      </span>
                      <h4 className="text-lg font-black italic uppercase text-zinc-900 truncate mt-1">
                        {title}
                      </h4>
                      <p className="text-xs font-bold text-zinc-400 truncate">{artist}</p>
                    </div>
                  </div>

                  {/* Hit & Media Verdict */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-zinc-50 p-3 rounded-2xl">
                      <span className="text-[8px] font-black uppercase text-zinc-400">Hit Probability</span>
                      <p className="text-xl font-black text-cyan-600 mt-0.5">{item.analysis.probabilityToBeHit}%</p>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">{item.analysis.hitVerdict}</span>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-2xl">
                      <span className="text-[8px] font-black uppercase text-zinc-400">Primary Fit</span>
                      <p className="text-sm font-black text-zinc-900 mt-1">{item.analysis.primaryType}</p>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">{item.analysis.animationType.split('/')[0]}</span>
                    </div>
                  </div>

                  {/* Country Acceptance */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Country Acceptance</span>
                    <div className="space-y-1.5">
                      {item.analysis.acceptanceCountry.slice(0, 3).map(c => (
                        <div key={c.code} className="flex justify-between text-xs font-bold">
                          <span>{c.flag} {c.country}</span>
                          <span className="text-cyan-700">{c.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-3 pt-2">
                    <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-xs">
                      <span className="font-bold text-emerald-800 uppercase text-[9px] block">Top Pro:</span>
                      <p className="font-medium text-emerald-950 mt-0.5">{item.analysis.pros[0]}</p>
                    </div>
                    <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100 text-xs">
                      <span className="font-bold text-amber-800 uppercase text-[9px] block">Top Against:</span>
                      <p className="font-medium text-amber-950 mt-0.5">{item.analysis.against[0]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ANIME-VIDEO_GAME-MOVIE GENRE PROMPT AI ANALYSIS */}
      {activeTab === 'genre_ai' && (
        <AnimeGameMovieGenreAnalysisView
          songs={songs}
          currentPlayingSong={currentPlayingSong}
          isPlaying={isPlaying}
          onPlaySong={onPlaySong}
        />
      )}
    </section>
  );
}
