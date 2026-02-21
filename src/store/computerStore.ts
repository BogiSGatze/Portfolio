/**
 * Global state store for the 3D computer / landing page.
 *
 * Manages:
 * - Power state (isPowered) — controls whether the monitor is "on"
 * - Screen glow intensity — affects the CRT bloom effect
 * - Float offset — vertical hover animation value
 * - On-screen avatar — the bouncing Bogi PNG that can be toggled via terminal
 */
import { create } from 'zustand';

interface ComputerState {
  isPowered: boolean;
  screenGlow: number;
  floatOffset: number;
  // 2D prompt screen position in pixels (x, y) — null when not available
  promptScreenPos: [number, number] | null;

  // on-screen PNG avatar (global, floats anywhere on the viewport)
  avatarOnScreen: boolean;
  avatarSrc: string;
  startScreenAvatar: (src?: string) => void;
  stopScreenAvatar: () => void;

  turnOn: () => void;
  turnOff: () => void;
  setScreenGlow: (glow: number) => void;
  setFloatOffset: (offset: number) => void;
  setPromptScreenPos: (pos: [number, number] | null) => void;
}

export const useComputerStore = create<ComputerState>((set) => ({
  isPowered: false,
  screenGlow: 0.3,
  floatOffset: 0,
  promptScreenPos: null,

  // screen avatar defaults — uses the PNG placed in public/
  avatarOnScreen: false,
  avatarSrc: '/bogi.png',

  turnOn: () => set({ isPowered: true, screenGlow: 1 }),
  turnOff: () => set({ isPowered: false, screenGlow: 0.3 }),
  setScreenGlow: (glow) => set({ screenGlow: glow }),
  setFloatOffset: (offset) => set({ floatOffset: offset }),
  setPromptScreenPos: (pos) => set({ promptScreenPos: pos }),

  // avatar controls
  startScreenAvatar: (src = '/bogi.png') => set({ avatarOnScreen: true, avatarSrc: src }),
  stopScreenAvatar: () => set({ avatarOnScreen: false }),
}));
