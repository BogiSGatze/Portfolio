'use client';

import styles from '@/styles/retro-ui.module.scss';

export function RetroHeader() {
  return (
    <header className={styles.retroHeader}>
      <div className={styles.scanline} />
      <div className={styles.glitchWrapper}>
        <h1 className={styles.glitch} data-text="RETRO SYSTEM 2001">
          RETRO SYSTEM 2001
        </h1>
      </div>
      <div className={styles.subtitle}>MY IDEA OF HAVING FUN</div>
    </header>
  );
}
