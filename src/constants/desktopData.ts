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
  /** Main project image/thumbnail */
  image?: string;
  /** Link to GitHub repository */
  githubUrl?: string;
  /** Link to live website */
  liveUrl?: string;
  /** Optional gallery images – put the files in /public/projects/ */
  images?: ProjectImage[];
}

/** A single image in the standalone gallery */
export interface GalleryImage {
  src: string;
  title: string;
  description: string;
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

/** Represents a training task/assignment */
export interface TrainingTask {
  title: string;
  description: string;
  duration?: string;
  learnings?: string[];
}

/** Represents a tech stack category */
export interface TechStack {
  id: string;
  name: string;
  icon: string;
  tasks: TrainingTask[];
}

/* ── Data ── */

export const GAMES: Game[] = [
  {
    name: 'Fable',
    icon: '/fable.webp',
    genre: 'Action RPG',
    platform: 'PC/Xbox',
    desc: 'A timeless franchise where the details still matter. Will you be the hero, the villain, or something in between? I love its distinctly British humour. Main objective: become the Chicken Chaser you were destined to be!',
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
    desc: "Teamfight Tactics is my competitive comfort game. I play ranked, theory-craft compositions, and occasionally blame the augments. Emerald is still a work in progress.",
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
    icon: '/nobody.png',
    genre: 'Action RPG',
    platform: 'PC',
    desc: "A wildly underrated game. You transform between forms...rat, horse, ghost, dragon...each with unique skills you combine freely. But mostly play as an Egg and vibe to the music (it's truly a masterpiece).",
    rating: 4,
  },
  {
    name: "Assassin's Creed",
    icon: '/ac.png',
    genre: 'Action RPG',
    platform: 'PC/PS5',
    desc: "Peak historical fantasy. Back when stealth actually meant stealth and not just hitting enemies with a glowing spear. The Ezio trilogy? Untouchable. Renaissance rooftops, hidden blades, dramatic family trauma, and that soundtrack that still lives rent free in my head. The older games just had soul. Parkour across Florence, whisper 'Requiescat in pace', disappear into a haystack. We will never emotionally recover.",
    rating: 4,
  },
];

export const PROJECTS: Project[] = [
  {
    file: 'portfolio.tsx',
    name: 'Portfolio Website',
    tech: ['React', 'Three.js', 'Next.js', 'TypeScript'],
    desc: 'This very website \u2014 a neobrutalist vaporwave portfolio built with Next.js, React Three Fiber, and TypeScript. Features an interactive 3D CRT monitor intro, a retro desktop environment with draggable windows, a working terminal, and a love letter to 90s internet aesthetics which I would love to bring to life again.',
    image: '/projects/Portfolio.png',
    liveUrl: 'https://portfolio-eight-zeta-48.vercel.app',
  },
  {
    file: 'debate_duel.kt',
    name: 'Debate Duel',
    tech: ['React', 'Node.js', 'Firebase'],
    desc: 'Debate Duel is a web platform for hosting, joining, and voting in online debates. Users can challenge others, present arguments, and vote for the most convincing side. Built with React and Firebase, it features real-time updates, notifications, and a responsive interface.',
    image: '/projects/debateduel2.png',
    liveUrl: 'https://debate-duel-905db.web.app',
  },
  {
    file: 'library_app.cs',
    name: 'Library App (in development)',
    tech: ['Kotlin', 'XML', 'Firebase'],
    desc: 'An Android library management app built with Kotlin and modern architecture components. Users can organize books into customizable shelves, track reading history, rate titles by mood, add personal notes, and scan barcodes for quick entry. Includes reading analytics and challenge tracking - because if you are going to hoard books, you might as well visualize it properly.',
    image: '/projects/Essential-Books.jpg',
  }
];

export const CV_FILES: CvFile[] = [
  { file: 'Lebenslauf_Boglarka_Csizmadia.pdf', label: 'Lebenslauf', icon: '\u{1F4C4}', path: '/cv/Lebenslauf_Boglarka_Csizmadia.pdf' },
];

/** Lines shown when the terminal first boots up */
export const BOOT_LINES: TerminalLine[] = [
  { type: 'sys', text: 'BOGI.OS v1.0 \u2014 System Boot' },
  { type: 'sys', text: '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' },
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
  'TFT \u2014 ranked strategy enthusiast',
  'Reading \u2014 fiction, fantasy, anything good',
  'Movies \u2014 always watching something new',
  'Gaming \u2014 see Games.exe for the full list',
] as const;

/** Gallery images displayed in the Gallery window */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/projects/background.png',
    title: 'Determination',
    description: 'Building this portfolio involved plenty of trial and error. Here I am manually removing the background from Pengu, who appears in full glory inside Games.exe.',
  },
  {
    src: '/projects/debateduel2.png',
    title: 'Debate Duel \u2014 Home',
    description: 'The landing page of Debate Duel, a platform for hosting and joining online debates. You can also find the app in my Projects window. If you enjoy a good debate, take a look:',
  },
  {
    src: '/projects/tape.png',
    title: 'The Cassette Experiment',
    description: 'The painful process of trying to implement our good old tape animation.',
  },
  {
    src: '/projects/diablo.png',
    title: 'Diablo IV',
    description: 'Dark, gothic, and ruthless \u2014 hours lost in Sanctuary chasing gear that gets replaced next season. I even included a picture from a school presentation because I am still proud of it.',
  },
  {
    src: '/projects/chain loss.png',
    title: 'Chain Loss - The Truth for many (or just me)',
    description: 'A lot of times I mentioned how much I love playing TFT, but am I good at it? Well, here is your answer! I do have my good days as well I promise.',
  },
];
/** Training - Skills learned during Ausbildung organized by tech stack */
export const TRAINING_STACKS: TechStack[] = [
  {
    id: 'csharp',
    name: 'C#',
    icon: '🔷',
    tasks: [
      {
        title: 'Core C# Development',
        description: 'Learned fundamental C# programming concepts including object-oriented design, LINQ, file I/O operations, XML parsing, and building command-line applications.',
      }
    ],
  },
  {
    id: 'kotlin-xml',
    name: 'Kotlin, XML, Java',
    icon: '🟣',
    tasks: [
      {
        title: 'Android App Development',
        description: 'Built Android applications using Kotlin and XML layouts. Learned to work with REST APIs, implement navigation patterns, create responsive UIs, and follow Material Design guidelines.',
      },
      {
        title: 'Code Quality Tools',
        description: 'Gained experience with static code analysis tools like SonarQube and SonarLint to improve code quality, identify potential bugs, and maintain clean codebases.',
      },
      {
        title: 'Error Handling & UX',
        description: 'Learned best practices for error handling, implementing graceful failure patterns, and creating user-friendly feedback through dialogs and notifications.',
      },
      {
        title: 'Software Testing',
        description: 'Practiced manual and automated testing methodologies, bug documentation, and quality assurance processes to ensure software reliability.',
      },
      {
        title: 'UI/UX Implementation',
        description: 'Learned to translate design mockups into functional interfaces, working with typography, color schemes, spacing systems, and responsive layouts.',
      },
      {
        title: 'Authentication & Security',
        description: 'Studied OAuth 2.0 authentication flows, token-based authentication, and secure credential handling in mobile applications.',
      },
      {
        title: 'Hardware Integration',
        description: 'Explored Bluetooth Low Energy (BLE) communication and camera-based features like barcode scanning in Android applications.',
      }
    ],
  },
  {
    id: 'csharp-blazor',
    name: 'C# & Blazor',
    icon: '🔶',
    tasks: [
      {
        title: 'Full-Stack Web Development',
        description: 'Doing a final project using C# and Blazor to build a full-stack web application with frontend components, backend logic, and data visualization features.',
      }
    ],
  },
];
