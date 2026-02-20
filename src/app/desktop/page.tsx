'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import BogiTerminal from '@/components/ui/BogiTerminal';
import ScreenAvatar from '../../components/ui/ScreenAvatar';

// Game data
const games = [
  { name: 'FABLE', icon: '/fable.webp', genre: 'ACTION RPG', platform: 'PC / XBOX',
    desc: 'The most timeless franchise where details still mattered. Will you be the hero or the villain of the story? Or....nothing? Life has difficult decisions indeed. Love the british humor! Main objective: Being called Chicken Chaser!', rating: 5 },
  { name: 'DIABLO IV', icon: '/lilith.webp', genre: 'ACTION RPG', platform: 'PC, PS4 / 5, XBOX',
    desc: 'Dark, gothic, and ruthless. I still haven\'t explored the whole map, the grind just never ends. Hours lost in Sanctuary, chasing gear that will just be replaced next season anyway. Well...I chose this!', rating: 4 },
  { name: 'TFT', icon: '/tft_transparent.png', genre: 'AUTOBATTLER', platform: 'PC / MOBILE',
    desc: 'Teamfight Tactics...the biggest addiction. Ranked every season, theory-crafting comps at 2am, blaming augments for every single loss. And I still can\'t get to Emerald! I am indeed a noob.', rating: 5 },
  { name: 'POKEMON', icon: '/sprigatito_transparent.png', genre: 'RPG', platform: 'NINTENDO',
    desc: 'The OG. Gotta catch \'em all. Have I played all the games? Absolutely not! Do I have a bunch of cards? Absolutely! A lifelong companion franchise that keeps finding new ways to pull you back in, for better or worse (at my wallet\'s expense).', rating: 5 },
  { name: 'WHERE WINDS MEET', emoji: '🌊', genre: 'ACTION RPG', platform: 'PC',
    desc: 'A breathtaking wuxia open-world RPG set in ancient China. Fluid combat, stunning landscapes, and a world that genuinely feels alive. An absolute hidden gem. But be careful, the geese are your strongest enemies!', rating: 4 },
  { name: 'CULT OF THE LAMB', icon: '/cultofthelamb.jpg', genre: 'ROGUELITE', platform: 'PC',
    desc: 'You are a lamb. You start a cult. You sacrifice your most loyal followers but also clean up their poop. It\'s adorable and deeply disturbing in the absolute best possible way. Definitely recommend!', rating: 5 },
  { name: 'SIMS 4', icon: '/sims_transparent.png', genre: 'LIFE SIM', platform: 'PC',
    desc: 'Spending eight hours perfecting a sim, another 8 hours perfecting a house and calling it a full gaming session. This game is definitely made for chaotic interior designers and I will definitely design my future home in Sims first!', rating: 3 },
  { name: 'NOBODY SAVES THE WORLD', emoji: '🌀', genre: 'ACTION RPG', platform: 'PC',
    desc: 'A wildly underrated game. You transform between forms...rat, horse, ghost, dragon...each with unique skills you combine freely. But mostly play as an Egg and vibe to the music (it\'s truly a masterpiece)', rating: 4 },
  { name: 'FF XVI', emoji: '🔥', icon: '/clive_transparent.png', genre: 'ACTION RPG', platform: 'PC / PS5',
    desc: 'Final Fantasy XVI goes full action RPG with cinematic Eikon battles that feel like playable anime boss fights. Epic scope, mature story, and one of the best soundtracks in the series. And also my most serious game I\'ve played in a long time, yes!', rating: 4 }
];

