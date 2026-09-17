# Phase 4: Desktop Components

> Individual window components: Games, Projects, Gallery, CV, and Map.

---

## 🎯 What Was Done

Six specialized window components were created, each displaying different content from the centralized data store. All follow the same neobrutalist window pattern with consistent styling and behavior.

---

## 🎮 Games Window

Displays a curated list of favorite games with ratings and descriptions.

### Data Source

```typescript
// From constants/desktopData.ts
export interface Game {
  name: string;
  icon?: string;      // Image path
  emoji?: string;     // Fallback emoji
  genre: string;
  platform: string;
  desc: string;
  rating: number;     // 1-5 stars
}

export const GAMES: Game[] = [
  {
    name: 'Fable',
    icon: '/fable.webp',
    genre: 'Action RPG',
    platform: 'PC/Xbox',
    desc: 'The most timeless franchise...',
    rating: 5,
  },
  // ... more games
];
```

### Component Structure

```typescript
export function GamesWindow({ closeWin }) {
  const [selected, setSelected] = useState<Game | null>(null);

  return (
    <div id="games-win" className="draggable nbwin">
      <div className="nbwin-bar">
        <span>Games.exe</span>
        <button onClick={() => closeWin('games-win')}>×</button>
      </div>
      <div className="nbwin-content games-content">
        <div className="games-list">
          {GAMES.map((game) => (
            <div 
              key={game.name} 
              className="game-item"
              onClick={() => setSelected(game)}
            >
              <img src={game.icon} alt={game.name} />
              <span>{game.name}</span>
            </div>
          ))}
        </div>
        {selected && (
          <div className="game-detail">
            <h3>{selected.name}</h3>
            <div className="stars">{'★'.repeat(selected.rating)}</div>
            <p>{selected.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 💼 Projects Window

Showcases portfolio projects with tech stacks, descriptions, and links.

### Data Source

```typescript
export interface Project {
  file: string;           // Filename for display
  name: string;
  tech: string[];
  desc: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  images?: ProjectImage[];
}

export const PROJECTS: Project[] = [
  {
    file: 'portfolio.tsx',
    name: 'Portfolio Website',
    tech: ['React', 'Three.js', 'Next.js', 'TypeScript'],
    desc: 'This very website — a neobrutalist vaporwave portfolio...',
    image: '/projects/portfolio.png',
    githubUrl: 'https://github.com/BogisGatze/portfolio',
    liveUrl: 'https://portfolio-eight-zeta-48.vercel.app',
  },
  // ... more projects
];
```

### Features
- **Project list** with tech stack tags
- **Detail view** with description and image
- **External links** to GitHub and live site

---

## 🖼️ Gallery Window

Image gallery with lightbox-style viewing.

### Data Source

```typescript
export interface GalleryImage {
  src: string;
  title: string;
  description: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/projects/background.png',
    title: 'Vaporwave Desktop',
    description: 'The vaporwave-themed desktop environment...',
  },
  // ... more images
];
```

### Features
- **Grid layout** of thumbnails
- **Click to expand** for full view
- **Navigation** between images
- **Captions** with title and description

---

## 📄 CV Files Window

Downloadable CV documents with PDF viewer.

### Data Source

```typescript
export interface CvFile {
  file: string;
  label: string;
  icon: string;      // Emoji
  path: string;      // Download path
}

export const CV_FILES: CvFile[] = [
  { 
    file: 'Bogi_CV_2025.pdf', 
    label: 'Curriculum Vitae', 
    icon: '📄', 
    path: '/cv/Bogi_CV_2025.pdf' 
  },
  { 
    file: 'Cover_Letter.pdf', 
    label: 'Cover Letter', 
    icon: '✉️', 
    path: '/cv/Cover_Letter.pdf' 
  },
  { 
    file: 'Certificates.pdf', 
    label: 'Certificates & Awards', 
    icon: '🏆', 
    path: '/cv/Certificates.pdf' 
  },
];
```

### Features
- **File list** with icons
- **Download links** for PDFs
- **PDF viewer** popup for preview
- **Draggable popup** window

---

## 🗺️ Map Window

Interactive SVG map showing location with pins.

### Features
- **SVG map** of Germany/Bavaria region
- **Animated pins** showing Roding location
- **Hover effects** on map regions
- **Info panel** with address details

```typescript
export function MapWindow({ closeWin }) {
  return (
    <div id="map-win" className="draggable nbwin">
      <div className="nbwin-bar">
        <span>Map</span>
        <button onClick={() => closeWin('map-win')}>×</button>
      </div>
      <div className="nbwin-content map-content">
        <svg viewBox="0 0 400 500" className="germany-map">
          {/* SVG paths for regions */}
          <path d="..." className="region" />
          <circle cx="320" cy="280" r="8" className="pin" />
          <circle cx="320" cy="280" r="16" className="pin-ring" />
        </svg>
        <div className="map-info">
          <h4>📍 Roding, Bavaria</h4>
          <p>Germany</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Common Window Pattern

All windows follow this structure:

```typescript
export function XxxWindow({ closeWin, bringToFront }) {
  // Local state
  const [selected, setSelected] = useState(null);
  
  return (
    <div 
      id="xxx-win" 
      className="draggable nbwin"
      style={{ display: 'none' }}  // Hidden by default
    >
      {/* Title bar - drag handle */}
      <div className="nbwin-bar">
        <span>Window Title</span>
        <button onClick={() => closeWin('xxx-win')}>×</button>
      </div>
      
      {/* Content */}
      <div className="nbwin-content xxx-content">
        {/* Window-specific content */}
      </div>
    </div>
  );
}
```

### Window Styling Classes

| Class | Purpose |
|-------|---------|
| `.draggable` | Makes window draggable |
| `.nbwin` | Neobrutalist window frame |
| `.nbwin-bar` | Title bar (drag handle) |
| `.nbwin-content` | Scrollable content area |
| `.xxx-content` | Window-specific styling |

---

## 📊 Window Comparison

| Window | Data | Key Features |
|--------|------|--------------|
| Games | `GAMES` array | Ratings, icons, detail panel |
| Projects | `PROJECTS` array | Tech tags, GitHub/live links |
| Gallery | `GALLERY_IMAGES` array | Lightbox, navigation |
| CV Files | `CV_FILES` array | Downloads, PDF viewer |
| Map | Inline SVG | Interactive SVG, pins |
| Terminal | Hook state | Commands, history |

---

## 🔗 Related Documentation

- [[10 - Window Management System|Window Management System]] — Dragging and z-index
- [[11 - Terminal Implementation|Terminal Implementation]] — Terminal specifics
- [[14 - Data Architecture|Data Architecture]] — Centralized data patterns
- [[13 - Styling Architecture|Styling Architecture]] — CSS for windows

---

## 📝 Summary

| Aspect | Pattern |
|--------|---------|
| Data | Imported from constants |
| State | `useState` for selection/visibility |
| Layout | Split pane (list + detail) |
| Images | `/public/` folder |
| Links | External (GitHub) or download (CV) |
| Styling | CSS classes + window-specific |
