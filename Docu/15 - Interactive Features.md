# Phase 5: Interactive Features

> Additional interactive elements: GitHub calendar, music player, and screen avatar.

---

## 🎯 What Was Done

Beyond the core windows, several interactive widgets enhance the desktop experience: a GitHub contribution calendar, a cassette tape music widget, and a floating screen avatar controlled by the terminal.

---

## 🐙 GitHub Widget

Displays the GitHub contribution calendar using `react-github-calendar`.

### Dependency

```json
{
  "react-github-calendar": "^5.0.5"
}
```

### Implementation

```typescript
import GitHubCalendar from 'react-github-calendar';

export function GitHubWidget() {
  return (
    <div className="github-widget">
      <h4>GitHub Activity</h4>
      <GitHubCalendar 
        username="BogisGatze" 
        blockSize={12}
        blockMargin={4}
        fontSize={12}
        theme={{
          light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
        }}
      />
    </div>
  );
}
```

### Theme Customization

The color scheme matches the vaporwave aesthetic:

| Level | Color | Description |
|-------|-------|-------------|
| 0 | `#161b22` | No contributions |
| 1 | `#0e4429` | Low activity |
| 2 | `#006d32` | Medium activity |
| 3 | `#26a641` | High activity |
| 4 | `#39d353` | Very high activity |

---

## 🎵 Cassette Widget

A retro cassette tape that serves as a music player interface.

### Features

- **Visual**: Animated cassette tape with spinning reels
- **Spotify integration**: Opens Spotify playlist
- **Autoplay prompt**: Asks user before playing
- **Reactive**: Reels spin when music is "playing"

### Implementation

```typescript
interface CassetteWidgetProps {
  musicAutoplay: boolean;
}

export function CassetteWidget({ musicAutoplay }: CassetteWidgetProps) {
  return (
    <div className="cassette-widget">
      <div className={`cassette ${musicAutoplay ? 'playing' : ''}`}>
        <div className="reel left" />
        <div className="reel right" />
        <div className="label">MIX TAPE 2025</div>
      </div>
      <button 
        onClick={() => window.open('https://open.spotify.com/...', '_blank')}
      >
        Open Spotify
      </button>
    </div>
  );
}
```

### CSS Animation

```css
.cassette.playing .reel {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 🎵 Music Prompt

A modal that asks for permission before autoplaying music.

```typescript
interface MusicPromptProps {
  showPrompt: boolean;
  notification: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onDismissNotif: () => void;
}

export function MusicPrompt({ 
  showPrompt, 
  notification,
  onAccept, 
  onDecline,
  onDismissNotif 
}: MusicPromptProps) {
  return (
    <>
      {showPrompt && (
        <div className="music-prompt-overlay">
          <div className="music-prompt">
            <h3>🎵 Enable Music?</h3>
            <p>Autoplay background music?</p>
            <div className="buttons">
              <button onClick={onAccept}>Yes</button>
              <button onClick={onDecline}>No</button>
            </div>
          </div>
        </div>
      )}
      
      {notification === 'autoplay' && (
        <div className="music-notification" onClick={onDismissNotif}>
          Music enabled! 🎵
        </div>
      )}
    </>
  );
}
```

---

## 👤 Screen Avatar

A floating PNG avatar that can be controlled via terminal commands.

### Zustand Integration

```typescript
// From computerStore.ts
interface ComputerState {
  avatarOnScreen: boolean;
  avatarSrc: string;
  startScreenAvatar: (src?: string) => void;
  stopScreenAvatar: () => void;
}
```

### Component

```typescript
'use client';

import { useComputerStore } from '@/store/computerStore';
import styles from './ScreenAvatar.module.scss';

export default function ScreenAvatar() {
  const { avatarOnScreen, avatarSrc } = useComputerStore();

  if (!avatarOnScreen) return null;

  return (
    <div className={styles.avatarContainer}>
      <img 
        src={avatarSrc} 
        alt="Bogi" 
        className={styles.avatar}
      />
    </div>
  );
}
```

### Terminal Commands

| Command | Action |
|---------|--------|
| `start avatar` | Orbiting robot around terminal |
| `start avatar <file>` | Custom PNG on screen |
| `stop avatar` | Remove all avatars |

### SCSS Animation

```scss
// ScreenAvatar.module.scss
.avatarContainer {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 100;
  pointer-events: none;
}

.avatar {
  width: 150px;
  height: auto;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 0, 255, 0.5));
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

---

## 🖱️ Desktop Icons

Clickable icons that open windows:

```typescript
interface DesktopIconsProps {
  openWin: (id: string) => void;
}

export function DesktopIcons({ openWin }: DesktopIconsProps) {
  const icons = [
    { id: 'code-win', label: 'Terminal', icon: '💻' },
    { id: 'games-win', label: 'Games.exe', icon: '🎮' },
    { id: 'projects-win', label: 'Projects', icon: '📁' },
    { id: 'cv-win', label: 'CV', icon: '📄' },
    { id: 'gallery-win', label: 'Gallery', icon: '🖼️' },
    { id: 'map-win', label: 'Map', icon: '🗺️' },
  ];

  return (
    <div className="desktop-icons">
      {icons.map(({ id, label, icon }) => (
        <div 
          key={id} 
          className="desktop-icon"
          onClick={() => openWin(id)}
        >
          <span className="icon-emoji">{icon}</span>
          <span className="icon-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Feature Summary

| Feature | Library/Method | User Interaction |
|---------|---------------|------------------|
| GitHub Calendar | `react-github-calendar` | View only |
| Cassette Widget | Custom CSS/Spotify link | Click to open Spotify |
| Music Prompt | React state/modal | Yes/No buttons |
| Screen Avatar | Zustand + CSS animation | Terminal commands |
| Desktop Icons | Custom component | Click to open window |

---

## 🔗 Related Documentation

- [[04 - State Management|State Management]] — Zustand for avatar state
- [[11 - Terminal Implementation|Terminal Implementation]] — Avatar commands
- [[12 - Desktop Components|Desktop Components]] — Window opening

---

## 📝 Summary

| Widget | Key Tech |
|--------|----------|
| GitHub Calendar | `react-github-calendar` |
| Cassette | CSS animations, Spotify API |
| Music Prompt | React state, conditional render |
| Screen Avatar | Zustand, CSS modules |
| Desktop Icons | Array mapping, click handlers |