export default function Desktop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState('--:--:--');
  const [folderOpen, setFolderOpen] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [zCounter, setZCounter] = useState(20);
  
  // Window refs
  const cassetteRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const cvFilesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const loreRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // lightweight projects list (displayed in Projects window)
  const projects = [
    { id: 'p1', name: 'Retro UI', icon: '/fable.webp', desc: '3D monitor + retro desktop demo', url: '#' },
    { id: 'p2', name: 'TFT Companion', icon: '/tft_transparent.png', desc: 'Small utility & overlay', url: '#' },
    { id: 'p3', name: 'Portfolio Site', icon: '/sprigatito_transparent.png', desc: 'This portfolio', url: '#' },
  ];

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Vaporwave background (replaces previous terrain canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    if (!cx) return;

    let W = 0, H = 0;
    let stars: Array<any> = [];
    let gt = 0;
    let raf = 0;

    const initStars = () => {
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.55,
        r: 0.5 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.6,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      }));
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStars();
    };

    const draw = () => {
      cx.clearRect(0, 0, W, H);
      gt += 0.008;

      // sky gradient
      const sky = cx.createLinearGradient(0, 0, 0, H * 0.62);
      sky.addColorStop(0, '#0d0820');
      sky.addColorStop(0.4, '#1a0a3a');
      sky.addColorStop(0.7, '#3d1060');
      sky.addColorStop(1, '#ff2d9b');
      cx.fillStyle = sky; cx.fillRect(0, 0, W, H);

      // grid floor
      const floorY = H * 0.58;
      const gridH = H - floorY;

      const floor = cx.createLinearGradient(0, floorY, 0, H);
      floor.addColorStop(0, '#c020a0');
      floor.addColorStop(0.4, '#8010c0');
      floor.addColorStop(1, '#200840');
      cx.fillStyle = floor; cx.fillRect(0, floorY, W, gridH);

      // perspective grid
      const vp = { x: W / 2, y: floorY };
      const gridLines = 16;
      cx.strokeStyle = 'rgba(255,45,155,0.35)'; cx.lineWidth = 1;
      for (let i = 0; i <= gridLines; i++) {
        const x = W * i / gridLines;
        cx.beginPath(); cx.moveTo(x, H); cx.lineTo(vp.x, vp.y); cx.stroke();
      }

      // horizontal moving grid lines
      const hLines = 14;
      for (let j = 0; j <= hLines; j++) {
        const t = (j / hLines + gt * 0.3) % 1;
        const ease = t * t;
        const y = floorY + gridH * ease;
        const xSpread = (1 - ease) * W * 0.5;
        const alpha = 0.6 * (1 - Math.abs(t - 0.5) * 1.5);
        cx.strokeStyle = `rgba(255,45,155,${Math.max(0, alpha)})`;
        cx.beginPath(); cx.moveTo(vp.x - xSpread, y); cx.lineTo(vp.x + xSpread, y); cx.stroke();
      }

      // sun
      const sunX = W / 2, sunY = H * 0.38; const sunR = H * 0.14;
      const sg = cx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sg.addColorStop(0, '#ffe44d'); sg.addColorStop(0.4, '#ff8c00'); sg.addColorStop(0.7, '#ff2d9b'); sg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = sg; cx.beginPath(); cx.arc(sunX, sunY, sunR, 0, Math.PI * 2); cx.fill();

      // sun scanlines
      cx.fillStyle = 'rgba(13,8,32,0.25)';
      for (let sl = 0; sl < 14; sl++) {
        const sy = sunY - sunR * 0.6 + sl * (sunR * 1.2 / 14);
        const halfW = Math.sqrt(Math.max(0, sunR * sunR - (sy - sunY) * (sy - sunY)));
        cx.fillRect(sunX - halfW, sy, halfW * 2, 3);
      }

      // stars
      for (const s of stars) {
        s.twinkle += s.speed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
        cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,255,${a})`; cx.fill();
      }

      // horizon glow
      const hg = cx.createLinearGradient(0, floorY - 20, 0, floorY + 20);
      hg.addColorStop(0, 'rgba(255,45,155,0)'); hg.addColorStop(0.5, 'rgba(255,45,155,0.35)'); hg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = hg; cx.fillRect(0, floorY - 20, W, 40);

      // vignette
      const vg = cx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      cx.fillStyle = vg; cx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    resize(); window.addEventListener('resize', resize); draw();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  // Bring to front helper
  const bringToFront = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    setZCounter(prev => {
      const newZ = prev + 1;
      el.style.zIndex = String(newZ);
      return newZ;
    });
  }, []);

  // Draggable hook
  // winRef/handleRef are stable refs — add an `enabled` flag so the effect runs
  // again when a window is conditionally mounted (bio/games windows).
  const useDraggable = (
    winRef: React.RefObject<HTMLDivElement | null>,
    handleRef: React.RefObject<HTMLDivElement | null>,
    enabled: boolean = true
  ) => {
    useEffect(() => {
      if (!enabled) return;
      const win = winRef.current;
      const handle = handleRef.current;
      if (!win || !handle) return;

      let dragging = false;
      let offX = 0, offY = 0;

      const onMouseDown = (e: MouseEvent) => {
        dragging = true;
        // if the window is positioned using transform (centered), convert to pixel left/top
        const rect = win.getBoundingClientRect();
        const cs = getComputedStyle(win);
        if (cs.transform && cs.transform !== 'none') {
          win.style.left = `${rect.left}px`;
          win.style.top = `${rect.top}px`;
          win.style.transform = 'none';
        }
        offX = e.clientX - rect.left;
        offY = e.clientY - rect.top;
        bringToFront(win);
        e.preventDefault();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!dragging) return;
        const x = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, e.clientX - offX));
        const y = Math.max(40, Math.min(window.innerHeight - win.offsetHeight - 50, e.clientY - offY));
        win.style.left = x + 'px';
        win.style.top = y + 'px';
        win.style.right = 'auto';
        win.style.bottom = 'auto';
        win.style.transform = 'none';
      };

      const onMouseUp = () => { dragging = false; };

      handle.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        handle.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, [winRef, handleRef, bringToFront, enabled]);
  };

  // Resizable hook: attach a bottom-right resize handle to a window element
  const useResizable = (
    winRef: React.RefObject<HTMLDivElement | null>,
    enabled: boolean = true,
    minWidth = 180,
    minHeight = 120
  ) => {
    useEffect(() => {
      if (!enabled) return;
      const win = winRef.current;
      if (!win) return;

      // ensure CSS scale variable exists
      const baseWidth = win.offsetWidth || 320;
      const baseHeight = win.offsetHeight || 240;
      win.style.setProperty('--window-scale', '1');

      const handle = win.querySelector('.resizeHandle') as HTMLElement | null;
      if (!handle) return;

      let resizing = false;
      let startW = 0;
      let startH = 0;
      let startX = 0;
      let startY = 0;

      const onMouseDown = (e: MouseEvent) => {
        resizing = true;
        // ensure window is pinned to pixel left/top if it used transform for centering
        const rect = win.getBoundingClientRect();
        const cs = getComputedStyle(win);
        if (cs.transform && cs.transform !== 'none') {
          win.style.left = `${rect.left}px`;
          win.style.top = `${rect.top}px`;
          win.style.transform = 'none';
        }

        startW = win.offsetWidth;
        startH = win.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        bringToFront(win);
        e.preventDefault();
        e.stopPropagation();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!resizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newW = Math.max(minWidth, Math.min(window.innerWidth - win.offsetLeft - 20, startW + dx));
        const newH = Math.max(minHeight, Math.min(window.innerHeight - win.offsetTop - 60, startH + dy));
        win.style.width = `${newW}px`;
        win.style.height = `${newH}px`;
        win.style.right = 'auto';
        win.style.bottom = 'auto';
        win.style.transform = 'none';

        // update font/content scale proportional to width (clamped)
        // scale based on both width and height (average) so content adapts when resizing vertically too
        const widthScale = newW / baseWidth;
        const heightScale = newH / baseHeight;
        const scale = Math.max(0.6, Math.min(1.6, (widthScale + heightScale) / 2));
        win.style.setProperty('--window-scale', scale.toFixed(2));

        // debug: log window/resizes so we can verify --window-scale propagation
        try {
          const idOrName = win.id || win.className || 'window';
          console.debug('[useResizable] window=', idOrName, 'newW=', newW, 'newH=', newH, 'scale=', scale.toFixed(2));
        } catch (e) { /* ignore in production */ }
      };

      const onMouseUp = () => { resizing = false; };

      handle.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        handle.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, [winRef, enabled, bringToFront, minWidth, minHeight]);
  };

  // Use refs for handles (legacy/resizable hooks kept for compatibility)
  const cassetteHandleRef = useRef<HTMLDivElement>(null);
  const terminalHandleRef = useRef<HTMLDivElement>(null);
  const bioHandleRef = useRef<HTMLDivElement>(null);
  const gamesHandleRef = useRef<HTMLDivElement>(null);

  useDraggable(cassetteRef, cassetteHandleRef, true);
  useDraggable(terminalRef, terminalHandleRef, true);
  useDraggable(bioRef, bioHandleRef, bioOpen);
  useDraggable(gamesRef, gamesHandleRef, gamesOpen);

  // enable resize handles for the same windows
  useResizable(cassetteRef, true, 200, 140);
  useResizable(terminalRef, true, 320, 160);
  useResizable(bioRef, bioOpen, 280, 240);
  useResizable(gamesRef, gamesOpen, 320, 240);
  useResizable(projectsRef, true, 320, 200);
  useResizable(cvFilesRef, true, 280, 160);
  useResizable(galleryRef, true, 360, 220);
  useResizable(loreRef, true, 300, 160);
  useResizable(mapRef, true, 280, 220);

  // --- DOM helpers for new neobrutalist UI (open/close/toggle similar to the provided demo) ---
  const openWin = (id: string, tbId?: string) => {
    const w = document.getElementById(id);
    const tb = tbId ? document.getElementById(tbId) : null;
    if (!w) return;
    w.classList.add('open');
    if (tb) tb.classList.add('active');
    if (id === 'games-win') setGamesOpen(true);
    bringToFront(w);
  };

  const closeWin = (id: string, tbId?: string) => {
    const w = document.getElementById(id);
    const tb = tbId ? document.getElementById(tbId) : null;
    if (!w) return;
    w.classList.remove('open');
    if (tb) tb.classList.remove('active');
    if (id === 'games-win') setGamesOpen(false);
  };

  const toggleWin = (id: string, tbId?: string) => {
    const w = document.getElementById(id);
    if (!w) return;
    const open = w.classList.contains('open') || w.style.display === 'block' || w.style.display === '';
    if (open) {
      if (id === 'games-win') setGamesOpen(false);
      w.classList.remove('open');
      w.style.display = 'none';
      if (tbId) document.getElementById(tbId)?.classList.remove('active');
    } else {
      if (id === 'games-win') setGamesOpen(true);
      w.classList.add('open');
      w.style.display = 'block';
      if (tbId) document.getElementById(tbId)?.classList.add('active');
      bringToFront(w);
    }
  };

  const toggleCV = () => {
    const panel = document.getElementById('cv-panel');
    const mini = document.getElementById('avatar-card');
    if (!panel || !mini) return;
    const open = panel.classList.contains('open');
    panel.classList.toggle('open');
    mini.style.display = open ? 'block' : 'none';
    if (!open) bringToFront(panel);
  };

  // lightweight DOM draggables initializer (attaches to .draggable elements)
  const initDraggables = () => {
    document.querySelectorAll('.draggable').forEach((win) => {
      const handle = win.querySelector('.nbwin-bar') as HTMLElement | null;
      if (!handle) return;
      let on = false, ox = 0, oy = 0;
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        on = true;
        const r = (win as HTMLElement).getBoundingClientRect();
        ox = e.clientX - r.left; oy = e.clientY - r.top;
        bringToFront(win as HTMLElement);
        e.preventDefault();
      });
      document.addEventListener('mousemove', (e) => {
        if (!on) return;
        const el = win as HTMLElement;
        const x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, e.clientX - ox));
        const y = Math.max(36, Math.min(window.innerHeight - el.offsetHeight - 48, e.clientY - oy));
        el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; el.style.transform = 'none';
      });
      document.addEventListener('mouseup', () => { on = false; });
    });
  };

  useEffect(() => { initDraggables(); }, []);

  return (
    <div id="desktop">
      <canvas id="bg-canvas" ref={canvasRef} />

      <header id="topbar">
        <div className="top-left">BOGI.OS v1.0</div>
        <div className="top-right"><div className="top-tag">software dev in training · roding, de</div><div id="topClock">{time}</div></div>
      </header>

      {/* CASSETTE ON DESKTOP (static) */}
      <div id="cassette-desk">
        <svg className="cass-svg" viewBox="0 0 192 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="188" height="106" rx="8" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2"/>
          <rect x="20" y="12" width="152" height="60" rx="4" fill="#f5c800"/>
          <rect x="20" y="42" width="152" height="20" rx="0" fill="#e87800"/>
          <rect x="20" y="52" width="152" height="10" rx="0" fill="#c84400"/>
          <line x1="20" y1="20" x2="172" y2="20" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8"/>
          <line x1="20" y1="26" x2="172" y2="26" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6"/>
          <line x1="20" y1="32" x2="172" y2="32" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6"/>
          <line x1="20" y1="38" x2="172" y2="38" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6"/>
        </svg>
        <div className="cass-info"><div className="cass-title">▶ PORTFOLIO.MP3</div><div className="marquee-wrap"><div className="marquee-text">✦ DEV IN TRAINING · KOTLIN · REACT · THREE.JS · C# · TFT ADDICT · BOOKWORM · CINEPHILE ✦&nbsp;</div></div><div className="cass-btns"><button className="cass-btn">⏮</button><button className="cass-btn">⏸</button><button className="cass-btn">⏭</button></div></div>
      </div>

      {/* DESKTOP FOLDERS */}
      <div className="folder-icon" style={{ top: '56px', left: '16px' }} onDoubleClick={() => openWin('projects-win','tb-proj')}>
        <div className="folder-img"><div className="folder-tab"></div><div className="folder-body"><span style={{ fontSize: 18 }}>💾</span></div></div>
        <div className="folder-label">My Projects</div>
      </div>
      <div className="folder-icon" style={{ top: '140px', left: '16px' }} onDoubleClick={() => openWin('cv-files-win','tb-cvf')}>
        <div className="folder-img"><div className="folder-tab pink"></div><div className="folder-body pink"><span style={{ fontSize: 18 }}>📋</span></div></div>
        <div className="folder-label">My CV</div>
      </div>
      <div className="folder-icon" style={{ top: '224px', left: '16px' }} onDoubleClick={() => openWin('gallery-win','tb-gal')}>
        <div className="folder-img"><div className="folder-tab cyan"></div><div className="folder-body cyan"><span style={{ fontSize: 18 }}>🖼️</span></div></div>
        <div className="folder-label">My Gallery</div>
      </div>
      <div className="folder-icon" style={{ top: '308px', left: '16px' }} onDoubleClick={() => openWin('lore-win','tb-lore')}>
        <div className="folder-img"><div className="folder-tab mint"></div><div className="folder-body mint"><span style={{ fontSize: 18 }}>📖</span></div></div>
        <div className="folder-label">About Me</div>
      </div>

      {/* SEPARATE GAME ICON (desktop) */}
      <div id="game-icon" onDoubleClick={() => openWin('games-win','tb-games')}><div className="game-icon-img">🎮</div><div className="game-icon-lbl">Games.exe</div></div>

      <div id="icons">
        <div className="icon" onDoubleClick={() => openWin('projects-win','tb-proj')}>💾<div className="icon-label">Projects</div></div>
        <div className="icon" onDoubleClick={() => openWin('games-win','tb-games')}>🎮<div className="icon-label">Games.exe</div></div>
        <div className="icon" onDoubleClick={() => openWin('code-win','tb-code')}>💻<div className="icon-label">Code</div></div>
      </div>

      <div id="code-win" className="nbwin cyan draggable open">
        <div className="nbwin-bar">
          <div className="nbwin-title">server.js — RUNNING</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('code-win','tb-code')}>×</div></div>
        </div>
        <div className="code-body">
          <pre className="code-snippet">{`const bogi = {\n  name: "Bogi",\n  age: 24,\n  role: "Software Dev in Training",\n  stack: ["Kotlin","React","C#","Three.js"]\n};`}</pre>
        </div>
      </div>

      <div id="games-win" ref={gamesRef} className={`nbwin pink draggable ${gamesOpen ? 'open' : ''}`}>
        <div className="nbwin-bar" id="games-handle">
          <div className="nbwin-title">🎮 GAMES.EXE — Pick Your Character</div>
          <div className="nbwin-btns"><div className="nbwin-btn close" onClick={() => closeWin('games-win','tb-games')}>×</div></div>
        </div>
        <div className="games-layout">
          <div className="games-grid-side">
            <div className="games-grid-label">// SELECT GAME</div>
            <div className="games-grid">
              {games.map((g, i) => (
                <div key={i} className={`game-cell ${selectedGame === i ? 'selected' : ''}`} onClick={() => setSelectedGame(i)}>
                  {g.icon ? <img src={g.icon} className="gc-emoji" style={{ width: 36, height: 36, objectFit: 'contain' }} alt={g.name} /> : <div className="gc-emoji">{g.emoji}</div>}
                  <div className="gc-label">{g.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="game-detail">
            <div className="gd-title">{selectedGame !== null ? games[selectedGame].name : 'Pick a game!'}</div>
            <div className="gd-genre">{selectedGame !== null ? `// ${games[selectedGame].genre}` : '// CLICK ANY TITLE →'}</div>
            <div className="gd-emoji">{selectedGame !== null ? (games[selectedGame].icon ? <img src={games[selectedGame].icon} className="gd-emoji" style={{ width: 120, height: 'auto' }} /> : games[selectedGame].emoji) : '🎮'}</div>
            <div className="gd-desc">{selectedGame !== null ? games[selectedGame].desc : "Bogi's personal game collection. Nine games, zero regrets. Click any entry to read more."}</div>
            <div className="gd-meta" style={{ display: selectedGame !== null ? 'flex' : 'none' }}>
              <div className="gd-meta-box"><div className="gd-meta-label">GENRE</div><div className="gd-meta-val">{selectedGame !== null ? games[selectedGame].genre : '—'}</div></div>
              <div className="gd-meta-box"><div className="gd-meta-label">PLATFORM</div><div className="gd-meta-val">{selectedGame !== null ? games[selectedGame].platform : '—'}</div></div>
            </div>
            <div className="star-row" style={{ display: selectedGame !== null ? 'flex' : 'none' }}>{[1,2,3,4,5].map(s => <span key={s} className={`star ${selectedGame !== null && s <= games[selectedGame].rating ? 'lit' : ''}`}>★</span>)}</div>
          </div>
        </div>
        <div className="resizeHandle" />
      </div>

      {/* PROJECTS / CV / GALLERY / LORE / MAP windows — match user HTML/CSS and wire to existing handlers */}
      <div id="projects-win" ref={projectsRef} className="nbwin mint draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">Projects</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('projects-win','tb-proj')}>×</div></div>
        </div>
        <div className="nbwin-body">
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="proj-card" onClick={() => window.open(p.url, '_blank')}>
                <img src={p.icon} alt=""/>
                <div className="proj-meta"><strong>{p.name}</strong><div className="proj-desc">{p.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="resizeHandle" />
      </div>

      <div id="cv-files-win" ref={cvFilesRef} className="nbwin lavender draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">CV Files</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('cv-files-win','tb-cvf')}>×</div></div>
        </div>
        <div className="nbwin-body cv-files">
          <ul>
            <li onClick={() => alert('Open resume.pdf')}>resume.pdf</li>
            <li onClick={() => alert('Open portfolio.zip')}>portfolio.zip</li>
            <li onClick={() => alert('Open references.txt')}>references.txt</li>
          </ul>
        </div>
        <div className="resizeHandle" />
      </div>

      <div id="gallery-win" ref={galleryRef} className="nbwin cyan draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">Gallery</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('gallery-win','tb-gal')}>×</div></div>
        </div>
        <div className="nbwin-body gallery-grid">
          <div className="thumb">🌴</div>
          <div className="thumb">🌊</div>
          <div className="thumb">🎛️</div>
          <div className="thumb">🦊</div>
        </div>
        <div className="resizeHandle" />
      </div>

      <div id="lore-win" ref={loreRef} className="nbwin mint draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">About</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('lore-win','tb-lore')}>×</div></div>
        </div>
        <div className="nbwin-body">
          <p>Hi — I build small games, interactive 3D demos and tools. I love tiny retro UI, pixel art and audio-reactive visuals.</p>
        </div>
        <div className="resizeHandle" />
      </div>

      <div id="map-win" ref={mapRef} className="nbwin teal draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">Map</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => closeWin('map-win','tb-map')}>×</div></div>
        </div>
        <div className="nbwin-body">
          <div className="map-canvas-wrap">
            <div className="map-land">
              <div className="map-pin" style={{ left: '52%', top: '46%' }}>
                <div className="map-pin-head" />
                <div className="map-pin-stem" />
                <div className="map-tooltip">Roding, DE</div>
              </div>
              <div className="map-pin" style={{ left: '34%', top: '60%' }}>
                <div className="map-pin-head" style={{ background: 'var(--cyan)' }} />
                <div className="map-pin-stem" />
                <div className="map-tooltip">Budapest</div>
              </div>
            </div>
            <div className="map-sea" />
          </div>
          <div className="map-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--pink)' }} /> Home</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--cyan)' }} /> Travel</div>
          </div>
        </div>
        <div className="resizeHandle" />
      </div>

      {/* Small avatar card (click to open full CV panel) */}
      <div id="avatar-card" className="avatar-mini" onClick={() => toggleCV()}>
        <div className="av-face">B</div>
        <div className="av-info"><div className="av-name">BOGI</div><div className="av-sub">software dev (in training)</div></div>
      </div>

      {/* Expanded CV / profile panel */}
      <div id="cv-panel" ref={bioRef} className="nbwin lavender draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">Profile</div>
          <div className="nbwin-btns"><div className="nbwin-btn" onClick={() => toggleCV()}>×</div></div>
        </div>
        <div className="nbwin-body cv-body">
          <div className="cv-header">
            <div className="cv-portrait">B</div>
            <div>
              <div className="cv-name">BOGI</div>
              <div className="cv-role">software dev (in training)</div>
              <div className="cv-loc">Roding, Bavaria (DE)</div>
            </div>
          </div>

          <div className="cv-grid">
            <div className="cv-stat"><div className="cv-stat-label">EXPERIENCE</div><div className="cv-stat-val">2 yrs</div></div>
            <div className="cv-stat"><div className="cv-stat-label">PROJECTS</div><div className="cv-stat-val">8</div></div>
          </div>

          <div className="cv-section">ABOUT</div>
          <p style={{ marginTop: 0 }}>Frontend / 3D tinkerer. Building small interactive experiences with React + three.js.</p>

          <div className="cv-section">SKILLS</div>
          <div className="skill-wrap">
            <div className="skill-chip hot">React</div>
            <div className="skill-chip">Three.js</div>
            <div className="skill-chip">TypeScript</div>
            <div className="skill-chip">Kotlin</div>
          </div>
        </div>
        <div className="resizeHandle" />
      </div>

      <ScreenAvatar />

      <div id="taskbar">
        <button className="tb-start">⚙ START</button>
        <div className="tb-sep"></div>
        <div className={`tb-item active`} id="tb-code" onClick={() => toggleWin('code-win','tb-code')}>💻 server.js</div>
        <div className={`tb-item ${gamesOpen ? 'active' : ''}`} id="tb-games" onClick={() => openWin('games-win','tb-games')}>🎮 Games.exe</div>
        <div className={`tb-item`} id="tb-proj" onClick={() => openWin('projects-win','tb-proj')}>💾 Projects</div>
        <div className="tb-right"><span className="tb-clock">{time.slice(0,5)}</span></div>
      </div>
    </div>
  );


}
