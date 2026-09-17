'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useComputerStore } from '@/store/computerStore';
import {
  BOOT_LINES,
  TECH_STACK,
  PROJECTS,
  type TerminalLine,
} from '@/constants/desktopData';

/**
 * Encapsulates all terminal state and logic:
 * command parsing, output lines, auto-scroll, and
 * the orbiting avatar animation.
 */
export function useTerminal() {
  const [termLines, setTermLines] = useState<TerminalLine[]>([...BOOT_LINES]);
  const [termInput, setTermInput] = useState('');

  const termOutputRef = useRef<HTMLDivElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const orbitRafRef = useRef<number | null>(null);

  /* Auto-scroll terminal output */
  useEffect(() => {
    const el = termOutputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [termLines]);

  /* Record session start on mount */
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  /* Cleanup orbit animation on unmount */
  useEffect(() => {
    return () => {
      if (orbitRafRef.current !== null) cancelAnimationFrame(orbitRafRef.current);
      document.getElementById('orbit-avatar')?.remove();
    };
  }, []);

  const printLine = useCallback((type: TerminalLine['type'], text: string) => {
    setTermLines((prev) => [...prev, { type, text }]);
  }, []);

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
      if (c === 'clear') { setTermLines([]); return; }
      if (c === 'whoami') {
        printLine('out', 'Bogi \u2014 Software Dev in Training');
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
      if (c === 'date') { printLine('out', new Date().toLocaleString()); return; }
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
        document.getElementById('orbit-avatar')?.remove();
        if (orbitRafRef.current !== null) { cancelAnimationFrame(orbitRafRef.current); orbitRafRef.current = null; }

        const desktop = document.getElementById('desktop');
        const avatarEl = document.createElement('div');
        avatarEl.id = 'orbit-avatar';
        avatarEl.textContent = '\uD83E\uDD16';
        avatarEl.style.cssText = [
          'position:absolute', 'z-index:5', 'font-size:18px',
          'pointer-events:none', 'user-select:none',
          'transform:translate(-50%,-50%)',
          'filter:drop-shadow(0 0 4px #ff00ff)',
        ].join(';');
        (desktop ?? document.body).appendChild(avatarEl);

        const desktopRect = desktop?.getBoundingClientRect() ?? { left: 0, top: 0 };
        let angle = 0;
        const RADIUS = 320;
        const SPEED = 0.07;
        const tick = () => {
          const win = document.getElementById('code-win');
          if (!win) { orbitRafRef.current = requestAnimationFrame(tick); return; }
          const r = win.getBoundingClientRect();
          const cx = r.left + r.width / 2 - desktopRect.left;
          const cy = r.top + r.height / 2 - desktopRect.top;
          angle += SPEED;
          avatarEl.style.left = `${cx + RADIUS * Math.cos(angle)}px`;
          avatarEl.style.top = `${cy + RADIUS * Math.sin(angle)}px`;
          const termZ = parseInt(win.style.zIndex || '101', 10);
          avatarEl.style.zIndex = String(Math.max(5, termZ - 1));
          orbitRafRef.current = requestAnimationFrame(tick);
        };
        orbitRafRef.current = requestAnimationFrame(tick);
        printLine('out', '\uD83E\uDD16 ORBIT.EXE started around terminal. type stop avatar to dismiss.');
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
        if (orbitRafRef.current !== null) { cancelAnimationFrame(orbitRafRef.current); orbitRafRef.current = null; }
        document.getElementById('orbit-avatar')?.remove();
        useComputerStore.getState().stopScreenAvatar();
        printLine('out', '\uD83E\uDD16 ORBIT.EXE terminated.');
        return;
      }
      if (c === 'sudo hire bogi') {
        printLine('sys', '$ sudo hire bogi');
        printLine('out', 'password: ********');
        printLine('out', 'ACCESS GRANTED');
        printLine('out', 'Hiring manager module: ready. Curiosity and a sense of humour recommended.');
        printLine('out', 'Proceeding anyway... offer generated');
        return;
      }
      if (c === 'sudo rm -rf /') {
        printLine('err', 'nice try. destructive commands are disabled in this tiny operating system.');
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

  const onTermKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeCommand(termInput);
        setTermInput('');
      }
    },
    [termInput, executeCommand],
  );

  return {
    termLines,
    termInput,
    setTermInput,
    termOutputRef,
    termInputRef,
    onTermKeyDown,
  };
}
