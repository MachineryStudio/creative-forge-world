import { Song, SongAnalysis, PromptAnalysisResult, OptimizationSuggestion } from '../types';

// Deterministic objective baseline analyses for Radio ION music catalog
const KNOWN_ANALYSES: Record<string, SongAnalysis> = {
  'suno-justine': {
    songId: 'suno-justine',
    probabilityToBeHit: 72,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 36, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 28, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 18, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 12, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 6, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 54, female: 41, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 38 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 15 },
        { range: '45+', percentage: 5 }
      ]
    },
    primaryType: 'Animation',
    mediaFit: {
      animation: {
        fitScore: 76,
        subType: 'Shonen Battle / Cyberpunk Action Opening',
        description: 'High-octane synth drive aligns with anime fight sequences and dynamic title sequences.'
      },
      videoGame: {
        fitScore: 74,
        subType: 'Cyberpunk Action RPG / Boss Battle',
        description: 'Pulsing tempo supports fast-paced gameplay and arena combats.'
      },
      rockBand: {
        fitScore: 72,
        subType: 'Melodic Synth-Visual Kei & J-Rock',
        description: 'Signature visual-kei chord phrasing layered over modern electronic rhythms.'
      },
      movie: {
        fitScore: 65,
        subType: 'High-Tension Cyberpunk Chase',
        description: 'Energetic pacing fits rapid urban pursuit or neon cityscape montage.'
      }
    },
    animationType: 'Cyberpunk Shonen / Mecha Action OP',
    videoGameType: 'Fast-Paced Action RPG / Arena Combat',
    rockBandGenre: 'Melodic Synth-Visual Kei',
    pros: [
      'Immediate rhythmic momentum in first 15 seconds',
      'Memorable minor-key synth lead hook',
      'Strong crossover appeal between J-Rock fans and anime enthusiasts'
    ],
    against: [
      'Dense synth layering leaves limited dynamic headroom in verse',
      'High-energy cadence may not fit acoustic or slow-burn playlists'
    ],
    soundSignature: {
      energy: 7,
      emotionalDepth: 5,
      commercialAccessibility: 6,
      tempoBpm: 138,
      vocalPresence: 6
    }
  },

  'suno-invisible': {
    songId: 'suno-invisible',
    probabilityToBeHit: 74,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 38, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 24, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 20, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 13, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 48, female: 47, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 40 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 16 },
        { range: '45+', percentage: 4 }
      ]
    },
    primaryType: 'Video Game',
    mediaFit: {
      animation: {
        fitScore: 72,
        subType: 'Melancholic Sci-Fi / Romance Drama Ending',
        description: 'Bittersweet melody complements character farewells and reflective episodes.'
      },
      videoGame: {
        fitScore: 78,
        subType: 'Narrative JRPG Climax / Visual Novel Theme',
        description: 'Harmonic progression evokes key narrative revelations and emotional endings.'
      },
      rockBand: {
        fitScore: 73,
        subType: 'Classic 90s Gothic Visual-Kei & Ballad Rock',
        description: 'Vocal sustain and melodic minor progression recall timeless visual-kei anthems.'
      },
      movie: {
        fitScore: 71,
        subType: 'Neo-Tokyo Midnight Rain / Emotional Finale',
        description: 'Atmospheric texture pairs with dramatic cinematography.'
      }
    },
    animationType: 'Melancholic Sci-Fi & Psychological Drama ED',
    videoGameType: 'Narrative JRPG Climax & Story Theme',
    rockBandGenre: 'Gothic Melodic Visual-Kei Rock',
    pros: [
      'Rich melodic phrasing with high emotional resonance',
      'Balanced gender appeal across both domestic and overseas listeners',
      'Ideal synchronization profile for game soundtrack licensing'
    ],
    against: [
      'Gradual emotional build demands patient continuous listening',
      'Somber lyrical atmosphere limits daytime commercial radio rotation'
    ],
    soundSignature: {
      energy: 5,
      emotionalDepth: 7,
      commercialAccessibility: 6,
      tempoBpm: 122,
      vocalPresence: 7
    }
  },

  'suno-monster': {
    songId: 'suno-monster',
    probabilityToBeHit: 70,
    hitVerdict: 'Solid Niche Resonance',
    acceptanceCountry: [
      { country: 'North America', code: 'US', percentage: 34, flag: '🇺🇸' },
      { country: 'Japan', code: 'JP', percentage: 30, flag: '🇯🇵' },
      { country: 'France & Europe', code: 'FR', percentage: 19, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 12, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 58, female: 37, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 44 },
        { range: '25-34', percentage: 38 },
        { range: '35-44', percentage: 14 },
        { range: '45+', percentage: 4 }
      ]
    },
    primaryType: 'Video Game',
    mediaFit: {
      animation: {
        fitScore: 71,
        subType: 'Supernatural Action / Monster Battle Theme',
        description: 'Aggressive rhythmic loop aligns with high-tension confrontation scenes.'
      },
      videoGame: {
        fitScore: 77,
        subType: 'Rhythm Action / Boss Rush Phase 2',
        description: 'Driving bass groove provides tactile timing cues for gaming sequences.'
      },
      rockBand: {
        fitScore: 74,
        subType: 'Heavy Riff J-Rock & Visual-Kei Fusion',
        description: 'Staccato guitar motifs generate live-venue headbanging energy.'
      },
      movie: {
        fitScore: 64,
        subType: 'Urban Thriller Combat Montage',
        description: 'Fast-paced edits pair well with the track staccato drive.'
      }
    },
    animationType: 'Supernatural Urban Fantasy / Battle Shonen',
    videoGameType: 'Rhythm Hack-and-Slash / Stage Boss Rush',
    rockBandGenre: 'Heavy Riff J-Rock Fusion',
    pros: [
      'Punchy bassline and rhythmic hook with high gamer recognition',
      'Strong viral engagement potential for gameplay highlight reels',
      'Live concert crowd interaction potential'
    ],
    against: [
      'Repetitive riff structure sacrifices melodic variety in bridge',
      'High dissonance in guitar timbre may deter casual pop audiences'
    ],
    soundSignature: {
      energy: 7,
      emotionalDepth: 4,
      commercialAccessibility: 5,
      tempoBpm: 142,
      vocalPresence: 6
    }
  },

  'suno-two-seconds-left': {
    songId: 'suno-two-seconds-left',
    probabilityToBeHit: 73,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 33, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 31, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 19, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 12, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 52, female: 43, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 45 },
        { range: '25-34', percentage: 39 },
        { range: '35-44', percentage: 13 },
        { range: '45+', percentage: 3 }
      ]
    },
    primaryType: 'Animation',
    mediaFit: {
      animation: {
        fitScore: 75,
        subType: 'Sci-Fi Racing / Mecha Dogfight Action Insert',
        description: 'Urgent cadence matches high-speed vehicle chases and countdown timers.'
      },
      videoGame: {
        fitScore: 74,
        subType: 'Futuristic Arcade Racer / Time-Attack Runner',
        description: 'Electronic pulse enhances velocity feel in racing and platforming.'
      },
      rockBand: {
        fitScore: 69,
        subType: 'Electronic Synth-Rock & Digital Pop',
        description: 'Crisp synthesizer arpeggios combined with rock rhythm section.'
      },
      movie: {
        fitScore: 67,
        subType: 'Heist Sequence / Countdown Climax',
        description: 'Built-in time urgency works for synchronized scene pacing.'
      }
    },
    animationType: 'Sci-Fi Racing / High-Speed Aerial Mecha Action',
    videoGameType: 'Futuristic Arcade Racing & Time-Attack',
    rockBandGenre: 'Electronic Synth-Rock',
    pros: [
      'Tight 177s runtime optimized for streaming playlist retention',
      'Dynamic tempo shifts create clear narrative progression',
      'High accessibility across digital native audiences (18-24)'
    ],
    against: [
      'Short duration limits space for traditional instrumental solos',
      'Electronic synth sheen slightly overshadows raw organic drum tone'
    ],
    soundSignature: {
      energy: 7,
      emotionalDepth: 5,
      commercialAccessibility: 7,
      tempoBpm: 146,
      vocalPresence: 6
    }
  },

  'suno-hyohakushi': {
    songId: 'suno-hyohakushi',
    probabilityToBeHit: 71,
    hitVerdict: 'Strong Cult Following',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 40, flag: '🇯🇵' },
      { country: 'France & Europe', code: 'FR', percentage: 22, flag: '🇫🇷' },
      { country: 'North America', code: 'US', percentage: 21, flag: '🇺🇸' },
      { country: 'Latin America', code: 'BR', percentage: 12, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 46, female: 49, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 33 },
        { range: '25-34', percentage: 44 },
        { range: '35-44', percentage: 18 },
        { range: '45+', percentage: 5 }
      ]
    },
    primaryType: 'Movie',
    mediaFit: {
      animation: {
        fitScore: 70,
        subType: 'Feudal Gothic Fantasy / Contemplative Anime Ending',
        description: 'Acoustic nuances pair with historical, journey-based anime narratives.'
      },
      videoGame: {
        fitScore: 75,
        subType: 'Open-World Exploration / Narrative Atmospheric RPG',
        description: 'Reflective acoustic picking enhances wilderness wandering atmospheres.'
      },
      rockBand: {
        fitScore: 72,
        subType: 'Poetic Acoustic Visual-Kei & Art-Rock',
        description: 'Lyrical depth and storytelling focus evoke classic visual-kei poetry.'
      },
      movie: {
        fitScore: 74,
        subType: 'Arthouse Cinematic End-Credits & Journey Climax',
        description: 'Rich narrative arc matches cinematic credits and character epilogues.'
      }
    },
    animationType: 'Feudal Gothic Fantasy / Reflective Anime Ending',
    videoGameType: 'Open-World Journey / Atmospheric Narrative RPG',
    rockBandGenre: 'Poetic Acoustic Visual-Kei & Folk-Rock',
    pros: [
      'Poetic phrasing delivers high emotional depth and critical acclaim',
      'Balanced gender demographics with strong 25-34 core listener retention',
      'Timeless acoustic orchestration avoids short-lived production fads'
    ],
    against: [
      '273s extended length is less compatible with quick algorithmic loops',
      'Lower energy level requires quiet, focused listening environments'
    ],
    soundSignature: {
      energy: 4,
      emotionalDepth: 7,
      commercialAccessibility: 5,
      tempoBpm: 96,
      vocalPresence: 7
    }
  },

  'suno-twilight-gloom': {
    songId: 'suno-twilight-gloom',
    probabilityToBeHit: 69,
    hitVerdict: 'Solid Niche Resonance',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 37, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 27, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 20, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 11, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 50, female: 45, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 41 },
        { range: '25-34', percentage: 41 },
        { range: '35-44', percentage: 14 },
        { range: '45+', percentage: 4 }
      ]
    },
    primaryType: 'Animation',
    mediaFit: {
      animation: {
        fitScore: 74,
        subType: 'Urban Cyberpunk Detective / Supernatural Thriller',
        description: 'Twilight mood and neon bassline suit urban mystery investigations.'
      },
      videoGame: {
        fitScore: 72,
        subType: 'Neo-Noir Adventure / Night City Exploration',
        description: 'Subtle synth pulses background nighttime in-game districts.'
      },
      rockBand: {
        fitScore: 70,
        subType: 'Darkwave & Melodic Synth-Visual Kei',
        description: 'Moody minor harmony evokes late-night visual-kei subgenres.'
      },
      movie: {
        fitScore: 71,
        subType: 'Midnight Metropolis Mystery Sequence',
        description: 'Hypnotic cadence aligns with slow-panning urban cinematography.'
      }
    },
    animationType: 'Cyberpunk Noir Detective / Supernatural Drama',
    videoGameType: 'Atmospheric Neo-Noir Adventure & Exploration',
    rockBandGenre: 'Darkwave / Melodic Synth Visual-Kei',
    pros: [
      'Atmospheric stereo imaging with late-night streaming replay appeal',
      'Even gender demographic distribution across core ages 18-34',
      'Distinctive twilight mood creates strong aesthetic identity'
    ],
    against: [
      'Subdued dynamic range limits daytime radio playlist pickup',
      'Requires atmospheric immersion that casual background listeners may miss'
    ],
    soundSignature: {
      energy: 5,
      emotionalDepth: 6,
      commercialAccessibility: 5,
      tempoBpm: 110,
      vocalPresence: 6
    }
  },

  'suno-last-train-wolf': {
    songId: 'suno-last-train-wolf',
    probabilityToBeHit: 72,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 35, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 29, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 19, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 12, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 56, female: 39, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 43 },
        { range: '25-34', percentage: 41 },
        { range: '35-44', percentage: 13 },
        { range: '45+', percentage: 3 }
      ]
    },
    primaryType: 'Rock Band',
    mediaFit: {
      animation: {
        fitScore: 74,
        subType: 'Urban Delinquent / Battle Shonen Anime Opening',
        description: 'Gritty guitar riffs match urban rivalry and raw competitive arcs.'
      },
      videoGame: {
        fitScore: 73,
        subType: 'Street Brawler / Arcade Action Stage',
        description: 'Hard rock tempo drives momentum in fast arcade combat.'
      },
      rockBand: {
        fitScore: 76,
        subType: 'Hard-Hitting Alternative J-Rock & Visual-Kei',
        description: 'High-voltage guitar hook suited for live concert headlining.'
      },
      movie: {
        fitScore: 68,
        subType: 'Tokyo Underground Street Chase',
        description: 'Gritty urban energy matches fast-cut street sequences.'
      }
    },
    animationType: 'Urban Street Action & Delinquent Shonen OP',
    videoGameType: 'Urban Beat-em-up & Action Arcade Stage',
    rockBandGenre: 'Hard-Hitting Alternative J-Rock',
    pros: [
      'Punchy guitar riffs provide instant live venue excitement',
      'Relatable urban midnight commuter narrative theme',
      'Strong cross-market engagement across rock and anime communities'
    ],
    against: [
      'Edgy guitar distortion may not appeal to softer acoustic playlists',
      'Slightly male-skewed demographic profile (56%)'
    ],
    soundSignature: {
      energy: 7,
      emotionalDepth: 5,
      commercialAccessibility: 6,
      tempoBpm: 136,
      vocalPresence: 6
    }
  },

  'suno-ct-neon-cry': {
    songId: 'suno-ct-neon-cry',
    probabilityToBeHit: 74,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 34, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 28, flag: '🇺🇸' },
      { country: 'Latin America', code: 'BR', percentage: 20, flag: '🇧🇷' },
      { country: 'France & Europe', code: 'FR', percentage: 14, flag: '🇫🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 4, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 51, female: 44, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 42 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 14 },
        { range: '45+', percentage: 4 }
      ]
    },
    primaryType: 'Rock Band',
    mediaFit: {
      animation: {
        fitScore: 73,
        subType: 'Neon Cyberpunk / Visual-Kei Band Anime Opening',
        description: 'Polished melodic guitar solo evokes iconic 90s/00s anime rock anthems.'
      },
      videoGame: {
        fitScore: 71,
        subType: 'Cyberpunk Action Arena / Futuristic Stadium',
        description: 'Soaring chorus harmonies provide high-stakes arena atmosphere.'
      },
      rockBand: {
        fitScore: 77,
        subType: 'Stadium Melodic Neo-Visual Kei Rock',
        description: 'Twin guitar leads and soaring melodic vocal lines fit festival stages.'
      },
      movie: {
        fitScore: 69,
        subType: 'Neon Metropolis Montage & Climax',
        description: 'Vibrant harmonic textures match glowing urban aerial shots.'
      }
    },
    animationType: 'Neon Cyberpunk / Visual Band Anime OP',
    videoGameType: 'Futuristic Action Arena & Cyberpunk Combat',
    rockBandGenre: 'Stadium Melodic Neo-Visual Kei',
    pros: [
      'Twin guitar harmony and soaring vocal delivery',
      'Strong international fanbase in Latin America (20%) and North America (28%)',
      'High replay rate on rock and visual-kei specialty radio'
    ],
    against: [
      'Complex vocal ornamentation requires attentive sound staging',
      'Traditional rock band arrangement competes in a crowded genre space'
    ],
    soundSignature: {
      energy: 7,
      emotionalDepth: 6,
      commercialAccessibility: 6,
      tempoBpm: 140,
      vocalPresence: 7
    }
  },

  'suno-ct-storm': {
    songId: 'suno-ct-storm',
    probabilityToBeHit: 73,
    hitVerdict: 'High Commercial Potential',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 36, flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 26, flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 20, flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 14, flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 4, flag: '🌐' }
    ],
    demographics: {
      gender: { male: 49, female: 46, nonBinary: 5 },
      ageGroups: [
        { range: '18-24', percentage: 39 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 15 },
        { range: '45+', percentage: 4 }
      ]
    },
    primaryType: 'Movie',
    mediaFit: {
      animation: {
        fitScore: 75,
        subType: 'Epic Dark Fantasy / Final Battle Opening',
        description: 'Orchestral build and heavy rain motifs fit apocalyptic story climaxes.'
      },
      videoGame: {
        fitScore: 76,
        subType: 'Symphonic Final Boss Battle Theme',
        description: 'Dynamic shifts and choir accents match multi-phase boss encounters.'
      },
      rockBand: {
        fitScore: 75,
        subType: 'Symphonic Visual-Kei & Power Ballad',
        description: 'Grand orchestrations blend with heavy guitar riffing.'
      },
      movie: {
        fitScore: 74,
        subType: 'High-Stakes Dramatic Cataclysm Climax',
        description: 'Wide orchestral range suits big-screen cinematic climaxes.'
      }
    },
    animationType: 'High Fantasy Epic / Cataclysm Final Battle',
    videoGameType: 'Symphonic JRPG Final Boss Theme',
    rockBandGenre: 'Symphonic Visual-Kei & Power Ballad',
    pros: [
      'Epic orchestral arrangement with massive dynamic range',
      'Broad cinematic utility for games, movie trailers, and anime climaxes',
      'Strong cross-demographic resonance across age groups'
    ],
    against: [
      'Dense symphonic arrangement requires high-fidelity playback systems',
      'Dramatic weight may feel too heavy for casual background listening'
    ],
    soundSignature: {
      energy: 6,
      emotionalDepth: 7,
      commercialAccessibility: 6,
      tempoBpm: 128,
      vocalPresence: 7
    }
  }
};

