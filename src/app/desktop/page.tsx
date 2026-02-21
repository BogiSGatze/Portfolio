'use client';
/**
 * Desktop page — the main portfolio experience.
 *
 * Layout: vaporwave canvas background, neobrutalist draggable windows,
 * a taskbar, folder icons, and a fully interactive terminal.
 *
 * Refactored for clean code:
 * - Static data lives in `@/constants/desktopData`
 * - Clock logic lives in `@/hooks/useClock`
 * - Window open/close helpers live in `@/hooks/useWindowManager`
 * - Drag logic lives in `@/hooks/useDraggable`
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ── Extracted hooks & data ── */
import { useClock } from '@/hooks/useClock';
import { useWindowManager } from '@/hooks/useWindowManager';
import { initDraggables } from '@/hooks/useDraggable';
import {
  GAMES,
  PROJECTS,
  CV_FILES,
  BOOT_LINES,
  TECH_STACK,
  HOBBIES,
  type TerminalLine,
} from '@/constants/desktopData';

/* ── Components ── */
import ScreenAvatar from '@/components/ui/ScreenAvatar';
import { useComputerStore } from '@/store/computerStore';
import { GitHubCalendar } from 'react-github-calendar';

/* ═════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════ */
export default function Desktop() {
  /* ── Hooks ── */
  const router = useRouter();
  const time = useClock();
  const { bringToFront, openWin, closeWin, toggleWin } = useWindowManager();

  /* ── Refs ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const termOutputRef = useRef<HTMLDivElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const orbitRafRef = useRef<number | null>(null);

  /* ── State ── */
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [termLines, setTermLines] = useState<TerminalLine[]>([...BOOT_LINES]);
  const [termInput, setTermInput] = useState('');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [openCvFile, setOpenCvFile] = useState<number | null>(null);
  const [musicPrompt, setMusicPrompt] = useState(true);
  const [musicAutoplay, setMusicAutoplay] = useState(false);
  const [musicNotif, setMusicNotif] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /* Record session start time once on mount */
  useEffect(() => {
    startTimeRef.current = Date.now();
    setMounted(true);
  }, []);

  /* Cancel orbit animation on unmount */
  useEffect(() => {
    return () => {
      if (orbitRafRef.current !== null) {
        cancelAnimationFrame(orbitRafRef.current);
      }
      document.getElementById('orbit-avatar')?.remove();
    };
  }, []);

  /* ═════════════════════════════════════════════════════════
     VAPORWAVE BACKGROUND CANVAS
     ═════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    if (!cx) return;

    let W = 0;
    let H = 0;
    let stars: { x: number; y: number; r: number; alpha: number; twinkle: number; speed: number }[] = [];
    let gt = 0;
    let raf = 0;

    /** Populate random star positions for the sky section */
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

    /** Main render loop: sky gradient, grid floor, sun, stars, vignette */
    const draw = () => {
      cx.clearRect(0, 0, W, H);
      gt += 0.008;

      /* sky gradient */
      const sky = cx.createLinearGradient(0, 0, 0, H * 0.62);
      sky.addColorStop(0, '#0d0820');
      sky.addColorStop(0.4, '#1a0a3a');
      sky.addColorStop(0.7, '#3d1060');
      sky.addColorStop(1, '#ff2d9b');
      cx.fillStyle = sky;
      cx.fillRect(0, 0, W, H);

      /* grid floor */
      const floorY = H * 0.58;
      const gridH = H - floorY;
      const floor = cx.createLinearGradient(0, floorY, 0, H);
      floor.addColorStop(0, '#c020a0');
      floor.addColorStop(0.4, '#8010c0');
      floor.addColorStop(1, '#200840');
      cx.fillStyle = floor;
      cx.fillRect(0, floorY, W, gridH);

      /* perspective grid lines */
      const vp = { x: W / 2, y: floorY };
      const gridLines = 16;
      cx.strokeStyle = 'rgba(255,45,155,0.35)';
      cx.lineWidth = 1;
      for (let i = 0; i <= gridLines; i++) {
        const x = (W * i) / gridLines;
        cx.beginPath();
        cx.moveTo(x, H);
        cx.lineTo(vp.x, vp.y);
        cx.stroke();
      }

      /* horizontal moving grid lines */
      const hLines = 14;
      for (let j = 0; j <= hLines; j++) {
        const t = (j / hLines + gt * 0.3) % 1;
        const ease = t * t;
        const y = floorY + gridH * ease;
        const xSpread = (1 - ease) * W * 0.5;
        const alpha = 0.6 * (1 - Math.abs(t - 0.5) * 1.5);
        cx.strokeStyle = `rgba(255,45,155,${Math.max(0, alpha)})`;
        cx.beginPath();
        cx.moveTo(vp.x - xSpread, y);
        cx.lineTo(vp.x + xSpread, y);
        cx.stroke();
      }

      /* sun */
      const sunX = W / 2;
      const sunY = H * 0.38;
      const sunR = H * 0.14;
      const sg = cx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sg.addColorStop(0, '#ffe44d');
      sg.addColorStop(0.4, '#ff8c00');
      sg.addColorStop(0.7, '#ff2d9b');
      sg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = sg;
      cx.beginPath();
      cx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      cx.fill();

      /* sun scanlines */
      cx.fillStyle = 'rgba(13,8,32,0.25)';
      for (let sl = 0; sl < 14; sl++) {
        const sy = sunY - sunR * 0.6 + sl * ((sunR * 1.2) / 14);
        const halfW = Math.sqrt(Math.max(0, sunR * sunR - (sy - sunY) * (sy - sunY)));
        cx.fillRect(sunX - halfW, sy, halfW * 2, 3);
      }

      /* twinkling stars */
      for (const s of stars) {
        s.twinkle += s.speed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
        cx.beginPath();
        cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,255,${a})`;
        cx.fill();
      }

      /* horizon glow */
      const hg = cx.createLinearGradient(0, floorY - 20, 0, floorY + 20);
      hg.addColorStop(0, 'rgba(255,45,155,0)');
      hg.addColorStop(0.5, 'rgba(255,45,155,0.35)');
      hg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = hg;
      cx.fillRect(0, floorY - 20, W, 40);

      /* vignette */
      const vg = cx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      cx.fillStyle = vg;
      cx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ═════════════════════════════════════════════════════════
     INIT DRAGGABLES ON MOUNT
     ═════════════════════════════════════════════════════════ */
  useEffect(() => {
    initDraggables(bringToFront);
  }, [bringToFront]);

  // windows created dynamically (project & CV detail popups) need
  // draggable initialization whenever they mount.
  // requestAnimationFrame defers until after the browser has painted the new
  // element so getBoundingClientRect() returns accurate values right away.
  useEffect(() => {
    if (openProject !== null || openCvFile !== null) {
      const id = requestAnimationFrame(() => initDraggables(bringToFront));
      return () => cancelAnimationFrame(id);
    }
  }, [openProject, openCvFile, bringToFront]);

  /* ═════════════════════════════════════════════════════════
     TERMINAL LOGIC
     ═════════════════════════════════════════════════════════ */

  /** Auto-scroll terminal output whenever new lines are added */
  useEffect(() => {
    const el = termOutputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [termLines]);

  /** Push a line to the terminal output */
  const printLine = useCallback((type: TerminalLine['type'], text: string) => {
    setTermLines((prev) => [...prev, { type, text }]);
  }, []);

  /**
   * Execute a terminal command.
   * Supported: help, whoami, stack, projects, date, clear, sudo hire bogi, exit
   */
  const executeCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      printLine('in', `$ ${cmd}`);
      const c = cmd.toLowerCase();

      if (c === 'help') {
        printLine('sys', 'Available commands:');
        printLine('out', '  help           \u2014 show this list');
        printLine('out', '  whoami         \u2014 about me');
        printLine('out', '  stack          \u2014 tech stack');
        printLine('out', '  projects       \u2014 my projects');
        printLine('out', '  date           \u2014 current date/time');
        printLine('out', '  uptime         \u2014 session uptime');
        printLine('out', '  start avatar   \u2014 launch Bogi avatar');
        printLine('out', '  stop avatar    \u2014 stop Bogi avatar');
        printLine('out', '  clear          \u2014 clear terminal');
        printLine('out', '  sudo hire bogi \u2014 try it ;)');
        return;
      }
      if (c === 'clear') {
        setTermLines([]);
        return;
      }
      if (c === 'whoami') {
        printLine('out', 'Bogi — Software Dev in Training');
        printLine('out', 'Location: Roding, Bavaria (DE)');
        return;
      }
      if (c === 'stack') {
        printLine('sys', 'cat stack.json');
        printLine('out', TECH_STACK.map((t) => t.name).join(', '));
        return;
      }
      if (c === 'projects' || c === 'ls projects/') {
        printLine('sys', 'ls projects/');
        PROJECTS.forEach((p) => printLine('out', `  ${p.name} [${p.tech.join(', ')}]`));
        return;
      }
      if (c === 'date') {
        printLine('out', new Date().toLocaleString());
        return;
      }
      if (c === 'uptime') {
        const ms = Date.now() - startTimeRef.current;
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        printLine('out', `uptime: ${h}h ${m}m ${s}s`);
        return;
      }
      if (c === 'start avatar') {
        // Remove any existing orbit avatar
        document.getElementById('orbit-avatar')?.remove();
        if (orbitRafRef.current !== null) {
          cancelAnimationFrame(orbitRafRef.current);
          orbitRafRef.current = null;
        }
        // Create small orbiting icon around the terminal window.
        // Appended inside #desktop as position:absolute so its z-index (5)
        // is within #desktop's stacking context and below all windows (101+).
        const desktop = document.getElementById('desktop');
        const avatarEl = document.createElement('div');
        avatarEl.id = 'orbit-avatar';
        avatarEl.textContent = '🤖';
        avatarEl.style.cssText = [
          'position:absolute',
          'z-index:5',
          'font-size:18px',
          'pointer-events:none',
          'user-select:none',
          'transform:translate(-50%,-50%)',
          'filter:drop-shadow(0 0 4px #ff00ff)',
        ].join(';');
        (desktop ?? document.body).appendChild(avatarEl);
        // getBoundingClientRect gives viewport coords; since #desktop is 100vw×100vh
        // at (0,0), these equal absolute coords within #desktop.
        const desktopRect = desktop?.getBoundingClientRect() ?? { left: 0, top: 0 };
        let angle = 0;
        const RADIUS = 320; // larger than terminal half-diagonal (~311px) so avatar stays outside
        const SPEED = 0.07; // ~4 deg/frame ≈ 2 full orbits per second
        const tick = () => {
          const win = document.getElementById('code-win');
          if (!win) { orbitRafRef.current = requestAnimationFrame(tick); return; }
          const r = win.getBoundingClientRect();
          const cx = r.left + r.width / 2 - desktopRect.left;
          const cy = r.top + r.height / 2 - desktopRect.top;
          angle += SPEED;
          avatarEl.style.left = `${cx + RADIUS * Math.cos(angle)}px`;
          avatarEl.style.top = `${cy + RADIUS * Math.sin(angle)}px`;
          // Sit just below the terminal so it's visible around the outside,
          // but any window brought to front (higher z) will cover it.
          const termZ = parseInt(win.style.zIndex || '101', 10);
          avatarEl.style.zIndex = String(Math.max(5, termZ - 1));
          orbitRafRef.current = requestAnimationFrame(tick);
        };
        orbitRafRef.current = requestAnimationFrame(tick);
        printLine('out', '🤖 ORBIT.EXE started around terminal. type stop avatar to dismiss.');
        return;
      }
      if (c.startsWith('start avatar ')) {
        const file = cmd.slice('start avatar '.length).trim();
        const src = file.startsWith('/') ? file : `/${file}`;
        useComputerStore.getState().startScreenAvatar(src);
        printLine('out', `BOGI.EXE started on-screen (${src}).`);
        return;
      }
      if (c === 'stop avatar') {
        if (orbitRafRef.current !== null) {
          cancelAnimationFrame(orbitRafRef.current);
          orbitRafRef.current = null;
        }
        document.getElementById('orbit-avatar')?.remove();
        useComputerStore.getState().stopScreenAvatar();
        printLine('out', '🤖 ORBIT.EXE terminated.');
        return;
      }
      if (c === 'sudo hire bogi') {
        printLine('sys', '$ sudo hire bogi');
        printLine('out', 'password: ********');
        printLine('out', 'ACCESS GRANTED');
        printLine('out', 'Hiring manager module: disabled (corporate policy: "no joy allowed")');
        printLine('out', 'Proceeding anyway... offer generated');
        return;
      }
      if (c === 'sudo rm -rf /') {
        printLine('err', 'nice try. deleting your portfolio would improve performance, but not your chances.');
        return;
      }
      if (c === 'exit') {
        printLine('sys', "you can't exit the portfolio. you can only scroll.");
        return;
      }

      printLine('err', `command not found: ${cmd} (type help)`);
    },
    [printLine],
  );

  /** Handle Enter key in the terminal input */
  const onTermKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeCommand(termInput);
        setTermInput('');
      }
    },
    [termInput, executeCommand],
  );

  /* ═════════════════════════════════════════════════════════
     CV PANEL TOGGLE (mini avatar card / full panel)
     ═════════════════════════════════════════════════════════ */
  const toggleCV = useCallback(() => {
    const panel = document.getElementById('cv-panel');
    const mini = document.getElementById('avatar-card');
    if (!panel || !mini) return;
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    mini.style.display = isOpen ? 'block' : 'none';
    if (!isOpen) bringToFront(panel);
  }, [bringToFront]);

  /* ═════════════════════════════════════════════════════════
     SHUTDOWN / TURN OFF
     ═════════════════════════════════════════════════════════ */
  const handleShutdown = useCallback(() => {
    setIsShuttingDown(true);
    useComputerStore.getState().turnOff();
    setTimeout(() => {
      router.push('/');
    }, 1300);
  }, [router]);

  /* ═════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════ */
  return (
    <div id="desktop">
      {/* Animated vaporwave background */}
      <canvas id="bg-canvas" ref={canvasRef} />

      {/* Shutdown morph overlay */}
      {isShuttingDown && <div className="shutdown-overlay" />}

      {/* ── TOP BAR ── */}
      <header id="topbar">
        <div className="top-left">BOGI.OS v1.0</div>
        <div className="top-right">
          <div className="top-tag">software dev in training · roding, de</div>
          <div id="topClock">{time}</div>
        </div>
      </header>

      {/* ── CASSETTE DECORATION (Uiverse.io by Praashoo7) ── */}
      <div id="cassette-desk">
        <div className="tape-card">
          <div className="tape-ups">
            <div className="tape-screw tape-screw-tl">+</div>
            <div className="tape-screw tape-screw-tr">+</div>
          </div>
          <div className="tape-label">
            <div className="tape-line tape-line-1" />
            <div className="tape-line tape-line-2" />
            <div className="tape-yl">
              <div className="tape-roll">
                <div className="tape-s-wheel" />
                <div className="tape-ribbon">
                  <div className="tape-window" />
                </div>
                <div className="tape-e-wheel" />
              </div>
              <p className="tape-num">90</p>
            </div>
            <div className="tape-or">
              <p className="tape-time">2&#215;30min</p>
            </div>
          </div>
          <div className="tape-card2-main">
            <div className="tape-card2">
              <div className="c1" />
              <div className="t1" />
              <div className="screw5">+</div>
              <div className="t2" />
              <div className="c2" />
            </div>
          </div>
          <div className="tape-downs">
            <div className="tape-screw tape-screw-bl">+</div>
            <div className="tape-screw tape-screw-br">+</div>
          </div>
        </div>
        {/* Spotify player under cassette */}
        <div className="spotify-under-cass">
          <iframe
            key={musicAutoplay ? 'sp-auto' : 'sp-manual'}
            style={{ borderRadius: 8 }}
            src={`https://open.spotify.com/embed/playlist/7n5xGCYrcZpPCr3ifTYx5i?utm_source=generator&theme=0${musicAutoplay ? '&autoplay=1' : ''}`}
            width="300"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
          />
        </div>
      </div>

      {/* ── DESKTOP FOLDER ICONS ── */}
      <div className="folder-icon" style={{ top: '56px', left: '16px' }} onDoubleClick={() => openWin('projects-win', 'tb-proj')}>
        <div className="folder-img">
          <div className="folder-tab" />
          <div className="folder-body">
            <span style={{ fontSize: 18 }}>&#128190;</span>
          </div>
        </div>
        <div className="folder-label">My Projects</div>
      </div>
      <div className="folder-icon" style={{ top: '140px', left: '16px' }} onDoubleClick={() => openWin('cv-files-win', 'tb-cvf')}>
        <div className="folder-img">
          <div className="folder-tab pink" />
          <div className="folder-body pink">
            <span style={{ fontSize: 18 }}>&#128203;</span>
          </div>
        </div>
        <div className="folder-label">My CV</div>
      </div>
      <div className="folder-icon" style={{ top: '224px', left: '16px' }} onDoubleClick={() => openWin('gallery-win', 'tb-gal')}>
        <div className="folder-img">
          <div className="folder-tab cyan" />
          <div className="folder-body cyan">
            <span style={{ fontSize: 18 }}>&#128444;&#65039;</span>
          </div>
        </div>
        <div className="folder-label">My Gallery</div>
      </div>
      <div className="folder-icon" style={{ top: '308px', left: '16px' }} onDoubleClick={() => openWin('lore-win', 'tb-lore')}>
        <div className="folder-img">
          <div className="folder-tab mint" />
          <div className="folder-body mint">
            <span style={{ fontSize: 18 }}>&#128214;</span>
          </div>
        </div>
        <div className="folder-label">About Me</div>
      </div>
      {/* Game icon on the desktop */}
      <div id="game-icon" onDoubleClick={() => openWin('games-win', 'tb-games')}>
        <div className="game-icon-img">&#127918;</div>
        <div className="game-icon-lbl">Games.exe</div>
      </div>

      {/* ── GITHUB CALENDAR WIDGET (bottom center) ── */}
      <div id="github-desk">
        <div className="github-widget">
          <div className="github-widget-header">
            <span>&#128142; GitHub Activity</span>
            <a
              href="https://github.com/BogisGatze"
              target="_blank"
              rel="noopener noreferrer"
              className="github-widget-link"
            >
              &#127760;
            </a>
          </div>
          <div className="github-widget-cal">
            {mounted && (
              <GitHubCalendar
                username="BogisGatze"
                colorScheme="dark"
                theme={{
                  dark: ['#161b22', '#6e3a82', '#9b59b6', '#d63384', '#ff6ec7'],
                }}
                fontSize={11}
                blockSize={12}
                blockMargin={4}
                showColorLegend={false}
                showMonthLabels
                showTotalCount={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          TERMINAL WINDOW (code-win)
          ═════════════════════════════════════════════════════ */}
      <div id="code-win" className="nbwin cyan draggable open">
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128187; BOGI.SYS &#8212; Terminal</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('code-win', 'tb-code')}>&#215;</div>
          </div>
        </div>
        <div className="term-body" onClick={() => termInputRef.current?.focus()}>
          <div className="term-output" ref={termOutputRef}>
            {termLines.map((line, i) => (
              <div key={i} className={`term-line ${line.type}`}>
                {line.text}
              </div>
            ))}
          </div>
          <div className="term-input-row">
            <span className="term-prompt">&#10095;</span>
            <input
              ref={termInputRef}
              className="term-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="type a command..."
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
              onKeyDown={onTermKeyDown}
            />
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          GAMES WINDOW
          ═════════════════════════════════════════════════════ */}
      <div id="games-win" className="nbwin pink draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#127918; GAMES.EXE &#8212; Pick Your Character</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('games-win', 'tb-games')}>&#215;</div>
          </div>
        </div>
        <div className="games-layout">
          {/* Game grid (left) */}
          <div className="games-grid-side">
            <div className="games-grid-label">{"// SELECT GAME"}</div>
            <div className="games-grid">
              {GAMES.map((g, i) => (
                <div
                  key={i}
                  className={`game-cell ${selectedGame === i ? 'selected' : ''}`}
                  onClick={() => setSelectedGame(i)}
                >
                  {g.icon ? (
                    <Image src={g.icon} className="gc-emoji" width={36} height={36} style={{ objectFit: 'contain' }} alt={g.name} />
                  ) : (
                    <div className="gc-emoji">{g.emoji}</div>
                  )}
                  <div className="gc-label">{g.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Game detail panel (right) */}
          <div className="game-detail">
            <div className="gd-title">{selectedGame !== null ? GAMES[selectedGame].name : 'Pick a game!'}</div>
            <div className="gd-genre">{selectedGame !== null ? `// ${GAMES[selectedGame].genre}` : '// CLICK ANY TITLE'}</div>
            <div className="gd-emoji">
              {selectedGame !== null ? (
                GAMES[selectedGame].icon ? (
                  <Image src={GAMES[selectedGame].icon!} className="gd-emoji" width={120} height={120} style={{ height: 'auto' }} alt="" />
                ) : (
                  GAMES[selectedGame].emoji
                )
              ) : (
                '🎮'
              )}
            </div>
            <div className="gd-desc">
              {selectedGame !== null
                ? GAMES[selectedGame].desc
                : "Bogi's personal game collection. Nine games, zero regrets. Click any entry to read more."}
            </div>
            {selectedGame !== null && (
              <>
                <div className="gd-meta">
                  <div className="gd-meta-box">
                    <div className="gd-meta-label">GENRE</div>
                    <div className="gd-meta-val">{GAMES[selectedGame].genre}</div>
                  </div>
                  <div className="gd-meta-box">
                    <div className="gd-meta-label">PLATFORM</div>
                    <div className="gd-meta-val">{GAMES[selectedGame].platform}</div>
                  </div>
                </div>
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={`star ${s <= GAMES[selectedGame].rating ? 'lit' : ''}`}>&#9733;</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          PROJECTS WINDOW (file list)
          ═════════════════════════════════════════════════════ */}
      <div id="projects-win" className="nbwin mint draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128190; Projects</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('projects-win', 'tb-proj')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body">
          <ul className="file-list">
            {PROJECTS.map((p, i) => (
              <li key={p.file} onClick={() => setOpenProject(i)} style={{ cursor: 'pointer' }}>
                <strong>{p.name}</strong>
                <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 8 }}>[{p.tech.join(', ')}]</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PROJECT DETAIL POPUP */}
      {openProject !== null && (
        <div
          id="project-detail-win"
          className="nbwin lavender draggable"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 560, zIndex: 300 }}
        >
          <div className="nbwin-bar">
            <div className="nbwin-title">&#128190; {PROJECTS[openProject].file}</div>
            <div className="nbwin-btns">
              <div className="nbwin-btn" onClick={() => setOpenProject(null)}>&#215;</div>
            </div>
          </div>
          <div className="nbwin-body proj-body">
            <div className="proj-name">{PROJECTS[openProject].name}</div>
            <div className="proj-tech">
              {PROJECTS[openProject].tech.map((t) => (
                <div key={t} className="skill-chip">{t}</div>
              ))}
            </div>
            <div className="cv-section">DESCRIPTION</div>
            <p className="proj-desc">{PROJECTS[openProject].desc}</p>
            {PROJECTS[openProject].images && PROJECTS[openProject].images!.length > 0 && (
              <>
                <div className="cv-section">GALLERY</div>
                <div className="proj-gallery">
                  {PROJECTS[openProject].images!.map((img, i) => (
                    <figure key={i} className="proj-gallery-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.caption} className="proj-gallery-img" />
                      <figcaption className="proj-gallery-caption">{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          CV FILES WINDOW (file list)
          ═════════════════════════════════════════════════════ */}
      <div id="cv-files-win" className="nbwin lavender draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128203; CV Files</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('cv-files-win', 'tb-cvf')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body">
          <ul className="file-list">
            {CV_FILES.map((f, i) => (
              <li key={f.file} onClick={() => setOpenCvFile(i)} style={{ cursor: 'pointer' }}>
                {f.icon} {f.label}
                <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 'auto' }}>.pdf</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CV FILE DETAIL / PDF VIEWER POPUP */}
      {openCvFile !== null && (
        <div
          id="cv-viewer-win"
          className="nbwin lavender draggable"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 640, height: 520, zIndex: 300, display: 'flex', flexDirection: 'column' }}
        >
          <div className="nbwin-bar">
            <div className="nbwin-title">&#128196; {CV_FILES[openCvFile].file}</div>
            <div className="nbwin-btns">
              <div className="nbwin-btn" onClick={() => setOpenCvFile(null)}>&#215;</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <iframe
              src={CV_FILES[openCvFile].path}
              title={CV_FILES[openCvFile].label}
              style={{ flex: 1, border: 'none', background: 'white', minHeight: 0 }}
            />
            <div style={{ padding: '10px 14px', background: 'var(--black)', borderTop: '3px solid var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--lavender)', letterSpacing: 1 }}>
                {CV_FILES[openCvFile].label}
              </span>
              <a
                href={CV_FILES[openCvFile].path}
                download={CV_FILES[openCvFile].file}
                className="cv-download-btn"
              >
                &#11015; Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          GALLERY WINDOW (placeholder)
          ═════════════════════════════════════════════════════ */}
      <div id="gallery-win" className="nbwin cyan draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128444;&#65039; Gallery</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('gallery-win', 'tb-gal')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body gallery-grid">
          <div className="gallery-item">&#127796; coming soon</div>
          <div className="gallery-item">&#127754; coming soon</div>
          <div className="gallery-item">&#127899;&#65039; coming soon</div>
          <div className="gallery-item">&#129418; coming soon</div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          ABOUT ME / LORE WINDOW
          ═════════════════════════════════════════════════════ */}
      <div id="lore-win" className="nbwin mint draggable" style={{ display: 'none', width: '520px', height: '380px', maxWidth: '90vw', maxHeight: '90vh' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128214; About Me</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('lore-win', 'tb-lore')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body">
          <p className="lore-text">
            Hi - I&apos;m Bogi, an aspiring software dev currently working at Mühlbauer Automation GmbH in Roding, Bavaria. I  am 24 years old and speak Hungarian, German, and English. I love watching movies, playing games and reading books in my free time.

            I build interactive web experiences, games, and tools. I love retro UI, pixel art, and making things that feel alive. 
            Currently leveling up my skills in React, Kotlin, and Three.js.

            Interested in hiring me? Check out my projects as well as my CV. You can also see my contact information inside my CV and my profile. ☺️
          </p>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          MAP WINDOW (Uiverse.io by SnyDeTreves)
          ═════════════════════════════════════════════════════ */}
      <div id="map-win" className="nbwin pink draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128506;&#65039; Map &mdash; The Lore of My Life</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('map-win', 'tb-map')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body" style={{ padding: 0 }}>
          <div className="map-container">
            <svg viewBox="0 0 500 500" className="map-background">
              <rect style={{ fill: '#f5f0e5' }} width="500" height="500" />
              <path
                style={{ fill: '#90daee' }}
                d="M0,367.82c5.83-4.39,14.42-10.16,25.59-15.34,4.52-2.09,43.19-19.51,79.55-11.93,36.1,7.52,35.75,32.55,78.41,60.23,46.34,30.06,109.47,41.21,123.32,22.1,11.95-16.49-22.61-41.92-13.66-84.6,4.85-23.1,22.33-50.71,47.73-58.52,42.42-13.05,78.83,39.45,102.84,23.86,15.81-10.26.01-32.87,22.73-74.43,5.8-10.62,11.65-21.15,11.93-36.93.28-15.69-5.63-26.64-7.95-32.39-6.66-16.45-6.21-45.15,28.84-98.55.23,146.23.46,292.46.69,438.69H0v-132.18Z"
              />
            </svg>
            <div className="map-cities">
              {/* Roding, DE — Work */}
              <div style={{ '--x': 52, '--y': 35 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127969;" className="map-city__sign anim anim-grow">Mühlbauer Automation GmbH, Roding, DE</span>
                </div>
              </div>
              {/* Budapest — Home */}
              <div style={{ '--x': 58, '--y': 48 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127963;&#65039;" className="map-city__sign anim anim-slidein">Budapest, HU</span>
                </div>
              </div>
              {/* Schwandorf — FOS */}
              <div style={{ '--x': 30, '--y': 22 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127959;&#65039;" className="map-city__sign anim anim-grow"> FOS Schwandorf, Abitur aquired</span>
                </div>
              </div>
              {/* Nittenau - Work */}
              <div style={{ '--x': 72, '--y': 28 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127795;" className="map-city__sign anim anim-slidein">Worked at a retirement home, Nittenau, DE</span>
                </div>
              </div>
              {/* Munich - Desired Travel Destination*/}
              <div style={{ '--x': 20, '--y': 62 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127866;" className="map-city__sign anim anim-grow">Next aspired travel destination, Munich, DE</span>
                </div>
              </div>
              {/* Somewhere on the Internet */}
              <div style={{ '--x': 75, '--y': 50 } as React.CSSProperties} className="map-city">
                <div className="map-city__label">
                  <span data-icon="&#127760;" className="map-city__sign anim anim-slidein">Somewhere on the Internet, probably Reddit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          AVATAR MINI CARD (click to expand CV PANEL)
          ═════════════════════════════════════════════════════ */}
      <div id="avatar-card" className="avatar-mini" onClick={() => toggleCV()}>
        <div id="avatar-mini">
          <div className="av-portrait">
            <Image src="/bogi.png" alt="Bogi" width={40} height={40} />
          </div>
          <div>
            <div className="av-name">BOGI</div>
            <div className="av-title">software dev (in training)</div>
            <div className="av-hint">click to expand</div>
          </div>
        </div>
      </div>

      {/* ── Full CV / Profile Panel ── */}
      <div id="cv-panel" className="nbwin lavender draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128100; Profile</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => toggleCV()}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body cv-body">
          {/* Header with portrait */}
          <div className="cv-header">
            <div className="cv-portrait">
              <Image src="/bogi.png" alt="Bogi" width={90} height={90} />
            </div>
            <div>
              <div className="cv-name">BOGI</div>
              <div className="cv-role">software dev (in training)</div>
              <div className="cv-loc">Roding, Bavaria (DE)</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="cv-grid">
            <div className="cv-stat">
              <div className="cv-stat-label">EXPERIENCE</div>
              <div className="cv-stat-val">2 yrs</div>
            </div>
            <div className="cv-stat">
              <div className="cv-stat-label">PROJECTS</div>
              <div className="cv-stat-val">{PROJECTS.length}</div>
            </div>
          </div>

          {/* About section */}
          <div className="cv-section">ABOUT</div>
          <div className="cv-right">
            <p>
              Frontend &amp; 3D tinkerer. Building small interactive experiences with React, Kotlin, and Three.js.
              Passionate about clean code, retro aesthetics, and making the web a more fun place.
            </p>
          </div>

          {/* Tech stack */}
          <div className="cv-section">SKILLS</div>
          <div className="skill-wrap">
            {TECH_STACK.map((t) => (
              <div key={t.name} className={`skill-chip ${t.hot ? 'hot' : ''}`}>
                {t.name}
              </div>
            ))}
          </div>

          {/* Hobbies */}
          <div className="cv-section">HOBBIES</div>
          <div className="hobby-list">
            {HOBBIES.map((h, i) => (
              <div key={i} className="hobby-row">{h}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Screen Avatar (bouncing) ── */}
      <ScreenAvatar />

      {/* ── MUSIC PROMPT POPUP ── */}
      {musicPrompt && (
        <div className="music-prompt-overlay">
          <div className="music-prompt">
            <div className="music-prompt-bar">
              <span>&#127925; Music</span>
              <div
                className="nbwin-btn"
                onClick={() => {
                  setMusicPrompt(false);
                  setMusicNotif('declined');
                }}
              >
                &#215;
              </div>
            </div>
            <div className="music-prompt-body">
              <div className="music-prompt-icon">&#127911;</div>
              <p className="music-prompt-text">
                Would you care to listen to some music while you are browsing?
              </p>
              <div className="music-prompt-btns">
                <button
                  className="music-btn music-btn-yes"
                  onClick={() => {
                    setMusicAutoplay(true);
                    setMusicPrompt(false);
                    setMusicNotif('autoplay');
                  }}
                >
                  Yes
                </button>
                <button
                  className="music-btn music-btn-no"
                  onClick={() => {
                    setMusicPrompt(false);
                    setMusicNotif('declined');
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MUSIC NOTIFICATION TOAST ── */}
      {musicNotif && (
        <div className="music-notif" key={musicNotif}>
          <div className="music-notif-icon">{musicNotif === 'autoplay' ? '\u26A0\uFE0F' : '\uD83D\uDD14'}</div>
          <p className="music-notif-text">
            {musicNotif === 'autoplay'
              ? 'There seems to be an issue with your browser\u2019s sound settings. If you click the play button you can still listen to this awesome playlist!'
              : 'If you change your mind, you can start my personal playlist on the bottom left corner!'}
          </p>
          <button
            className="music-notif-close"
            onClick={() => setMusicNotif(null)}
          >
            &#215;
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          TASKBAR
          ═════════════════════════════════════════════════════ */}
      <div id="taskbar">
        <button className="tb-start" onClick={handleShutdown}>
          &#9211; TURN OFF
        </button>
        <div className="tb-sep" />

        <div className="tb-item active" id="tb-code" onClick={() => toggleWin('code-win', 'tb-code')}>
          &#128187; Terminal
        </div>
        <div className="tb-item" id="tb-games" onClick={() => toggleWin('games-win', 'tb-games')}>
          &#127918; Games.exe
        </div>
        <div className="tb-item" id="tb-proj" onClick={() => toggleWin('projects-win', 'tb-proj')}>
          &#128190; Projects
        </div>
        <div className="tb-item" id="tb-cvf" onClick={() => toggleWin('cv-files-win', 'tb-cvf')}>
          &#128203; CV
        </div>
        <div className="tb-item active" id="tb-map" onClick={() => toggleWin('map-win', 'tb-map')}>
          &#128506;&#65039; Map
        </div>

        <div className="tb-right">
          <span className="tb-clock">{time.slice(0, 5)}</span>
        </div>
      </div>
    </div>
  );
}
