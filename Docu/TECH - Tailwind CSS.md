# Technology Deep Dive: Tailwind CSS

> Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.

---

## 🎯 What is Tailwind CSS?

Tailwind CSS provides low-level utility classes that let you build completely custom designs without leaving your HTML/JSX.

### Traditional CSS Approach

```css
/* styles.css */
.btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  font-weight: bold;
}

.btn:hover {
  background-color: #2563eb;
}
```

```html
<button class="btn">Click me</button>
```

### Tailwind Approach

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600">
  Click me
</button>
```

---

## 🎨 Utility Classes

### Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <div class="flex-1">Left</div>
  <div class="flex-1">Right</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Positioning -->
<div class="relative">
  <div class="absolute top-0 right-0">Badge</div>
</div>
```

### Spacing

```html
<!-- Margin -->
<div class="m-4">        <!-- 1rem margin all sides -->
<div class="mt-2">       <!-- margin-top: 0.5rem -->
<div class="mx-auto">    <!-- horizontal auto margin -->

<!-- Padding -->
<div class="p-4">        <!-- 1rem padding -->
<div class="px-4 py-2">  <!-- horizontal 1rem, vertical 0.5rem -->
```

### Colors

```html
<!-- Background -->
<div class="bg-blue-500">
<div class="bg-gray-900">
<div class="bg-white/50">  <!-- 50% opacity -->

<!-- Text -->
<p class="text-red-500">
<p class="text-white">
<p class="text-gray-600">

<!-- Border -->
<div class="border-2 border-black">
```

### Typography

```html
<p class="text-lg font-bold">
<p class="text-sm text-gray-500 italic">
<h1 class="text-4xl font-extrabold">
<p class="leading-relaxed tracking-wide">
```

### Responsive Design

```html
<!-- Mobile-first: base → sm → md → lg → xl -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

<div class="hidden md:block">
  Hidden on mobile, visible on md+
</div>
```

---

## ⚙️ Configuration

### Tailwind v4 (This Project)

Tailwind v4 uses CSS-based configuration:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

### Custom Classes with @apply

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded font-bold;
    @apply hover:bg-blue-600 transition-colors;
  }
}
```

---

## 🎯 This Project's Usage

### Inline Utilities

```tsx
// app/page.tsx
<div 
  className="fixed inset-0 z-50 pointer-events-none"
  style={{
    background: 'radial-gradient(circle, #ffffff 0%, #00ff41 50%, #000000 100%)',
  }}
/>
```

### Combining with CSS Modules

```tsx
// components/ui/Instructions.tsx
import styles from './Instructions.module.css';

export function Instructions() {
  return (
    <div className={`${styles.instructions} p-4 bg-black/50 rounded`}>
      <p className="text-white text-center">Press ENTER</p>
    </div>
  );
}
```

### Hybrid Approach

This project uses Tailwind alongside other styling methods:

| Use Case | Method |
|----------|--------|
| Quick utilities | Tailwind classes |
| Landing page | SCSS modules |
| Desktop windows | Vanilla CSS files |
| Complex animations | CSS keyframes |

---

## 🔄 Conditional Classes

### Template Literals

```tsx
function Button({ variant, children }) {
  return (
    <button className={`
      px-4 py-2 rounded font-bold
      ${variant === 'primary' ? 'bg-blue-500 text-white' : ''}
      ${variant === 'secondary' ? 'bg-gray-200 text-black' : ''}
    `}>
      {children}
    </button>
  );
}
```

### clsx / classnames

```tsx
import clsx from 'clsx';

function Button({ isActive, isDisabled, children }) {
  return (
    <button className={clsx(
      'px-4 py-2 rounded font-bold',
      'bg-blue-500 text-white',
      {
        'bg-blue-700': isActive,
        'opacity-50 cursor-not-allowed': isDisabled,
      }
    )}>
      {children}
    </button>
  );
}
```

---

## 📊 Why Utility-First?

| Benefit | Explanation |
|---------|-------------|
| **Speed** | No switching between files |
| **Consistency** | Design system enforced by constraints |
| **Smaller bundle** | PurgeCSS removes unused styles |
| **Maintainability** | No naming classes |
| **Responsive** | Built-in breakpoints |

---

## 🔗 Related Documentation

- [[13 - Styling Architecture|Styling Architecture]] — How Tailwind fits in
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

## 📝 Best Practices

1. **Use the JIT engine** — Generates styles on-demand
2. **Extract components** — Don't repeat complex patterns
3. **Use @apply sparingly** — Prefer component extraction
4. **Leverage IntelliSense** — VS Code Tailwind extension
5. **Read the docs** — Many useful utilities (ring, backdrop, etc.)
