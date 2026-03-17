# 💾 BOGI.OS — Retro Portfolio

> *"A love letter to 90s internet aesthetics and the golden age of computing"*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-white?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State-FF9F1C)](https://github.com/pmndrs/zustand)

🌐 **Live Demo:** [https://debate-duel-905db.web.app](https://debate-duel-905db.web.app)

---

## ✨ Features

### 🖥️ Interactive 3D Intro
- Fully interactive **CRT monitor** built with **React Three Fiber**
- Working power button with flash transition effect
- Retro scanline shaders and CRT distortion effects
- Navigate to the desktop environment by "powering on" the machine

### 🗔️ Desktop Environment
- **Draggable windows** with neobrutalist design
- Functional **terminal** with custom commands
- **Projects window** showcasing my work with live links
- **Games collection** — because a personal site should have personality
- **Photo gallery** with vaporwave aesthetics
- Interactive **map** showing my location
- Working **clock** and system tray

### 🎵 Vaporwave Aesthetics
- Animated cassette tape music player
- Retro color palette (hot pink, cyan, lime)
- Neobrutalist UI elements with bold borders and shadows
- Animated CRT background effects
- Custom cursor and hover states

### 📊 GitHub Integration
- **GitHub Calendar** widget showing contribution graph
- Direct links to repositories
- Project cards with tech stack badges

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **3D Graphics** | Three.js + React Three Fiber |
| **Styling** | SCSS Modules + Tailwind CSS |
| **State Management** | Zustand |
| **Deployment** | GitHub Pages |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 3D intro landing page
│   ├── desktop/           # Desktop environment
│   └── xp/                # XP-themed variant
├── components/
│   ├── 3d/                # Three.js components
│   │   ├── Computer.tsx   # 3D CRT monitor model
│   │   ├── Scene.tsx      # Main 3D scene
│   │   └── ModelMonitor.tsx
│   ├── desktop/           # Desktop UI components
│   │   ├── ProjectsWindow.tsx
│   │   ├── TerminalWindow.tsx
│   │   ├── GamesWindow.tsx
│   │   ├── GitHubWidget.tsx
│   │   ├── CassetteWidget.tsx
│   │   └── ...
│   └── ui/                # Shared UI components
├── constants/
│   └── desktopData.ts     # All content data
├── store/
│   └── computerStore.ts   # Zustand state management
├── styles/                # SCSS modules & CSS
└── hooks/                 # Custom React hooks
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/BogisGatze/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🎮 Desktop Commands

The terminal supports the following commands:

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `about` | Display information about me |
| `skills` | List my technical skills |
| `contact` | Show contact information |
| `clear` | Clear terminal output |
| `neofetch` | Display system info (just for fun) |

---

## 📝 Projects Showcase

| Project | Tech Stack | Description |
|---------|------------|-------------|
| **Debate Duel** | React, Node.js, Firebase | Platform for hosting and voting in online debates |
| **Library App** | Kotlin, XML, Firebase | Android app for managing personal book collections |
| **Portfolio** | Next.js, Three.js, TypeScript | This very website you're looking at |

---

## 🎨 Design Philosophy

> "I would love to bring the 90s internet aesthetics back to life again."

This portfolio is designed to be:
- **Playful** — Gaming references, retro UI, eastereggs
- **Interactive** — Not just a static page, but an experience
- **Personal** — Shows who I am beyond just code
- **Nostalgic** — Celebrating the early web's charm

---

## 📸 Screenshots

*Coming soon — or better yet, visit the [live site](https://bogisgatze.github.io/portfolio)!*

---

## 📬 Contact

- 🐙 **GitHub:** [@BogisGatze](https://github.com/BogisGatze)
- 📧 **Email:** *[bogi.csizm@gmail.com]*

---

## 🙏 Acknowledgments

- 3D computer model inspiration from the retro computing community
- Color palette inspired by vaporwave and synthwave aesthetics
- Neobrutalist design trends from modern web design

---

<p align="center">
  <samp>
    Made with 💜 and too much caffeine<br>
    <code>ctrl + alt + del</code> if nothing works
  </samp>
</p>
