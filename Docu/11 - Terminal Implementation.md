# Phase 4: Terminal Implementation

> The interactive terminal with custom commands, boot sequence, and easter eggs.

---

## 🎯 What Was Done

A fully functional terminal was built with a boot sequence, command parser, scrollback history, and fun easter eggs. It's implemented as a custom hook (`useTerminal`) that manages all state and logic, making it reusable and testable.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "useTerminal Hook"
        STATE[State]
        CMD[Command Parser]
        OUT[Output Generator]
        
        STATE --> termLines[termLines: TerminalLine[]]
        STATE --> termInput[termInput: string]
        STATE --> refs[DOM refs]
        
        CMD -->|parse| COMMANDS[Command Handlers]
        COMMANDS --> help[help]
        COMMANDS --> whoami[whoami]
        COMMANDS --> stack[stack]
        COMMANDS --> projects[projects]
        COMMANDS --> avatar[start/stop avatar]
        COMMANDS --> easters[Easter Eggs]
        
        OUT --> print[printLine function]
    end
    
    subgraph "TerminalWindow Component"
        UI[UI Rendering]
        UI --> OUTP[Output Div]
        UI --> INP[Input Field]
        OUTP -->|scroll| AUTO[Auto-scroll]
    end
```

---

## 📄 The `useTerminal` Hook

Located at: `src/hooks/useTerminal.ts`

### State Interface

```typescript
interface TerminalState {
  termLines: TerminalLine[];      // Output history
  termInput: string;              // Current input
  termOutputRef: RefObject<HTMLDivElement>;  // Scroll container
  termInputRef: RefObject<HTMLInputElement>; // Input element
  startTimeRef: number;           // For uptime command
  orbitRafRef: number | null;     // Avatar animation frame
}

