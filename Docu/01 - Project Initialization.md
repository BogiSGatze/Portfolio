# Phase 1: Project Initialization

> This document covers the initial project setup using `create-next-app` and the first steps to get the portfolio running.

---

## 🎯 What Was Done

The project was bootstrapped using the official Next.js CLI tool with TypeScript support, creating a modern React application with all necessary tooling pre-configured.

## 📝 Commands Used

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir

# Or with all defaults
npx create-next-app@latest
```

> [!note] Choices Made
> - **TypeScript**: Enabled for type safety
> - **Tailwind CSS**: Enabled for utility-first styling
> - **ESLint**: Enabled for code quality
> - **App Router**: Selected (Next.js 13+ feature)
> - **Src Directory**: Enabled for cleaner project structure

---

## 📁 Files Created

After initialization, the following key files were present:

```
portfolio/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout with fonts
│       ├── page.tsx            # Default Next.js home page
│       └── globals.css         # Global styles
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json                # Dependencies
```

---

## 🔧 Initial Customizations

### 1. Metadata Update (`src/app/layout.tsx`)

The default metadata was replaced with portfolio-specific information:

```typescript
export const metadata: Metadata = {
  title: "Bogi | Portfolio",
  description: "Bogi's portfolio — software dev in training. Built with Next.js, React Three Fiber & TypeScript.",
  icons: {
    icon: '/favicon.ico',
  },
};
```

### 2. Font Configuration

The project uses [Geist](https://vercel.com/font), Vercel's modern font family:

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### 3. Favicon Setup

Explicit favicon links were added to prevent the default Next.js triangle icon:

```typescript
<head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="shortcut icon" href="/favicon.ico" />
</head>
```

---

## 📦 Initial Dependencies

### Core Framework (from create-next-app)
```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "typescript": "^5"
}
```

### Development Tools
```json
{
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4"
}
```

---

## 🚀 Running the Project

After initialization, the development server can be started:

```bash
npm run dev
```

The application is then available at:
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

---

## 🔄 Next Steps

After project initialization, the following phases were completed:

1. **[[02 - Core Configuration|Core Configuration]]** — Fine-tuning Next.js, TypeScript, and Tailwind
2. **[[03 - Project Structure|Project Structure]]** — Organizing folders and establishing conventions
3. **[[06 - React Three Fiber Setup|React Three Fiber Setup]]** — Adding 3D capabilities

---

## 🔗 Related Technologies

- [[TECH - Next.js|Next.js]] — Framework overview
- [[TECH - React & TypeScript|React & TypeScript]] — UI library and type system
- [[TECH - Tailwind CSS|Tailwind CSS]] — Styling framework

---

> [!tip] Reference
> For the official Next.js documentation on project setup, visit:
> https://nextjs.org/docs/app/api-reference/cli/create-next-app
