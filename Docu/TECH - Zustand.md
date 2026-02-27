# Technology Deep Dive: Zustand

> Zustand is a small, fast, and scalable state management solution for React.

---

## 🎯 What is Zustand?

Zustand (German for "state") is a lightweight state management library for React. Unlike Redux or Context API, it requires minimal boilerplate and offers excellent TypeScript support.

### Why Zustand?

| Feature | Benefit |
|---------|---------|
| **Small** | ~1KB bundle size |
| **No boilerplate** | No reducers, actions, or providers |
| **TypeScript** | Excellent type inference |
| **No re-renders** | Subscribe to only what you need |
| **DevTools** | Redux DevTools compatible |

---

## 🏪 Basic Store

### Creating a Store

```typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
}));
```

### Using the Store

```typescript
function BearCounter() {
  // Subscribe to only 'bears' - component won't re-render when other state changes
  const bears = useBearStore((state) => state.bears);
  
  return <h1>{bears} bears around here...</h1>;
}

function BearControls() {
  const { increase, decrease } = useBearStore();
  
  return (
    <>
      <button onClick={increase}>Add Bear</button>
      <button onClick={decrease}>Remove Bear</button>
    </>
  );
}
```

---

## 🎨 This Project's Store

### Store Definition

```typescript
// src/store/computerStore.ts
import { create } from 'zustand';

interface ComputerState {
  // State
  isPowered: boolean;
  screenGlow: number;
  floatOffset: number;
  promptScreenPos: [number, number] | null;
  avatarOnScreen: boolean;
  avatarSrc: string;

  // Actions
  turnOn: () => void;
  turnOff: () => void;
  setScreenGlow: (glow: number) => void;
  setFloatOffset: (offset: number) => void;
  setPromptScreenPos: (pos: [number, number] | null) => void;
  startScreenAvatar: (src?: string) => void;
  stopScreenAvatar: () => void;
}

export const useComputerStore = create<ComputerState>((set) => ({
  // Initial state
  isPowered: false,
  screenGlow: 0.3,
  floatOffset: 0,
  promptScreenPos: null,
  avatarOnScreen: false,
  avatarSrc: '/bogi.png',

  // Actions
  turnOn: () => set({ isPowered: true, screenGlow: 1 }),
  turnOff: () => set({ isPowered: false, screenGlow: 0.3 }),
  setScreenGlow: (glow) => set({ screenGlow: glow }),
  setFloatOffset: (offset) => set({ floatOffset: offset }),
  setPromptScreenPos: (pos) => set({ promptScreenPos: pos }),
  startScreenAvatar: (src = '/bogi.png') => set({ 
    avatarOnScreen: true, 
    avatarSrc: src 
  }),
  stopScreenAvatar: () => set({ avatarOnScreen: false }),
}));
```

---

## 🔌 Usage Patterns

### Selecting State

```typescript
// ✅ Good: Subscribe to specific state
const isPowered = useComputerStore((state) => state.isPowered);
const turnOn = useComputerStore((state) => state.turnOn);

// ❌ Bad: Subscribe to entire store (causes unnecessary re-renders)
const { isPowered, screenGlow, turnOn } = useComputerStore();
```

### In Components

```typescript
function PowerButton() {
  const isPowered = useComputerStore((state) => state.isPowered);
  const turnOn = useComputerStore((state) => state.turnOn);
  const turnOff = useComputerStore((state) => state.turnOff);

  return (
    <button onClick={isPowered ? turnOff : turnOn}>
      {isPowered ? 'Turn Off' : 'Turn On'}
    </button>
  );
}
```

### Outside React Components

```typescript
import { useComputerStore } from '@/store/computerStore';

// Get current state (not reactive)
const current = useComputerStore.getState();
console.log(current.isPowered);

// Call actions directly
useComputerStore.getState().turnOn();
useComputerStore.getState().startScreenAvatar('/custom.png');
```

This is useful in:
- Event handlers
- Callbacks
- Non-React code

---

## 🔄 State Updates

### Simple Update

```typescript
set({ isPowered: true });
```

### Based on Previous State

```typescript
increase: () => set((state) => ({ count: state.count + 1 }));
```

### Multiple Properties

```typescript
turnOn: () => set({ 
  isPowered: true, 
  screenGlow: 1,
  lastPoweredOn: new Date()
});
```

---

## 🧪 Async Actions

```typescript
interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const user = await api.getUser(id);
      set({ user, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
```

---

## 📊 DevTools Integration

Enable Redux DevTools for debugging:

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create<State>()(
  devtools((set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
  }))
);
```

---

## 🎯 Comparison with Alternatives

### Zustand vs Context API

| Aspect | Zustand | Context API |
|--------|---------|-------------|
| Boilerplate | Minimal | Requires Provider, hooks |
| Re-renders | Granular (selector-based) | All consumers re-render |
| Bundle size | ~1KB | Built-in |
| DevTools | Yes | No |

### Zustand vs Redux

| Aspect | Zustand | Redux |
|--------|---------|-------|
| Boilerplate | None | Actions, reducers, store setup |
| Learning curve | Low | Medium |
| Ecosystem | Small but growing | Large |
| DevTools | Compatible | Native |

---

## 🔗 Related Documentation

- [[04 - State Management|State Management]] — How store is used in project
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)

---

## 📝 Best Practices

1. **Use selectors** — Subscribe to only what you need
2. **Separate state and actions** — Keeps components clean
3. **Type your store** — Full TypeScript support
4. **Use `getState()` outside React** — For callbacks, events
5. **Keep stores focused** — One store per domain/feature