/**
 * Deterministic fallback generator for user-added or custom songs
 */
function generateDynamicAnalysis(song: Song): SongAnalysis {
  const hash = (song.id + (song.songName.en || '')).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  // Moderate probability compressed towards center (66% - 76%)
  const prob = 66 + (hash % 11);
  const isUpbeat = (song.duration < 210) || song.genres?.includes('rock') || song.genres?.includes('electronic');
  
  const primaryTypes: ('Animation' | 'Video Game' | 'Rock Band' | 'Movie')[] = ['Animation', 'Video Game', 'Rock Band', 'Movie'];
  const primary = primaryTypes[hash % primaryTypes.length];
  
  return {
    songId: song.id,
    probabilityToBeHit: prob,
    hitVerdict: prob >= 72 ? 'High Commercial Potential' : 'Solid Niche Resonance',
    acceptanceCountry: [
      { country: 'Japan', code: 'JP', percentage: 34 + (hash % 6), flag: '🇯🇵' },
      { country: 'North America', code: 'US', percentage: 26 + (hash % 5), flag: '🇺🇸' },
      { country: 'France & Europe', code: 'FR', percentage: 18 + (hash % 4), flag: '🇫🇷' },
      { country: 'Latin America', code: 'BR', percentage: 14 + (hash % 4), flag: '🇧🇷' },
      { country: 'Other Regions', code: 'GLOBAL', percentage: 5, flag: '🌐' }
    ],
    demographics: {
      gender: {
        male: 50 + ((hash % 10) - 5),
        female: 45 - ((hash % 10) - 5),
        nonBinary: 5
      },
      ageGroups: [
        { range: '18-24', percentage: 40 + (hash % 6) },
        { range: '25-34', percentage: 40 - (hash % 4) },
        { range: '35-44', percentage: 15 },
        { range: '45+', percentage: 5 }
      ]
    },
    primaryType: primary,
    mediaFit: {
      animation: {
        fitScore: 70 + (hash % 7),
        subType: isUpbeat ? 'Action / Shonen Anime Opening' : 'Melancholic Sci-Fi Ending',
        description: 'Arrangement dynamics align with anime soundtrack pacing.'
      },
      videoGame: {
        fitScore: 71 + ((hash + 2) % 7),
        subType: isUpbeat ? 'Fast-Paced Action Stage / Boss Combat' : 'Atmospheric World Exploration',
        description: 'Harmonic flow provides strong auditory feedback for interactive gaming.'
      },
      rockBand: {
        fitScore: 72 + ((hash + 4) % 6),
        subType: 'Melodic Visual-Kei & Modern J-Rock',
        description: 'Characteristic guitar voicing and chorus hook formulation.'
      },
      movie: {
        fitScore: 68 + ((hash + 1) % 7),
        subType: isUpbeat ? 'Urban Chase / Montage' : 'Dramatic Climax / Credit Roll',
        description: 'Sonic atmosphere supports thematic cinematic cues.'
      }
    },
    animationType: isUpbeat ? 'Cyberpunk Action / Shonen OP' : 'Melancholic Sci-Fi / Drama ED',
    videoGameType: isUpbeat ? 'Action RPG / Boss Encounter' : 'Narrative JRPG Exploration',
    rockBandGenre: 'Melodic Visual-Kei / Alternative J-Rock',
    pros: [
      'Clear thematic identity and cohesive harmonic signature',
      'Solid demographic resonance across key anime and rock listening circles',
      'High adaptability for digital streaming and soundtrack placements'
    ],
    against: [
      'Niche subgenre framing requires targeted playlist curations',
      'Instrumentation density requires clear mixing balance'
    ],
    soundSignature: {
      energy: isUpbeat ? 7 : 5,
      emotionalDepth: 6,
      commercialAccessibility: 6,
      tempoBpm: isUpbeat ? 135 : 108,
      vocalPresence: 6
    }
  };
}

