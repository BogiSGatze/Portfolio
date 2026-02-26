'use client';

import React, { useEffect, useRef } from 'react';
import styles from './ScreenAvatar.module.scss';
import { useComputerStore } from '@/store/computerStore';

export default function ScreenAvatar() {
  const on = useComputerStore((s) => s.avatarOnScreen);
  const src = useComputerStore((s) => s.avatarSrc);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!on) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    let x = 60, y = 120;
    let vx = 1.6, vy = 1.0;

    const step = () => {
      const img = imgRef.current;
      const w = img?.clientWidth ?? 64;
      const h = img?.clientHeight ?? 64;
      const maxX = Math.max(8, window.innerWidth - w - 20);
      const maxY = Math.max(8, window.innerHeight - h - 20);

      x += vx; y += vy;
      if (x <= 8 || x >= maxX) vx *= -1;
      if (y <= 8 || y >= maxY) vy *= -1;

      if (img) img.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [on, src]);

  if (!on) return null;

  return (
    <div className={styles.container} aria-hidden="true">
      <img ref={imgRef} src={src} className={styles.avatar} alt="BOGI avatar" />
    </div>
  );
}
