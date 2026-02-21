# Project Gallery Images

Put your project screenshots here.

Reference them in `src/constants/desktopData.ts` using paths like:
```
"/projects/portfolio-1.png"
"/projects/debate-duel-home.jpg"
```

Example usage in desktopData.ts:
```ts
{
  file: 'portfolio.tsx',
  name: 'Portfolio Website',
  tech: ['React', 'Next.js', 'TypeScript'],
  desc: '...',
  images: [
    { src: '/projects/portfolio-1.png', caption: 'Desktop view of the vaporwave OS' },
    { src: '/projects/portfolio-2.png', caption: '3D CRT monitor intro screen' },
  ],
},
```
