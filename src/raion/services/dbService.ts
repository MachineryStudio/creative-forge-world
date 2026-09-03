import { Song, UserProfile, Language, MusicDatabase } from '../types';
import { getAudioUrl, deleteAudioBlob, hasCustomAudio } from './audioStorage';

// Local storage keys
const USERS_KEY = 'app_users';
const SONGS_KEY = 'app_songs';
const DB_LIST_KEY = 'app_music_databases';
const ACTIVE_DB_KEY = 'app_active_database_id';

export const BAND_ARTWORKS = [
  '/images/album_cover_kumoru.jpg'
];

// Professional Seed Songs for initialization
const SEED_SONGS: Song[] = [
  {
    id: 'suno-justine',
    songName: { en: 'JUSTICE DAY', ja: 'ジャスティス・デイ 「JUSTICE DAY」', fr: 'JUSTICE DAY', es: 'JUSTICE DAY', zh: 'ジャスティス・デイ', ko: '저스티스 데이', it: 'JUSTICE DAY', ru: 'JUSTICE DAY' },
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
    streamUrl: '/api/audio/suno-justine',
    artistOfficialUrl: 'https://suno.com/song/b72b4894-7c2f-48ed-828b-999d08f6dc53?sh=9bwZHiPh0Pcfu0hU',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2024-05-01',
    duration: 210,
    genres: ['pop', 'synthwave'],
    tags: ['cloudy-fault-line', 'andree', 'justice-day'],
    playCount: 450,
    skipCount: 2,
    avgListenDuration: 198,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-invisible',
    songName: { en: 'Love That Keeps Diving', ja: 'しんついあい 「Love That Keeps Diving」', fr: 'Love That Keeps Diving', es: 'Love That Keeps Diving', zh: 'しんついあい', ko: 'Love That Keeps Diving', it: 'Love That Keeps Diving', ru: 'Love That Keeps Diving' },
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
    streamUrl: '/api/audio/suno-invisible',
    artistOfficialUrl: 'https://suno.com/song/94207216-99ab-48b2-be63-c504379cc6a6?sh=AyHw3E16bPnEcvaO',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2025-12-13',
    duration: 205,
    genres: ['pop', 'visual-kei'],
    tags: ['cloudy-fault-line', 'andree', 'descending-love'],
    playCount: 520,
    skipCount: 1,
    avgListenDuration: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-monster',
    songName: { en: 'Monster Loop', ja: 'モンスター・ループ 「Monster Loop」', fr: 'Monster Loop', es: 'Monster Loop', zh: 'モンスター・ループ', ko: '몬스터 루프', it: 'Monster Loop', ru: 'Monster Loop' },
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
    streamUrl: '/api/audio/suno-monster',
    artistOfficialUrl: 'https://suno.com/song/5883a32a-9654-47a5-aec7-30c905774bfe?sh=pLjzt3FzRoVKwnon',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2026-06-07',
    duration: 213,
    genres: ['pop', 'rock'],
    tags: ['cloudy-fault-line', 'andree', 'monster-loop'],
    playCount: 610,
    skipCount: 0,
    avgListenDuration: 213,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-two-seconds-left',
    songName: { en: '2 Seconds Away', ja: '2秒先 「2 Seconds Away」', fr: '2 Seconds Away', es: '2 Seconds Away', zh: '2秒先', ko: '2초 앞', it: '2 Seconds Away', ru: '2 Seconds Away' },
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
    streamUrl: '/api/audio/suno-two-seconds-left',
    artistOfficialUrl: 'https://suno.com/song/b1cf5c8a-31c3-4db0-9d4a-2cb5b759001b?sh=Z7TYCrZb5eJF1UmN',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2025-09-14',
    duration: 177,
    genres: ['pop', 'electronic'],
    tags: ['cloudy-fault-line', 'andree', '2-seconds-away'],
    playCount: 840,
    skipCount: 0,
    avgListenDuration: 177,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-hyohakushi',
    songName: { 
      en: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      ja: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      fr: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      es: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      zh: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      ko: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      it: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"', 
      ru: '「ヒョウハクシ」(Hyōhakushi) "Wandering Poem"' 
    },
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
    streamUrl: '/api/audio/suno-hyohakushi',
    artistOfficialUrl: 'https://suno.com/song/38fbf3c2-9200-4108-83b7-e7699f5e6f27?sh=e7nPgsi65JF7MZMd',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2026-06-07',
    duration: 273,
    genres: ['pop', 'acoustic'],
    tags: ['cloudy-fault-line', 'andree', 'hyohakushi', 'wandering-poem'],
    playCount: 730,
    skipCount: 0,
    avgListenDuration: 273,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-twilight-gloom',
    songName: { en: 'Twilight Gloom', ja: '夕闇 「Twilight Gloom」', fr: 'Twilight Gloom', es: 'Twilight Gloom', zh: '夕暗', ko: '황혼', it: 'Twilight Gloom', ru: 'Twilight Gloom' },
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
    streamUrl: '/api/audio/suno-twilight-gloom',
    artistOfficialUrl: 'https://suno.com/song/94207216-99ab-48b2-be63-c504379cc6a6?sh=AyHw3E16bPnEcvaO',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2026-07-01',
    duration: 215,
    genres: ['synthwave', 'visual-kei'],
    tags: ['cloudy-fault-line', 'andree', 'twilight-gloom'],
    playCount: 380,
    skipCount: 0,
    avgListenDuration: 215,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-last-train-wolf',
    songName: { en: 'Last Train Wolf', ja: '終電ウルフ 「Last Train Wolf」', fr: 'Last Train Wolf', es: 'Last Train Wolf', zh: '終電ウルフ', ko: '막차 늑代', it: 'Last Train Wolf', ru: 'Last Train Wolf' },
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
    streamUrl: '/api/audio/suno-last-train-wolf',
    artistOfficialUrl: 'https://suno.com/song/5883a32a-9654-47a5-aec7-30c905774bfe?sh=pLjzt3FzRoVKwnon',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: '曇りの断層 「Cloudy Fault Line」', ja: '曇りの断層 「Cloudy Fault Line」' },
    releaseDate: '2026-08-01',
    duration: 228,
    genres: ['rock', 'jrock'],
    tags: ['cloudy-fault-line', 'andree', 'last-train-wolf'],
    playCount: 490,
    skipCount: 0,
    avgListenDuration: 228,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

// Fictional visual-rock songs for CLOUD-TEARS to seed!
const CLOUD_TEARS_SEED_SONGS: Song[] = [
  {
    id: 'suno-ct-neon-cry',
    songName: { 
      en: 'Teardrop in Neon Lights', 
      ja: 'ネオンの涙 (Tears of Neon)', 
      fr: 'Larme de Néon', 
      es: 'Lágrima en las Luces de Neón', 
      zh: '霓虹泪', 
      ko: '네온의 눈물', 
      it: 'Lacrima nel Neon', 
      ru: 'Слеза в неоновом свете' 
    },
    singerName: { en: 'CLOUD-TEARS', ja: 'CLOUD-TEARS', fr: 'CLOUD-TEARS', es: 'CLOUD-TEARS', zh: 'CLOUD-TEARS', ko: 'CLOUD-TEARS', it: 'CLOUD-TEARS', ru: 'CLOUD-TEARS' },
    streamUrl: '/api/audio/suno-ct-neon-cry', // Stream actual high quality mp3
    artistOfficialUrl: 'https://suno.com/song/94207216-99ab-48b2-be63-c504379cc6a6?sh=AyHw3E16bPnEcvaO',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: 'Acoustic Horizon', ja: '音響の地平線' },
    releaseDate: '2026-05-15',
    duration: 205,
    genres: ['visual-kei', 'rock'],
    tags: ['cloud-tears', 'visual-kei', 'melodic-rock', 'jrock'],
    playCount: 1540,
    skipCount: 3,
    avgListenDuration: 195,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'suno-ct-storm',
    songName: { 
      en: 'Stormy Horizon', 
      ja: '嵐の地平線 (Stormy Horizon)', 
      fr: 'Horizon Tempétueux', 
      es: 'Horizonte Tormentoso', 
      zh: '风暴地平线', 
      ko: '폭풍의 지평선', 
      it: 'Orizzonte Tempestoso', 
      ru: 'Штормовой горизонт' 
    },
    singerName: { en: 'CLOUD-TEARS', ja: 'CLOUD-TEARS', fr: 'CLOUD-TEARS', es: 'CLOUD-TEARS', zh: 'CLOUD-TEARS', ko: 'CLOUD-TEARS', it: 'CLOUD-TEARS', ru: 'CLOUD-TEARS' },
    streamUrl: '/api/audio/suno-ct-storm', // Stream actual high quality mp3
    artistOfficialUrl: 'https://suno.com/song/38fbf3c2-9200-4108-83b7-e7699f5e6f27?sh=e7nPgsi65JF7MZMd',
    albumArtUrl: '/images/album_cover_kumoru.jpg',
    albumName: { en: 'Acoustic Horizon', ja: '音響の地平線' },
    releaseDate: '2026-06-01',
    duration: 273,
    genres: ['visual-kei', 'ballad'],
    tags: ['cloud-tears', 'visual-kei', 'ballad', 'heavy-rain'],
    playCount: 1220,
    skipCount: 1,
    avgListenDuration: 270,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

const DEFAULT_DATABASES: MusicDatabase[] = [
  {
    id: 'db-default',
    name: 'Universal Library',
    description: 'The main global database containing all music tracks and digital streams.',
    filterType: 'all',
    filterValue: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'db-cloud-tears',
    name: 'Band CLOUD-TEARS',
    description: 'Special active database containing only releases and sessions of the visual rock band CLOUD-TEARS.',
    filterType: 'band',
    filterValue: 'CLOUD-TEARS',
    createdAt: new Date().toISOString()
  }
];

// Helper to get data from localStorage
const getLocalData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const saveLocalData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dbService = {
  // --- DATABASE CONTROLS ---
  getSongsKey(): string {
    const activeDbId = this.getActiveDatabaseId();
    if (activeDbId === 'db-default') {
      return SONGS_KEY; // keep old key "app_songs" to not wipe customer's history!
    }
    return `${SONGS_KEY}_${activeDbId}`;
  },

  getActiveDatabaseId(): string {
    return localStorage.getItem(ACTIVE_DB_KEY) || 'db-default';
  },

  setActiveDatabaseId(id: string): void {
    localStorage.setItem(ACTIVE_DB_KEY, id);
  },

  getDatabases(): MusicDatabase[] {
    const dbs = getLocalData<MusicDatabase>(DB_LIST_KEY);
    if (dbs.length === 0) {
      saveLocalData(DB_LIST_KEY, DEFAULT_DATABASES);
      return DEFAULT_DATABASES;
    }
    return dbs;
  },

  createDatabase(name: string, description: string, filterType: 'all' | 'band' | 'genre' | 'none', filterValue: string): string {
    const dbs = this.getDatabases();
    const cleanId = 'db-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = cleanId || 'db-' + Math.random().toString(36).substring(2, 9);
    
    // Check if duplicate ID
    if (dbs.some(d => d.id === id)) {
      throw new Error(`A database with name "${name}" already exists.`);
    }

    const newDb: MusicDatabase = {
      id,
      name,
      description,
      filterType,
      filterValue,
      createdAt: new Date().toISOString()
    };
    
    dbs.push(newDb);
    saveLocalData(DB_LIST_KEY, dbs);

    // Seed appropriate content for this database
    const key = `${SONGS_KEY}_${id}`;
    let initialSongs: Song[] = [];
    
    if (filterType === 'all') {
      // Clone from default
      const defaultSongs = getLocalData<Song>(SONGS_KEY);
      initialSongs = defaultSongs.length > 0 ? defaultSongs : SEED_SONGS;
    } else if (filterType === 'band') {
      const searchVal = filterValue.trim().toLowerCase();
      const combined = [...SEED_SONGS, ...CLOUD_TEARS_SEED_SONGS];
      initialSongs = combined.filter(s => 
        (s.singerName.en && s.singerName.en.toLowerCase().includes(searchVal)) ||
        (s.singerName.ja && s.singerName.ja.toLowerCase().includes(searchVal))
      );
    } else if (filterType === 'genre') {
      const searchVal = filterValue.trim().toLowerCase();
      const combined = [...SEED_SONGS, ...CLOUD_TEARS_SEED_SONGS];
      initialSongs = combined.filter(s => 
        s.genres.some(g => g.toLowerCase().includes(searchVal)) ||
        s.tags.some(t => t.toLowerCase().includes(searchVal))
      );
    }
    
    saveLocalData(key, initialSongs);
    return id;
  },

  deleteDatabase(id: string): void {
    if (id === 'db-default') {
      throw new Error("Cannot delete default database!");
    }
    const dbs = this.getDatabases();
    const filtered = dbs.filter(d => d.id !== id);
    saveLocalData(DB_LIST_KEY, filtered);
    
    // Clean up content key
    localStorage.removeItem(`${SONGS_KEY}_${id}`);
    
    // If active was deleted, switch to default
    if (this.getActiveDatabaseId() === id) {
      this.setActiveDatabaseId('db-default');
    }
  },

  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const users = getLocalData<UserProfile>(USERS_KEY);
    return users.find(u => u.uid === userId) || null;
  },

  async createUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!profile.uid) return;
    const users = getLocalData<UserProfile>(USERS_KEY);
    const existingIndex = users.findIndex(u => u.uid === profile.uid);
    
    const newProfile: UserProfile = {
      uid: profile.uid,
      email: profile.email || '',
      displayName: profile.displayName || '',
      photoURL: profile.photoURL || '',
      language: profile.language || Language.EN,
      isAdmin: false,
      isPremium: false,
      raiTokens: 0,
      totalListenMinutes: 0,
      selectedGenres: [],
      ...profile
    } as UserProfile;

    if (existingIndex >= 0) {
      users[existingIndex] = newProfile;
    } else {
      users.push(newProfile);
    }
    saveLocalData(USERS_KEY, users);
  },

  // Songs
  async getSongs(includeInactive = false): Promise<Song[]> {
    const key = this.getSongsKey();
    let songs = getLocalData<Song>(key);
    const activeId = this.getActiveDatabaseId();

    if (songs.length === 0) {
      if (activeId === 'db-cloud-tears') {
        saveLocalData(key, CLOUD_TEARS_SEED_SONGS);
        return includeInactive ? CLOUD_TEARS_SEED_SONGS : CLOUD_TEARS_SEED_SONGS.filter(s => s.isActive);
      } else {
        saveLocalData(key, SEED_SONGS);
        return includeInactive ? SEED_SONGS : SEED_SONGS.filter(s => s.isActive);
      }
    }
    
    // Purge eliminated/legacy songs: Gurenge, Pretender, Yoru ni Kakeru, suno-vagabundo
    const eliminatedIds = ['seed-yoasobi-yoru', 'seed-lisa-gurenge', 'seed-hige-pretender', 'suno-vagabundo'];
    const initialCount = songs.length;
    songs = songs.filter(s => !eliminatedIds.includes(s.id));
    let updated = songs.length !== initialCount;

    // Auto-inject and synchronize all official tracks for active database
    if (activeId === 'db-default') {
      SEED_SONGS.forEach(seedSong => {
        const index = songs.findIndex(s => s.id === seedSong.id);
        if (index === -1) {
          songs.unshift(seedSong);
          updated = true;
        } else {
          // Always keep names, singer names, albumArtUrl in sync with updated catalog, preserve custom audio if set
          songs[index].songName = seedSong.songName;
          songs[index].singerName = seedSong.singerName;
          songs[index].albumName = seedSong.albumName;
          songs[index].albumArtUrl = seedSong.albumArtUrl;
          if (!songs[index].isCustomAudio) {
            songs[index].streamUrl = seedSong.streamUrl;
          }
          songs[index].artistOfficialUrl = seedSong.artistOfficialUrl;
          songs[index].tags = seedSong.tags;
          updated = true;
        }
      });
    }

    // Resolve any custom local audio files stored in IndexedDB
    songs = await Promise.all(songs.map(async (song) => {
      try {
        const hasCustom = await hasCustomAudio(song.id);
        if (hasCustom) {
          const customUrl = await getAudioUrl(song.id);
          if (customUrl) {
            return {
              ...song,
              isCustomAudio: true,
              streamUrl: customUrl
            };
          }
        }
      } catch (err) {
        console.warn('Error resolving custom audio for song:', song.id, err);
      }
      return song;
    }));

    // Ensure all songs have the single unique album cover image
    songs = songs.map(song => {
      if (song.albumArtUrl !== '/images/album_cover_kumoru.jpg') {
        updated = true;
        return { ...song, albumArtUrl: '/images/album_cover_kumoru.jpg' };
      }
      return song;
    });

    // Cleanse any remaining "(Suno AI)" or "AI" string references from singer names
    songs = songs.map(song => {
      if (song.singerName) {
        let changed = false;
        const cleanedSinger: Record<string, string> = {};
        Object.entries(song.singerName).forEach(([lang, val]) => {
          if (typeof val === 'string' && (val.includes('(Suno AI)') || val.includes('AI'))) {
            cleanedSinger[lang] = val.replace(/\s*\(Suno AI\)/g, '').replace(/\bAI\b/gi, '').trim();
            changed = true;
          } else {
            cleanedSinger[lang] = val ?? '';
          }
        });
        if (changed) {
          return { ...song, singerName: cleanedSinger as Record<Language, string> };
        }
      }
      return song;
    });

    if (updated) {
      saveLocalData(key, songs);
    }

    if (includeInactive) return songs;
    return songs.filter(s => s.isActive);
  },

  async addSong(song: Partial<Song>): Promise<string> {
    const key = this.getSongsKey();
    const songs = getLocalData<Song>(key);
    const id = song.id || ('song-' + Math.random().toString(36).substring(2, 9));
    const newSong: Song = {
      ...song,
      id,
      createdAt: song.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      playCount: song.playCount || 0,
      skipCount: song.skipCount || 0,
      avgListenDuration: song.avgListenDuration || 0,
      isActive: song.isActive ?? true,
    } as Song;
    songs.push(newSong);
    saveLocalData(key, songs);
    return id;
  },

  async updateSong(songId: string, updates: Partial<Song>): Promise<void> {
    const key = this.getSongsKey();
    const songs = getLocalData<Song>(key);
    const index = songs.findIndex(s => s.id === songId);
    if (index >= 0) {
      songs[index] = { 
        ...songs[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      saveLocalData(key, songs);
    }
  },

  async deleteSong(songId: string): Promise<void> {
    const key = this.getSongsKey();
    const songs = getLocalData<Song>(key);
    const filtered = songs.filter(s => s.id !== songId);
    saveLocalData(key, filtered);
    try {
      await deleteAudioBlob(songId);
    } catch {
      // Ignore
    }
  },

  async incrementPlayCount(songId: string): Promise<void> {
    const key = this.getSongsKey();
    const songs = getLocalData<Song>(key);
    const index = songs.findIndex(s => s.id === songId);
    if (index >= 0) {
      songs[index].playCount = (songs[index].playCount || 0) + 1;
      saveLocalData(key, songs);
    }
  }
};
