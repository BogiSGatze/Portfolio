'use client';

import { useRouter } from 'next/navigation';
import { RetroGridBackground } from '@/components/ui/RetroGridBackground';
import styles from '@/styles/retro-grid.module.scss';

export default function DesktopPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className={styles.desktopContainer}>
      <RetroGridBackground />
      
      <div className={styles.desktopContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>System Online</h1>
          <button className={styles.backButton} onClick={handleBack}>
            ← SHUTDOWN
          </button>
        </header>
        
        <main className={styles.mainContent}>
          <h2 className={styles.welcomeText}>Welcome</h2>
        </main>
      </div>
    </div>
  );
}
