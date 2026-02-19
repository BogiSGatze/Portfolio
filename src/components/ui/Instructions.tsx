'use client';

import styles from '@/styles/retro-ui.module.scss';

export function Instructions() {
  return (
    <div className={styles.instructions}>
      <div className={styles.card}>
        <h3>CONTROLS</h3>
        <ul>
          <li><span>🖱️</span> Drag to rotate</li>
          <li><span>⌨️</span> Press ENTER to turn on</li>
          <li><span>🖱️</span> Or click screen</li>
        </ul>
      </div>
    </div>
  );
}