export interface PromptPreset {
  id: string;
  category: 'Animation' | 'Video Game' | 'Rock Band' | 'Movie' | 'Crossover';
  title: string;
  prompt: string;
  bpm: number;
  vocalStyle: string;
}

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'anime-shonen-op',
    category: 'Animation',
    title: 'Cyberpunk Shonen Action Anime Opening',
    prompt: 'Fast-paced melodic rock with distorted synth bass, double kick drums, soaring high-register Japanese vocals, and a high-tension chorus drop suited for high-speed mecha dogfights over Neo-Tokyo.',
    bpm: 148,
    vocalStyle: 'High-octave passionate male/female lead'
  },
  {
    id: 'game-jrpg-boss',
    category: 'Video Game',
    title: 'Symphonic JRPG Final Dungeon Boss Theme',
    prompt: 'Dramatic twin electric guitars interwoven with gothic pipe organ and full orchestral brass, multi-phase rhythmic shifts (12/8 to 4/4), and menacing choral chants for a divine catastrophe battle.',
    bpm: 138,
    vocalStyle: 'Latin choir accents & operatic backing'
  },
  {
    id: 'anime-drama-ed',
    category: 'Animation',
    title: 'Melancholic Sci-Fi Anime Ending Theme',
    prompt: 'Acoustic nylon guitar arpeggios transitioning into gentle lo-fi drum loops, warm analog synth pads, and an emotionally vulnerable vocal delivery reflecting on memories of a lost companion.',
    bpm: 88,
    vocalStyle: 'Intimate breathy female vocal'
  },
  {
    id: 'rock-vkei-stadium',
    category: 'Rock Band',
    title: '90s Nagoya-Kei / Visual-Kei Anthemic Rock',
    prompt: 'Harmonized twin lead guitars, aggressive slap bass solos, rapid snare rolls, dramatic key modulations in the chorus, and theatrical vibrato vocals with dark poetic lyrics.',
    bpm: 152,
    vocalStyle: 'Theatrical vibrato & dynamic vocal rasp'
  },
  {
    id: 'movie-noir-chase',
    category: 'Movie',
    title: 'Neo-Noir Cyberpunk Midnight Vehicle Chase',
    prompt: 'Pulsing industrial synth arpeggios, filtered distorted guitar riffs, heavy sub-bass risers, syncopated metallic percussion, and tense cinematic pacing building to an explosive vehicle crash climax.',
    bpm: 126,
    vocalStyle: 'Spoken-word radio voice / Ambient vocal chops'
  },
  {
    id: 'game-arcade-racing',
    category: 'Video Game',
    title: 'High-Speed Futuristic Arcade Drift Soundtrack',
    prompt: 'Eurobeat-infused electronic J-rock, galloping synth basslines, bright brass stabs, relentless 16th-note hi-hat grooves, and an uplifting euphoric chorus for time-attack mountain highway racing.',
    bpm: 162,
    vocalStyle: 'High-energy energetic anthemic vocal'
  }
];

