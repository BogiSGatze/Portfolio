import { create } from 'zustand';

interface ComputerState {
  isPowered: boolean;
  screenGlow: number;
  floatOffset: number;
  turnOn: () => void;
  turnOff: () => void;
  setScreenGlow: (glow: number) => void;
  setFloatOffset: (offset: number) => void;
}

export const useComputerStore = create<ComputerState>((set) => ({
  isPowered: false,
  screenGlow: 0.3,
  floatOffset: 0,
  turnOn: () => set({ isPowered: true, screenGlow: 1 }),
  turnOff: () => set({ isPowered: false, screenGlow: 0.3 }),
  setScreenGlow: (glow) => set({ screenGlow: glow }),
  setFloatOffset: (offset) => set({ floatOffset: offset }),
}));
