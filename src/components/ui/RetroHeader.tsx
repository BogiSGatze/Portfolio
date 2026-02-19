'use client';

import styles from '@/styles/retro-ui.module.scss';

export function RetroHeader() {
  return (
    <header className={styles.retroHeader}>
      <div className={styles.scanline} />
      <div className={styles.glitchWrapper}>
        <h1 className={styles.glitch} data-text="RETRO SYSTEM 2005">
          RETRO SYSTEM 2005
        </h1>
      </div>
      <div className={styles.subtitle}>THREE.JS // REACT // NEXT.JS</div>
    </header>
  );
}