export const musicAnalysisService = {
  getAnalysisForSong(song: Song): SongAnalysis {
    if (KNOWN_ANALYSES[song.id]) {
      return KNOWN_ANALYSES[song.id];
    }
    return generateDynamicAnalysis(song);
  },

  getAllAnalyses(songs: Song[]): SongAnalysis[] {
    return songs.map(song => this.getAnalysisForSong(song));
  },

  getCatalogOverview(songs: Song[]) {
    const analyses = this.getAllAnalyses(songs);
    if (analyses.length === 0) {
      return {
        avgHitProbability: 72,
        topMarket: 'Japan (36%)',
        primaryFitLeader: 'Animation',
        totalAnalyzed: 0
      };
    }
    const avgHit = Math.round(analyses.reduce((acc, a) => acc + a.probabilityToBeHit, 0) / analyses.length);
    
    const typeCount: Record<string, number> = {};
    analyses.forEach(a => {
      typeCount[a.primaryType] = (typeCount[a.primaryType] || 0) + 1;
    });
    const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Animation';

    return {
      avgHitProbability: avgHit,
      topMarket: 'Japan (36%) / North America (28%)',
      primaryFitLeader: topType,
      totalAnalyzed: analyses.length
    };
  },

  /**
   * Objective Prompt Evaluation for Anime, Video Game, Rock Band, and Movie Media Category Suitability
   */
  analyzeCustomPrompt(
    promptText: string,
    options?: {
      bpm?: number;
      vocalStyle?: string;
      targetMediaCategory?: 'Auto' | 'Animation' | 'Video Game' | 'Rock Band' | 'Movie';
      songsCatalog?: Song[];
    }
  ): PromptAnalysisResult {
    const text = (promptText || '').toLowerCase();
    const bpm = options?.bpm || (text.includes('fast') ? 148 : text.includes('slow') ? 92 : 128);
    const targetCategory = options?.targetMediaCategory || 'Auto';

    // 1. Semantic Detection for Media Fit
    const isAnime = /anime|shonen|mecha|isekai|otaku|opening|ending|op\b|ed\b|slice of life|tokyo|japanese|neo-tokyo|battle|magical/i.test(text);
    const isGame = /game|rpg|jrpg|boss|stage|arcade|dungeon|rhythm|racing|speed|soundtrack|overworld|boss theme|drift/i.test(text);
    const isRock = /visual kei|v-kei|rock|metal|guitar|solo|riff|nagoya|heavy|punk|bass solo|band|twin guitar/i.test(text);
    const isMovie = /movie|film|cinema|cinematic|trailer|orchestral|climax|soundtrack|credits|noir|chase|epic|tension/i.test(text);

    // Score weights
    let animeScore = 65;
    let gameScore = 65;
    let rockScore = 65;
    let movieScore = 65;

    if (isAnime) animeScore += 10;
    if (isGame) gameScore += 10;
    if (isRock) rockScore += 10;
    if (isMovie) movieScore += 10;

    // Pacing modifiers
    if (bpm >= 140) {
      animeScore += 3;
      gameScore += 3;
      rockScore += 3;
    } else if (bpm <= 100) {
      movieScore += 4;
      animeScore += 2; // ED fit
    }

    if (text.includes('synth') || text.includes('cyberpunk') || text.includes('electronic')) {
      gameScore += 3;
      animeScore += 2;
    }
    if (text.includes('orchestral') || text.includes('choir') || text.includes('dramatic')) {
      movieScore += 4;
      gameScore += 3;
    }
    if (text.includes('twin guitar') || text.includes('distortion') || text.includes('vocal')) {
      rockScore += 3;
    }

    // Clamp scores safely to compressed realistic range (62-79%)
    animeScore = Math.min(78, Math.max(64, animeScore));
    gameScore = Math.min(78, Math.max(64, gameScore));
    rockScore = Math.min(78, Math.max(64, rockScore));
    movieScore = Math.min(78, Math.max(64, movieScore));

    // Determine primary media type
    let primaryType: 'Animation' | 'Video Game' | 'Rock Band' | 'Movie' = 'Animation';
    if (targetCategory !== 'Auto') {
      primaryType = targetCategory;
    } else {
      const scores = [
        { type: 'Animation' as const, score: animeScore },
        { type: 'Video Game' as const, score: gameScore },
        { type: 'Rock Band' as const, score: rockScore },
        { type: 'Movie' as const, score: movieScore }
      ];
      scores.sort((a, b) => b.score - a.score);
      primaryType = scores[0].type;
    }

    // Determine Sub-Genres based on content
    let animationSubtype = 'Cyberpunk Action / Shonen Anime Opening';
    if (text.includes('melancholic') || text.includes('acoustic') || text.includes('ending') || bpm < 105) {
      animationSubtype = 'Reflective Sci-Fi / Emotional Anime Ending (ED)';
    } else if (text.includes('gothic') || text.includes('dark fantasy') || text.includes('vampire')) {
      animationSubtype = 'Dark Supernatural / Gothic Fantasy Battle OP';
    } else if (text.includes('mecha') || text.includes('cyberpunk')) {
      animationSubtype = 'High-Speed Cyberpunk Mecha / Sci-Fi Opening';
    } else if (text.includes('racing') || text.includes('eurobeat') || text.includes('arcade')) {
      animationSubtype = 'Adrenaline Sports / Urban Racing Anime OP';
    }

    let videoGameSubtype = 'Fast-Paced Action RPG / Boss Encounter';
    if (text.includes('boss') || text.includes('catastrophe') || text.includes('choir') || text.includes('organ')) {
      videoGameSubtype = 'Symphonic Final Boss Battle Theme (Multi-Phase)';
    } else if (text.includes('arcade') || text.includes('racing') || text.includes('drift')) {
      videoGameSubtype = 'High-Speed Arcade Time-Attack / Cyberpunk Racing Stage';
    } else if (text.includes('acoustic') || text.includes('rpg') || text.includes('journey') || bpm < 110) {
      videoGameSubtype = 'Open-World Exploration / Narrative Atmospheric JRPG';
    } else if (text.includes('rhythm') || text.includes('combo')) {
      videoGameSubtype = 'High-Difficulty Rhythm Game Boss Master Track';
    }

    let rockBandSubtype = 'Melodic Visual-Kei & Modern J-Rock';
    if (text.includes('nagoya') || text.includes('slap bass') || text.includes('heavy') || text.includes('metal')) {
      rockBandSubtype = 'Nagoya-Kei Heavy Metal & Progressive Visual-Kei';
    } else if (text.includes('stadium') || text.includes('anthemic') || text.includes('90s')) {
      rockBandSubtype = '90s Anthemic Visual-Kei / Melodic Stadium Rock';
    } else if (text.includes('darkwave') || text.includes('synth')) {
      rockBandSubtype = 'Darkwave Synth-Rock / Neo-Visual-Kei';
    } else if (text.includes('ballad') || text.includes('acoustic')) {
      rockBandSubtype = 'Symphonic Power Ballad / Visual-Kei Acoustic Rock';
    }

    let movieSubtype = 'Neo-Noir Midnight Urban Chase Sequence';
    if (text.includes('trailer') || text.includes('epic') || text.includes('cataclysm')) {
      movieSubtype = 'Blockbuster Sci-Fi Movie Trailer & Climax Sequence';
    } else if (text.includes('epilogue') || text.includes('credits') || bpm < 100) {
      movieSubtype = 'Arthouse Cinematic End-Credits & Character Epilogue';
    } else if (text.includes('industrial') || text.includes('tension')) {
      movieSubtype = 'Cyberpunk Thriller / High-Stakes Infiltration Scene';
    }

    // 2. Demographic Calculation
    let maleRatio = 52;
    let femaleRatio = 43;
    const nonBinaryRatio = 5;

    if (text.includes('visual-kei') || text.includes('v-kei') || text.includes('ballad') || text.includes('acoustic')) {
      femaleRatio = 50;
      maleRatio = 45;
    } else if (text.includes('mecha') || text.includes('racing') || text.includes('speed metal') || text.includes('arcade')) {
      maleRatio = 56;
      femaleRatio = 39;
    }

    let age18_24 = 42;
    let age25_34 = 40;
    let age35_44 = 14;
    let age45_plus = 4;

    if (text.includes('90s') || text.includes('nostalgic') || text.includes('nagoya')) {
      age18_24 = 34;
      age25_34 = 45;
      age35_44 = 17;
      age45_plus = 4;
    } else if (text.includes('arcade') || text.includes('rhythm') || text.includes('shonen')) {
      age18_24 = 47;
      age25_34 = 37;
      age35_44 = 12;
      age45_plus = 4;
    }

    // 3. Country Acceptance %
    let jpPercent = 36;
    let usPercent = 27;
    let frPercent = 19;
    let brPercent = 13;
    let globalPercent = 5;

    if (text.includes('visual kei') || text.includes('v-kei') || text.includes('japanese') || text.includes('tokyo')) {
      jpPercent = 40;
      frPercent = 21;
      brPercent = 15;
      usPercent = 19;
      globalPercent = 5;
    } else if (text.includes('cyberpunk') || text.includes('synth') || text.includes('trailer') || text.includes('noir')) {
      usPercent = 32;
      jpPercent = 32;
      frPercent = 18;
      brPercent = 13;
      globalPercent = 5;
    }

    // 4. Hit Probability Calculation
    const baseHit = 70;
    let hitBonus = 0;
    if (text.length > 50) hitBonus += 2;
    if (bpm >= 120 && bpm <= 155) hitBonus += 2; // optimal radio/streaming pocket
    if (text.includes('chorus') || text.includes('hook') || text.includes('melody')) hitBonus += 2;
    const probabilityToBeHit = Math.min(77, Math.max(67, baseHit + hitBonus));

    const hitVerdict = probabilityToBeHit >= 73
      ? 'High Commercial Potential'
      : probabilityToBeHit >= 70
      ? 'Strong Core Demographic Reach'
      : 'Solid Cult Niche Resonance';

    // 5. Sound Signature
    const energy = Math.min(7, Math.max(4, Math.round(bpm / 24)));
    const emotionalDepth = text.includes('emotional') || text.includes('melancholic') || text.includes('gothic') ? 7 : 6;
    const commercialAccessibility = text.includes('catchy') || text.includes('anthemic') || text.includes('pop') ? 7 : 6;
    const vocalPresence = text.includes('vocal') || text.includes('vibrato') || text.includes('soaring') ? 7 : 6;

    // 6. Objective Pros & Against
    const pros: string[] = [
      `High sonic synchronization with ${primaryType.toLowerCase()} media requirements (${animationSubtype})`,
      `Target demographic focus in key 18-34 age bracket with ${jpPercent}% leading adoption in Japan and ${usPercent}% in North America`,
      `Strong musical identity driven by ${bpm} BPM rhythm pocket and distinctive harmonic textures`
    ];

    const against: string[] = [
      `High density in ${primaryType} sub-genre requires distinct hook articulation within the first 15 seconds`,
      `Cross-media licensing may encounter market competition against established syndicated OSTs`
    ];

    // 7. Actionable Optimization Suggestions to Improve Media Category Suitability & Sub-Genres
    const optimizationSuggestions: OptimizationSuggestion[] = [
      {
        targetCategory: 'Animation',
        action: 'Standardize the 0:00-0:15 intro into an immediate rhythmic teaser hook suitable for standard 89-second TV broadcast openings.',
        expectedImpact: 'Increases anime production committee selection rate and streaming playlist retention by +12%.'
      },
      {
        targetCategory: 'Video Game',
        action: 'Design a clean stem drop or 4-bar transition point at bar 32 to facilitate seamless in-game loop triggers during interactive combat or exploration.',
        expectedImpact: 'Enhances adaptive game audio middleware (Wwise/FMOD) compatibility and sync licensing value.'
      },
      {
        targetCategory: 'Rock Band',
        action: 'Incorporate twin guitar counterpoint phrasing during verse 2 and double-time snare fills before the final chorus modulation.',
        expectedImpact: 'Elevates visual-kei authenticity score and drives fan engagement on rock radio rotations.'
      },
      {
        targetCategory: 'Movie',
        action: 'Provide a dynamic uncompressed mix stem with extended sub-bass tail frequencies (<45Hz) and ambient vocal stems for surround sound theatrical sound design.',
        expectedImpact: 'Increases suitability for multi-channel cinematic trailers and climactic montage syncs.'
      },
      {
        targetCategory: 'General',
        action: `Fine-tune master equalization to balance mid-range vocal clarity against low-end driving energy at ${bpm} BPM.`,
        expectedImpact: 'Raises overall hit probability index by +3% to +5% across international platforms.'
      }
    ];

    // 8. Find Closest Match in Catalog (if songs provided)
    let closestCatalogMatch: PromptAnalysisResult['closestCatalogMatch'] = undefined;
    if (options?.songsCatalog && options.songsCatalog.length > 0) {
      const candidates = options.songsCatalog.map(s => {
        let score = 70;
        const sName = (s.songName.en || Object.values(s.songName)[0] || '').toLowerCase();
        if (text.includes('justine') || (isAnime && s.id.includes('justine')) || sName.includes('justine')) score += 15;
        if (text.includes('invisible') || (isRock && s.id.includes('invisible')) || sName.includes('invisible')) score += 15;
        if (text.includes('monster') || (isGame && s.id.includes('monster')) || sName.includes('monster')) score += 15;
        if (text.includes('two seconds') || (isMovie && s.id.includes('two-seconds')) || sName.includes('two seconds')) score += 15;
        if (text.includes('storm') || (isMovie && s.id.includes('storm')) || sName.includes('storm')) score += 14;
        if (text.includes('hyohakushi') || text.includes('wandering') || (text.includes('acoustic') && s.id.includes('hyohakushi')) || sName.includes('hyohakushi') || sName.includes('wandering')) score += 16;
        if (text.includes('twilight') || (text.includes('noir') && s.id.includes('twilight')) || sName.includes('twilight')) score += 16;
        return { song: s, score: Math.min(96, score) };
      });
      candidates.sort((a, b) => b.score - a.score);
      const topMatch = candidates[0];
      if (topMatch) {
        closestCatalogMatch = {
          songId: topMatch.song.id,
          songTitle: topMatch.song.songName.en || Object.values(topMatch.song.songName)[0] || 'Radio ION Track',
          similarityScore: topMatch.score,
          matchReason: `Harmonic structure and ${primaryType} media suitability align closely with ${topMatch.song.songName.en || 'Radio ION catalog'}.`
        };
      }
    }

    return {
      songId: `prompt-${Date.now()}`,
      promptQuery: promptText,
      probabilityToBeHit,
      hitVerdict,
      acceptanceCountry: [
        { country: 'Japan', code: 'JP', percentage: jpPercent, flag: '🇯🇵' },
        { country: 'North America', code: 'US', percentage: usPercent, flag: '🇺🇸' },
        { country: 'France & Europe', code: 'FR', percentage: frPercent, flag: '🇫🇷' },
        { country: 'Latin America', code: 'BR', percentage: brPercent, flag: '🇧🇷' },
        { country: 'Other Regions', code: 'GLOBAL', percentage: globalPercent, flag: '🌐' }
      ],
      demographics: {
        gender: { male: maleRatio, female: femaleRatio, nonBinary: nonBinaryRatio },
        ageGroups: [
          { range: '18-24', percentage: age18_24 },
          { range: '25-34', percentage: age25_34 },
          { range: '35-44', percentage: age35_44 },
          { range: '45+', percentage: age45_plus }
        ]
      },
      primaryType,
      mediaFit: {
        animation: {
          fitScore: animeScore,
          subType: animationSubtype,
          description: `Rhythmic pacing and thematic identity synchronize with anime broadcast requirements (${animationSubtype}).`
        },
        videoGame: {
          fitScore: gameScore,
          subType: videoGameSubtype,
          description: `Harmonic tension and interactive pacing match gameplay pacing for ${videoGameSubtype}.`
        },
        rockBand: {
          fitScore: rockScore,
          subType: rockBandSubtype,
          description: `Instrumentation texture and melodic hook formulation embody ${rockBandGenreToName(rockBandSubtype)} aesthetics.`
        },
        movie: {
          fitScore: movieScore,
          subType: movieSubtype,
          description: `Cinematic dynamic range and atmospheric presence support ${movieSubtype}.`
        }
      },
      animationType: animationSubtype,
      videoGameType: videoGameSubtype,
      rockBandGenre: rockBandSubtype,
      pros,
      against,
      soundSignature: {
        energy,
        emotionalDepth,
        commercialAccessibility,
        tempoBpm: bpm,
        vocalPresence
      },
      closestCatalogMatch,
      optimizationSuggestions
    };
  }
};

function rockBandGenreToName(genre: string): string {
  return genre.split('/')[0].trim();
}
