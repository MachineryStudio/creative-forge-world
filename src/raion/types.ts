/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Language {
  JA = 'ja',
  EN = 'en',
  FR = 'fr',
  ES = 'es',
  IT = 'it',
  KO = 'ko',
  ZH = 'zh',
  RU = 'ru',
}

export type MultiLangString = {
  [key in Language]?: string;
} & { [key: string]: string | undefined };

export interface Song {
  id: string;
  singerName: MultiLangString;
  songName: MultiLangString;
  streamUrl: string;
  artistOfficialUrl: string;
  albumArtUrl?: string;
  albumName?: MultiLangString;
  releaseDate: unknown; // Firestore Timestamp
  duration: number; // seconds
  genres: string[];
  tags: string[];
  bpm?: number;
  playCount: number;
  skipCount: number;
  avgListenDuration: number;
  createdAt: unknown;
  updatedAt: unknown;
  isActive: boolean;
  isCustomAudio?: boolean;
  audioFileName?: string;
  audioFileSize?: number;
  audioMimeType?: string;
}

export interface Genre {
  id: string;
  name: MultiLangString;
  description: MultiLangString;
  icon: string;
  color: string;
  gradient: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: Language;
  selectedGenres: string[];
  isAdmin: boolean;
  isPremium: boolean;
  raiTokens: number;
  totalListenMinutes: number;
}

export interface MusicDatabase {
  id: string;
  name: string;
  description: string;
  filterType: 'all' | 'band' | 'genre' | 'none';
  filterValue: string;
  createdAt: string;
}

export interface CountryAcceptance {
  country: string;
  code: string;
  percentage: number;
  flag: string;
}

export interface DemographicsBreakdown {
  gender: {
    male: number;
    female: number;
    nonBinary: number;
  };
  ageGroups: {
    range: string;
    percentage: number;
  }[];
}

export interface MediaFitItem {
  fitScore: number; // 0-100 (compressed ~60-80)
  subType: string;
  description: string;
}

export interface MediaFitBreakdown {
  animation: MediaFitItem;
  videoGame: MediaFitItem;
  rockBand: MediaFitItem;
  movie: MediaFitItem;
}

export interface SoundSignatureMetrics {
  energy: number; // 1-10 (mapped 3-7)
  emotionalDepth: number; // 1-10 (mapped 3-7)
  commercialAccessibility: number; // 1-10 (mapped 3-7)
  tempoBpm: number;
  vocalPresence: number; // 1-10 (mapped 3-7)
}

export interface SongAnalysis {
  songId: string;
  probabilityToBeHit: number; // percentage (compressed 65-78%)
  hitVerdict: string;
  acceptanceCountry: CountryAcceptance[];
  demographics: DemographicsBreakdown;
  primaryType: 'Animation' | 'Video Game' | 'Rock Band' | 'Movie';
  mediaFit: MediaFitBreakdown;
  animationType: string;
  videoGameType: string;
  rockBandGenre: string;
  pros: string[];
  against: string[];
  soundSignature: SoundSignatureMetrics;
}

export interface OptimizationSuggestion {
  targetCategory: 'Animation' | 'Video Game' | 'Rock Band' | 'Movie' | 'General';
  action: string;
  expectedImpact: string;
}

export interface PromptAnalysisResult extends SongAnalysis {
  promptQuery: string;
  closestCatalogMatch?: {
    songId: string;
    songTitle: string;
    similarityScore: number;
    matchReason: string;
  };
  optimizationSuggestions: OptimizationSuggestion[];
}

