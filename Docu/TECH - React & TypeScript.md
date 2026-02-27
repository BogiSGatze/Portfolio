# Technology Deep Dive: React & TypeScript

> React is the UI library, and TypeScript provides type safety for the entire application.

---

## 🎯 React Overview

React is a JavaScript library for building user interfaces through components.

### Core Concepts

| Concept | Description |
|---------|-------------|
| Components | Reusable UI building blocks |
| JSX | HTML-like syntax in JavaScript |
| Props | Data passed to components |
| State | Data that changes over time |
| Hooks | Functions to use React features |

---

## 📝 TypeScript Overview

TypeScript adds static types to JavaScript, catching errors at compile time.

### Benefits

```typescript
// ❌ JavaScript - error at runtime
function add(a, b) {
  return a + b;
}
add(1, '2'); // '12' - probably not what you wanted

// ✅ TypeScript - error at compile time
function add(a: number, b: number): number {
  return a + b;
}
add(1, '2'); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

## 🎣 React Hooks

### useState

Manage component state:

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### useEffect

Side effects (data fetching, subscriptions, DOM manipulation):

```typescript
import { useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    // Run on mount
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []); // Empty deps = run once
  
  return <div>{time.toLocaleTimeString()}</div>;
}
```

### useCallback

Memoize functions to prevent unnecessary re-renders:

```typescript
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback: new function created every render
  // With useCallback: same function reference
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // Dependencies
  
  return <Child onClick={handleClick} />;
}
```

### useRef

Reference DOM elements or persist values without re-render:

```typescript
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focus = () => {
    inputRef.current?.focus();
  };
  
  return <input ref={inputRef} />;
}
```

### Custom Hooks

Extract reusable logic:

```typescript
// useClock.ts
export function useClock(): string {
  const [time, setTime] = useState('--:--:--');
  
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  
  return time;
}
```

---

## 🏷️ TypeScript Patterns in This Project

### Interface vs Type

```typescript
// Interface - preferred for object shapes
interface Game {
  name: string;
  rating: number;
}

// Type - useful for unions, primitives
type Status = 'loading' | 'success' | 'error';
```

### Props Typing

```typescript
interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

function Window({ id, title, children, onClose }: WindowProps) {
  return (
    <div id={id}>
      <h2>{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Generic Hooks

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setValue = (value: T) => {
    setStored(value);
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  return [stored, setValue];
}

// Usage
const [name, setName] = useLocalStorage<string>('name', 'Guest');
```

---

## 📁 Project Structure

```
src/
├── app/              # Next.js pages (React components)
├── components/       # Reusable React components
│   ├── 3d/          # Three.js components
│   ├── desktop/     # Desktop UI components
│   └── ui/          # Shared UI components
├── hooks/           # Custom React hooks
│   ├── useClock.ts
│   ├── useDraggable.ts
│   ├── useTerminal.ts
│   └── useWindowManager.ts
└── store/           # Zustand stores
```

---

## 🎯 Component Patterns

### Presentational Component

```typescript
interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card">
      <img src={game.icon} alt={game.name} />
      <h3>{game.name}</h3>
      <p>{game.genre}</p>
    </div>
  );
}
```

### Container Component

```typescript
export function GamesWindow() {
  const [selected, setSelected] = useState<Game | null>(null);
  const { openWin, closeWin } = useWindowManager();
  
  return (
    <div id="games-win">
      {GAMES.map(game => (
        <GameCard 
          key={game.name} 
          game={game} 
          onClick={() => setSelected(game)}
        />
      ))}
    </div>
  );
}
```

---

## 🔗 Related Documentation

- [[10 - Window Management System|Window Management System]] — Custom hooks
- [[11 - Terminal Implementation|Terminal Implementation]] — Complex hook example
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## 📝 Best Practices

1. **Type props explicitly** — Self-documenting and catches errors
2. **Use custom hooks** — Extract and reuse logic
3. **Keep components small** — One responsibility per component
4. **Prefer interfaces for objects** — More extensible than types
5. **Use strict mode** — `strict: true` in tsconfig.json
