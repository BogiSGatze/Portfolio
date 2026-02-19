'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { RetroHeader } from '@/components/ui/RetroHeader';
import { Instructions } from '@/components/ui/Instructions';
import styles from '@/styles/retro-ui.module.scss';

const Scene = dynamic(
  () => import('@/components/3d/Scene').then((mod) => mod.Scene),
  { 
    ssr: false,
    loading: () => (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingText}>INITIALIZING SYSTEM...</div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress} />
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.main}>
      <RetroHeader />
      {isLoaded && <Scene />}
      <Instructions />
    </main>
  );
}
