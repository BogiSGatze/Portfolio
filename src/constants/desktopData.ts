/**
 * Static data used across the desktop page.
 * Keeping data separate from components makes it easy to find, update,
 * and reuse without scrolling through UI code.
 */

/* ── Types ── */

/** Represents a game in the collection */
export interface Game {
  name: string;
  icon?: string;
  emoji?: string;
  genre: string;
  platform: string;
  desc: string;
  rating: number; // 1-5 star rating
}

/** A single gallery image inside a project */
export interface ProjectImage {
  src: string;       // path relative to /public, e.g. "/projects/portfolio-1.png"
  caption: string;   // short description shown under the thumbnail
}

/** Represents a project entry */
export interface Project {
  file: string;
  name: string;
  tech: string[];
  desc: string;
  /** Optional gallery images – put the files in /public/projects/ */
  images?: ProjectImage[];
}

/** Represents a downloadable CV file */
export interface CvFile {
  file: string;
  label: string;
  icon: string;
  path: string;
}

/** A single line in the terminal output */
export interface TerminalLine {
  type: 'in' | 'out' | 'sys' | 'err';
  text: string;
}

/* ── Data ── */

export const GAMES: Game[] = [
  {
    name: 'Fable',
    icon: '/fable.webp',
    genre: 'Action RPG',
    platform: 'PC/Xbox',
    desc: 'The most timeless franchise where details still mattered. Will you be the hero or the villain? Or...nothing? Life has difficult decisions indeed. Love the british humor! Main objective: Be the true Chicken Chaser you were destined to be!',
    rating: 5,
  },
  {
    name: 'Diablo IV',
    icon: '/lilith.webp',
    genre: 'Action RPG',
    platform: 'PC',
    desc: "Dark, gothic, and ruthless. I still haven't explored the entire map, the grind just never ends. Hours lost in Sanctuary, chasing gear that will just be replaced next season anyway. Well...I chose this!",
    rating: 4,
  },
  {
    name: 'TFT',
    icon: '/tft.png',
    genre: 'Autobattler',
    platform: 'PC/Mobile',
    desc: "Teamfight Tactics...the main addiction. Ranked every season, theory-crafting comps at 2am, blaming augments for every single loss. And I still haven't hit Emerald! I am indeed just a noob.",
    rating: 5,
  },
  {
    name: 'Pokemon',
    icon: '/sprigatito.png',
    genre: 'RPG',
    platform: 'Nintendo',
    desc: "The OG. Gotta catch em all! Have I played all the games? Absolutely not! Do I have a bunch of cards? Absolutely! A lifelong companion franchise that keeps finding new ways to pull you back in, for better or worse (mostly at my wallet's expense).",
    rating: 5,
  },
  {
    name: 'WWM',
    emoji: '\u{1F30A}',
    genre: 'Action RPG',
    platform: 'PC',
    desc: 'Where Winds Meet \u2014 breathtaking wuxia open-world. Fluid combat, jaw-dropping vistas. An underrated masterpiece of the genre.',
    rating: 4,
  },
  {
    name: 'Cult Of The Lamb',
    icon: '/cultofthelamb.jpg',
    genre: 'Roguelite',
    platform: 'PC',
    desc: "You are a lamb. You start a cult. You sacrifice your most loyal followers but also clean up their poop (weird power dynamic). It's adorable and deeply disturbing in the absolute best possible way. Definitely recommend!",
    rating: 5,
  },
  {
    name: 'Sims 4',
    icon: '/sims_transparent.png',
    genre: 'Life Sim',
    platform: 'PC',
    desc: 'Spending eight hours on perfecting a sim, another eight hours perfecting a house and calling it a full gaming session. This game is definitely made for chaotic interior designers and I will definitely design my future home in Sims first!',
    rating: 3,
  },
  {
    name: 'Nobody Saves the World',
    emoji: '\u{1F300}',
    genre: 'Action RPG',
    platform: 'PC',
    desc: "A wildly underrated game. You transform between forms...rat, horse, ghost, dragon...each with unique skills you combine freely. But mostly play as an Egg and vibe to the music (it's truly a masterpiece).",
    rating: 4,
  },
  {
    name: "Assassin's Creed",
    icon: '/assassin.png',
    genre: 'Action RPG',
    platform: 'PC/PS5',
    desc: '',
    rating: 4,
  },
];

