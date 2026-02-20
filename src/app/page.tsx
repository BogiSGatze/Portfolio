'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { RetroHeader } from '@/components/ui/RetroHeader';
import { Instructions } from '@/components/ui/Instructions';
import { useComputerStore } from '@/store/computerStore';
import styles from '@/styles/retro-ui.module.scss';

const Scene = dynamic(
  () => import('@/components/3d/Scene').then((mod) => mod.Scene),
  { ssr: false, loading: () => null }
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isPowered = useComputerStore((s) => s.isPowered);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Trigger flash effect when powered on
  useEffect(() => {
    if (isPowered) {
      setShowFlash(true);
    }
  }, [isPowered]);

  return (
    <main className={styles.main}>
      {/* Flash transition effect */}
      {showFlash && (
        <div 
          className={styles.screenFlash}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle, #ffffff 0%, #00ff41 50%, #000000 100%)',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'flash-zoom 1.5s ease-in forwards',
          }}
        />
      )}
      
      <RetroHeader />
      {isLoaded && <Scene />}
      <Instructions />
      
      <style jsx global>{`
        @keyframes flash-zoom {
          0% {
            opacity: 0;
            transform: scale(0.1);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(3);
          }
        }
      `}</style>
    </main>
  );
}
