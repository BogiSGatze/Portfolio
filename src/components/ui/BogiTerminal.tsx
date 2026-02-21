/**
 * @deprecated This standalone terminal component is unused since the desktop page
 * now uses an inline React-state-based terminal. Safe to delete if no longer needed.
 */
'use client';

import { useEffect, useRef } from 'react';
import styles from './BogiTerminal.module.scss';
import { useComputerStore } from '@/store/computerStore';

export default function BogiTerminal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const avatarWrapRef = useRef<HTMLDivElement | null>(null);
  const avatarSpriteRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const avatarRunningRef = useRef(false);
  const bootedRef = useRef(false);

  useEffect(() => {
    const body = bodyRef.current!;
    const input = inputRef.current!;
    const avatarWrap = avatarWrapRef.current!;
    const avatarSprite = avatarSpriteRef.current!;

    const PROFILE = {
      name: 'Bogi',
      role: 'software dev in training',
      location: 'Roding, Bavaria (DE)',
      stack: ['Kotlin', 'Java', 'React', 'C#', 'Three.js', 'TypeScript', 'HTML/CSS', 'Blazor'],
      projects: [
        'DebateDuel (React/TS)',
        'DocManage (React + Express + MySQL + Calendar)',
        'Library App (Android/Kotlin)',
        'Blazor Vault site'
      ]
    };

    let startTime = Date.now();

    const print = (html: string) => {
      const div = document.createElement('div');
      div.className = (styles as any)['line'];
      div.innerHTML = html;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    };

    const clear = () => { body.innerHTML = ''; };

    const typeLines = async (lines: string[], delay = 120) => {
      for (const line of lines) {
        print(line);
        await new Promise(r => setTimeout(r, delay));
      }
    };

    const nowStr = () => new Date().toLocaleString();

    const boot = async () => {
      clear();
      input.disabled = true;
      await typeLines([
        `<span class="${(styles as any)['line']} ${'dim'}">[${nowStr()}]</span> <span class="cmd">boot</span> :: initializing BOGI.SYS`,
        `<span class="dim">[ok]</span> loading <span class="path">/kernel/ui</span>`,
        `<span class="dim">[ok]</span> mounting <span class="path">/portfolio</span>`,
        `<span class="dim">[ok]</span> establishing loopback <span class="path">127.0.0.1</span>`,
        `<span class="warn">[warn]</span> detected human curiosity. performance may degrade.`,
        `<span class="dim">[ok]</span> loading <span class="path">bogi.config</span>`,
        `<span class="dim">[ok]</span> ready. type <span class="cmd">help</span>`,
        ``
      ], 120);
      input.disabled = false;
      input.focus();
      bootedRef.current = true;
      startTime = Date.now();
    };

    const help = () => {
      print(`<span class="cmd">commands</span>:\n<span class="dim">help</span> | whoami | stack | projects | date | uptime | clear\n<span class="dim">sudo hire bogi</span> | start avatar [file]|start avatar local | stop avatar`);
    };

    const whoami = () => {
      print(`<span class="ok">${PROFILE.role}</span> • ${PROFILE.name} • ${PROFILE.location}`);
    };

    const stack = () => {
      print(`<span class="cmd">cat stack.json</span>`);
      print(`→ <span class="ok">${PROFILE.stack.join(', ')}</span>`);
    };

    const projects = () => {
      print(`<span class="cmd">ls projects/</span>`);
      PROFILE.projects.forEach(p => print(`→ <span class="path">${p}</span>`));
    };

    const sudoHire = () => {
      print(`<span class="cmd">$ sudo hire bogi</span>`);
      print(`<span class="dim">password:</span> ********`);
      print(`<span class="ok">ACCESS GRANTED</span> ✅`);
      print(`Hiring manager module: <span class="warn">disabled</span> (corporate policy: “no joy allowed”)`);
      print(`Proceeding anyway... <span class="ok">offer generated</span> → <span class="path">/inbox/contract.pdf</span>`);
    };

    const startAvatar = () => {
      if (avatarRunningRef.current) {
        print(`<span class="warn">avatar</span> already running. it refuses to be double-employed.`);
        return;
      }
      avatarWrap.style.display = 'block';
      avatarRunningRef.current = true;

      // read current scale (so movement + sizing stays consistent when window is scaled)
      const containerEl = body.parentElement as HTMLElement | null;
      const scale = containerEl ? (parseFloat(getComputedStyle(containerEl).getPropertyValue('--window-scale')) || 1) : 1;

      let x = Math.round(16 * scale), y = Math.round(40 * scale);
      let vx = 1.25 * scale, vy = 0.95 * scale;

      const tick = () => {
        const w = avatarWrap.clientWidth;
        const h = avatarWrap.clientHeight;
        const avatarSize = avatarSprite.clientWidth || Math.round(60 * scale);

        x += vx; y += vy;

        const maxX = Math.max(6, w - avatarSize - 6);
        const maxY = Math.max(34, h - avatarSize - 8);

        if (x <= 6 || x >= maxX) vx *= -1;
        if (y <= 34 || y >= maxY) vy *= -1;

        avatarSprite.style.transform = `translate(${x}px, ${y}px)`;
      };

      animRef.current = window.setInterval(tick, 16);
      print(`<span class="ok">BOGI.EXE</span> started. it is now doing important pixel business.`);
    };

    // start/stop the global on-screen PNG avatar via the store
    const startScreenAvatarCmd = (filename?: string) => {
      const src = filename ? (filename.startsWith('/') ? filename : `/${filename}`) : '/bogi.png';
      useComputerStore.getState().startScreenAvatar(src);
      print(`<span class="ok">BOGI.EXE</span> started on-screen (${src}).`);
    };

    const stopScreenAvatarCmd = () => {
      useComputerStore.getState().stopScreenAvatar();
      print(`<span class="dim">BOGI.EXE</span> terminated (screen).`);
    };

    const stopAvatar = () => {
      if (!avatarRunningRef.current) {
        print(`<span class="warn">avatar</span> not running. it’s off living a normal life.`);
        return;
      }
      if (animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
      avatarRunningRef.current = false;
      avatarWrap.style.display = 'none';
      print(`<span class="dim">BOGI.EXE</span> terminated (politely).`);
    };

    const uptime = () => {
      const ms = Date.now() - startTime;
      const s = Math.floor(ms/1000);
      const m = Math.floor(s/60);
      const h = Math.floor(m/60);
      const ss = s % 60;
      const mm = m % 60;
      print(`uptime: <span class="ok">${h}h ${mm}m ${ss}s</span>`);
    };

    const run = async (cmdRaw: string) => {
      const cmd = cmdRaw.trim();
      if (!cmd) return;
      print(`<span class="cmd">$</span> ${cmd.replaceAll('<','&lt;').replaceAll('>','&gt;')}`);
      const c = cmd.toLowerCase();

      if (c === 'help') return help();
      if (c === 'clear') return clear();
      if (c === 'whoami') return whoami();
      if (c === 'stack' || c === 'cat stack.json') return stack();
      if (c === 'projects' || c === 'ls projects/' || c === 'ls projects') return projects();
      if (c === 'date') return print(nowStr());
      if (c === 'uptime') return uptime();
      if (c === 'sudo hire bogi') return sudoHire();
      if (c.startsWith('start avatar')) {
        const parts = cmd.split(' ').slice(2);
        // 'start avatar local' → terminal-local avatar
        if (parts.length === 1 && (parts[0] === 'local' || parts[0] === 'terminal')) {
          return startAvatar();
        }
        // otherwise start a screen-level PNG avatar (default: /bogi.png)
        const file = parts.length ? parts.join(' ') : 'bogi.png';
        startScreenAvatarCmd(file);
        return;
      }

      if (c === 'stop avatar') {
        // prefer stopping terminal-local avatar if running, otherwise stop screen avatar
        if (avatarRunningRef.current) return stopAvatar();
        stopScreenAvatarCmd();
        return;
      }

      if (c === 'sudo rm -rf /') {
        print(`<span class="warn">nice try</span>. deleting your portfolio would improve performance, but not your chances.`);
        return;
      }
      if (c === 'exit') {
        print(`<span class="dim">you can’t exit the portfolio. you can only scroll.</span>`);
        return;
      }

      print(`<span class="warn">command not found</span>: ${cmd} <span class="dim">(type help)</span>`);
    };

    const onKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const v = input.value;
        input.value = '';
        await run(v);
      }
    };

    input.addEventListener('keydown', onKeyDown as any);

    // click-to-focus on container
    const container = body.parentElement as HTMLElement | null;
    const onContainerClick = () => input.focus();
    if (container) container.addEventListener('click', onContainerClick);

    // Ensure the terminal reliably sees the effective --window-scale from its containing window.
    // Walk ancestors to find where --window-scale is defined, copy it to the terminal root, and observe style changes.
    const root = rootRef.current;
    const findAncestorWithScale = (el: HTMLElement | null): { el: HTMLElement; val: string } | null => {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const v = getComputedStyle(cur).getPropertyValue('--window-scale').trim();
        if (v) return { el: cur, val: v };
        cur = cur.parentElement;
      }
      return null;
    };

    const applyScaleToRoot = (fromEl?: HTMLElement | null) => {
      const found = findAncestorWithScale(fromEl || (root ? root.parentElement : null));
      const val = (found && found.val) ? found.val : '1';
      if (root) root.style.setProperty('--window-scale', val);
      return found ? found.el : null;
    };

    let observedWinEl: HTMLElement | null = applyScaleToRoot();
    let mo: MutationObserver | null = null;
    if (observedWinEl) {
      mo = new MutationObserver(() => {
        const v = getComputedStyle(observedWinEl!).getPropertyValue('--window-scale').trim() || '1';
        if (root) root.style.setProperty('--window-scale', v);
        // debug: show propagation so we can confirm the terminal root receives the value
        console.debug('[BogiTerminal] observedWinEl --window-scale=', v, 'applied-to-root=', root ? root.style.getPropertyValue('--window-scale') : 'no-root');
      });
      mo.observe(observedWinEl, { attributes: true, attributeFilter: ['style'] });
    }

    // boot on mount
    boot();

    return () => {
      input.removeEventListener('keydown', onKeyDown as any);
      if (container) container.removeEventListener('click', onContainerClick);
      if (animRef.current) clearInterval(animRef.current);
      if (mo) mo.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={(styles as any)['bogi-terminal']}>
      <div ref={bodyRef} className={(styles as any)['bogi-terminal__body']} role="log" aria-live="polite" />

      <div className={(styles as any)['bogi-terminal__input']}>
        <span className="prompt">$</span>
        <input ref={inputRef} type="text" autoComplete="off" spellCheck={false} />
      </div>

      <div ref={avatarWrapRef} className={(styles as any)['bogi-avatar']} aria-hidden="true">
        <div className={(styles as any)['bogi-avatar__label']}>BOGI.EXE</div>
        <div ref={avatarSpriteRef} className={(styles as any)['bogi-avatar__sprite']} title="Bogi.exe (mostly harmless)">
          <div className={`${(styles as any).p} ${(styles as any).head}`} />
          <div className={`${(styles as any).p} ${(styles as any).eyeL}`} />
          <div className={`${(styles as any).p} ${(styles as any).eyeR}`} />
          <div className={`${(styles as any).p} ${(styles as any).mouth}`} />
          <div className={`${(styles as any).p} ${(styles as any).body}`} />
          <div className={`${(styles as any).p} ${(styles as any).armL}`} />
          <div className={`${(styles as any).p} ${(styles as any).armR}`} />
          <div className={`${(styles as any).p} ${(styles as any).legL}`} />
          <div className={`${(styles as any).p} ${(styles as any).legR}`} />
        </div>
      </div>
    </div>
  );
}