export const PROJECTS: Project[] = [
  {
    file: 'portfolio.tsx',
    name: 'Portfolio Website',
    tech: ['React', 'Three.js', 'Next.js', 'TypeScript'],
    desc: 'This very website \u2014 a neobrutalist vaporwave portfolio built with Next.js, React Three Fiber, and TypeScript. Features an interactive 3D CRT monitor intro, a retro desktop environment with draggable windows, a working terminal, and a love letter to 90s internet aesthetics which I would love to bring to life again.',
  },
  {
    file: 'debate_duel.kt',
    name: 'Debate Duel',
    tech: ['React', 'Node.js', 'Firebase'],
    desc: 'Who doesnt love to argue with strangers on the internet? Debate Duel is a web platform for hosting, joining, and voting in online debates. Users can challenge others, present arguments, and vote for the most convincing side. The app is built with React and Firebase, featuring real-time updates, notifications, and a modern, responsive UI.',
  },
  {
    file: 'library_app.cs',
    name: 'Library App (still in development)',
    tech: ['Kotlin', 'XML', 'Firebase'],
    desc: 'An Android library management app built with Kotlin and modern architecture components. Users can organize books into customizable shelves, track reading history, rate titles by mood, add personal notes, and scan barcodes for quick entry. Includes reading analytics and challenge tracking - because if you are going to hoard books, you might as well visualize it properly.',  },
];

export const CV_FILES: CvFile[] = [
  { file: 'Bogi_CV_2025.pdf', label: 'Curriculum Vitae', icon: '\u{1F4C4}', path: '/cv/Bogi_CV_2025.pdf' },
  { file: 'Cover_Letter.pdf', label: 'Cover Letter', icon: '\u2709\uFE0F', path: '/cv/Cover_Letter.pdf' },
  { file: 'Certificates.pdf', label: 'Certificates & Awards', icon: '\u{1F3C6}', path: '/cv/Certificates.pdf' },
];

/** Lines shown when the terminal first boots up */
export const BOOT_LINES: TerminalLine[] = [
  { type: 'sys', text: 'BOGI.OS v1.0 \u2014 System Boot' },
  { type: 'sys', text: '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' },
  { type: 'out', text: '' },
  { type: 'out', text: 'Loading modules...' },
  { type: 'out', text: '  \u2726 bogi.config ........ loaded' },
  { type: 'out', text: '  \u2726 portfolio.exe ...... running' },
  { type: 'out', text: '  \u2726 desktop.sys ........ active' },
  { type: 'out', text: '  \u2726 games.dll .......... standby' },
  { type: 'out', text: '  \u2726 map.module ......... active' },
  { type: 'out', text: '' },
  { type: 'sys', text: "> System ready. Type 'help' for commands." },
];

/** Tech skills displayed in the profile panel */
export const TECH_STACK = [
  { name: 'React', hot: true },
  { name: 'Kotlin', hot: true },
  { name: 'Three.js', hot: true },
  { name: 'C#', hot: true },
  { name: 'Java', hot: false },
  { name: 'JavaScript', hot: false },
  { name: 'HTML/CSS', hot: false },
  { name: 'XML', hot: false },
  { name: 'Blazor', hot: false },
  { name: 'PHP', hot: false },
] as const;

/** Hobbies displayed in the profile panel */
export const HOBBIES = [
  'TFT \u2014 dangerously addicted, send help',
  'Reading \u2014 fiction, fantasy, anything good',
  'Movies \u2014 always watching something new',
  'Gaming \u2014 see Games.exe for the full list',
] as const;
