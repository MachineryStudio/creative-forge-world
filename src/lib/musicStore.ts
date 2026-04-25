import { create } from "zustand";

export type Mood = "clouds" | "planets" | "rain" | "nature" | "off";

interface MusicState {
  on: boolean;
  mood: Mood;
  trackId: string | null;
  setOn: (on: boolean) => void;
  setMood: (mood: Mood) => void;
  setTrack: (id: string, mood: Mood) => void;
}

export const useMusic = create<MusicState>((set) => ({
  on: false,
  mood: "off",
  trackId: null,
  setOn: (on) => set({ on, mood: on ? undefined as never : "off" } as never),
  setMood: (mood) => set({ mood }),
  setTrack: (trackId, mood) => set({ trackId, mood, on: true }),
}));
