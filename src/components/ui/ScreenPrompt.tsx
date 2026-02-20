'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useComputerStore } from '@/store/computerStore';
import styles from '@/styles/retro-ui.module.scss';

// Generate random position on screen (keeping within reasonable bounds)
const getRandomPosition = () => {
  const x = 20 + Math.random() * 60; // 20% to 80% of screen width
  const y = 20 + Math.random() * 60; // 20% to 80% of screen height
  return { x, y };
};

export function ScreenPrompt() {
  const router = useRouter();
  const isPowered = useComputerStore((s) => s.isPowered);
  const turnOn = useComputerStore((s) => s.turnOn);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Set random position on mount
    setPosition(getRandomPosition());
  }, []);

  const handleActivate = () => {
    if (!isPowered) {
      turnOn();
      setTimeout(() => router.push('/desktop'), 150);
    }
  };

  if (isPowered) return null;

  const style: React.CSSProperties = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div className={styles.screenPrompt} onClick={handleActivate} role="button" tabIndex={0} style={style}>
      <span className={styles.screenPromptText}>Press ENTER to turn on</span>
      <span className={styles.screenPromptCursor}>_</span>
    </div>
  );
}