type TerminalLine = {
  type: 'in' | 'out' | 'sys' | 'err';
  text: string;
};
```

### Boot Sequence

```typescript
export const BOOT_LINES: TerminalLine[] = [
  { type: 'sys', text: 'BOGI.OS v1.0 — System Boot' },
  { type: 'sys', text: '═══════════════════════════════' },
  { type: 'out', text: '' },
  { type: 'out', text: 'Loading modules...' },
  { type: 'out', text: '  ✦ bogi.config ........ loaded' },
  { type: 'out', text: '  ✦ portfolio.exe ...... running' },
  { type: 'out', text: '  ✦ desktop.sys ........ active' },
  { type: 'out', text: '  ✦ games.dll .......... standby' },
  { type: 'out', text: '  ✦ map.module ......... active' },
  { type: 'out', text: '' },
  { type: 'sys', text: "> System ready. Type 'help' for commands." },
];
```

### Hook Implementation

```typescript
export function useTerminal() {
  const [termLines, setTermLines] = useState<TerminalLine[]>([...BOOT_LINES]);
  const [termInput, setTermInput] = useState('');
  const termOutputRef = useRef<HTMLDivElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const orbitRafRef = useRef<number | null>(null);

  // Auto-scroll on new output
  useEffect(() => {
    const el = termOutputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [termLines]);

  // Record session start
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (orbitRafRef.current !== null) {
        cancelAnimationFrame(orbitRafRef.current);
      }
      document.getElementById('orbit-avatar')?.remove();
    };
  }, []);

  // Print a line to terminal
  const printLine = useCallback((type: TerminalLine['type'], text: string) => {
    setTermLines((prev) => [...prev, { type, text }]);
  }, []);

  // Execute a command
  const executeCommand = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    printLine('in', `$ ${cmd}`);
    const c = cmd.toLowerCase();

    // Command handlers...
    if (c === 'help') { /* ... */ }
    else if (c === 'whoami') { /* ... */ }
    // ... more commands

  }, [printLine]);

  // Handle Enter key
  const onTermKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(termInput);
      setTermInput('');
    }
  }, [termInput, executeCommand]);

  return {
    termLines,
    termInput,
    setTermInput,
    termOutputRef,
    termInputRef,
    onTermKeyDown,
  };
}
```

---

## ⌨️ Available Commands

| Command | Output |
|---------|--------|
| `help` | List of all commands |
| `whoami` | Bio information |
| `stack` | Tech stack list |
| `projects` | Project list with tech |
| `date` | Current date/time |
| `uptime` | Session duration |
| `start avatar` | Orbiting robot emoji |
| `start avatar <file>` | Custom PNG avatar |
| `stop avatar` | Remove avatar |
| `clear` | Clear terminal |
| `sudo hire bogi` | Easter egg |
| `sudo rm -rf /` | Easter egg |

---

## 🤖 Avatar Command Implementation

### Orbiting Avatar

```typescript
if (c === 'start avatar') {
  // Create avatar element
  const avatarEl = document.createElement('div');
  avatarEl.id = 'orbit-avatar';
  avatarEl.textContent = '🤖';
  avatarEl.style.cssText = [
    'position:absolute',
    'z-index:5',
    'font-size:18px',
    'pointer-events:none',
    'filter:drop-shadow(0 0 4px #ff00ff)',
  ].join(';');
  
  document.getElementById('desktop')?.appendChild(avatarEl);

  // Animation loop
  let angle = 0;
  const RADIUS = 320;
  const SPEED = 0.07;
  
  const tick = () => {
    const win = document.getElementById('code-win');
    if (!win) { 
      orbitRafRef.current = requestAnimationFrame(tick); 
      return; 
    }
    
    const r = win.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    
    angle += SPEED;
    avatarEl.style.left = `${cx + RADIUS * Math.cos(angle)}px`;
    avatarEl.style.top = `${cy + RADIUS * Math.sin(angle)}px`;
    
    orbitRafRef.current = requestAnimationFrame(tick);
  };
  
  orbitRafRef.current = requestAnimationFrame(tick);
  printLine('out', '🤖 ORBIT.EXE started around terminal.');
}
```

### Custom Image Avatar

```typescript
if (c.startsWith('start avatar ')) {
  const file = cmd.slice('start avatar '.length).trim();
  const src = file.startsWith('/') ? file : `/${file}`;
  useComputerStore.getState().startScreenAvatar(src);
  printLine('out', `BOGI.EXE started on-screen (${src}).`);
}
```

This uses the Zustand store to show the avatar via the `ScreenAvatar` component.

---

## 🎭 Easter Eggs

### `sudo hire bogi`

```typescript
if (c === 'sudo hire bogi') {
  printLine('sys', '$ sudo hire bogi');
  printLine('out', 'password: ********');
  printLine('out', 'ACCESS GRANTED');
  printLine('out', 'Hiring manager module: ready. Curiosity and a sense of humour recommended.');
  printLine('out', 'Proceeding anyway... offer generated');
}
```

### `sudo rm -rf /`

```typescript
if (c === 'sudo rm -rf /') {
  printLine('err', 'nice try. destructive commands are disabled in this tiny operating system.');
}
```

---

## 🎨 Terminal UI

The `TerminalWindow` component renders the terminal:

```typescript
export function TerminalWindow({ 
  termLines, 
  termInput, 
  setTermInput,
  termOutputRef,
  termInputRef,
  onTermKeyDown,
  closeWin 
}) {
  return (
    <div id="code-win" className="draggable nbwin terminal-win">
      <div className="nbwin-bar">
        <span>Terminal</span>
        <button onClick={() => closeWin('code-win')}>×</button>
      </div>
      <div className="nbwin-content">
        <div ref={termOutputRef} className="term-output">
          {termLines.map((line, i) => (
            <div key={i} className={`term-line term-${line.type}`}>
              {line.text}
            </div>
          ))}
        </div>
        <div className="term-input-line">
          <span>$</span>
          <input
            ref={termInputRef}
            value={termInput}
            onChange={(e) => setTermInput(e.target.value)}
            onKeyDown={onTermKeyDown}
            spellCheck={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
```

### Line Type Styling

| Type | Color | Use |
|------|-------|-----|
| `in` | Green | User input |
| `out` | White | Command output |
| `sys` | Cyan | System messages |
| `err` | Red | Errors |

---

## 🔗 Related Documentation

- [[04 - State Management|State Management]] — Zustand for avatar control
- [[12 - Desktop Components|Desktop Components]] — Other window types
- [[TECH - React & TypeScript|React & TypeScript]] — Hooks patterns

---

## 📝 Summary

| Feature | Implementation |
|---------|---------------|
| State | `useState` for lines and input |
| Commands | Switch statement parser |
| Scrolling | `useEffect` on termLines change |
| Avatar | `requestAnimationFrame` orbit |
| Custom avatar | Zustand store integration |
| Easter eggs | Hidden command handlers |
| Styling | Type-based CSS classes |
