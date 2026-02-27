'use client';
/**
 * Desktop page — the main portfolio experience.
 *
 * All heavy logic and UI sections are extracted into dedicated
 * components and hooks for readability and maintainability:
 *
 * - VaporwaveBackground  → animated canvas background
 * - useTerminal          → terminal state, commands, output
 * - TerminalWindow       → terminal window UI
 * - GamesWindow          → game picker + detail panel
 * - ProjectsWindow       → project list + detail popup
 * - CvFilesWindow        → CV file list + PDF viewer popup
 * - GalleryWindow        → image gallery with lightbox
 * - MapWindow            → interactive SVG map with pins
 * - ProfilePanel         → avatar card + expandable CV panel
 * - CassetteWidget       → cassette tape decoration + Spotify
 * - MusicPrompt          → music autoplay prompt + notification
 * - DesktopIcons         → desktop folder shortcuts
 * - GitHubWidget         → GitHub contributions calendar
 * - Topbar / Taskbar     → top and bottom bars
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ── Hooks ── */
import { useClock } from '@/hooks/useClock';
import { useWindowManager } from '@/hooks/useWindowManager';
import { initDraggables } from '@/hooks/useDraggable';
import { useTerminal } from '@/hooks/useTerminal';

/* ── Components ── */
import { useComputerStore } from '@/store/computerStore';
import ScreenAvatar from '@/components/ui/ScreenAvatar';
import {
  VaporwaveBackground,
  Topbar,
  Taskbar,
  TerminalWindow,
  GamesWindow,
  ProjectsWindow,
  CvFilesWindow,
  GalleryWindow,
  MapWindow,
  ProfilePanel,
  CassetteWidget,
  MusicPrompt,
  DesktopIcons,
  GitHubWidget,
  TrainingWindow,
} from '@/components/desktop';

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Desktop() {
  const router = useRouter();
  const time = useClock();
  const { bringToFront, openWin, closeWin, toggleWin } = useWindowManager();
  const terminal = useTerminal();

  /* ── State ── */
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showShutdownFlash, setShowShutdownFlash] = useState(false);
  const [musicPrompt, setMusicPrompt] = useState(true);
  const [musicAutoplay, setMusicAutoplay] = useState(false);
  const [musicNotif, setMusicNotif] = useState<string | null>(null);

  /* Init draggable windows on mount */
  useEffect(() => { initDraggables(bringToFront); }, [bringToFront]);

  /* ── Shutdown ── */
  const handleShutdown = useCallback(() => {
    setShowShutdownFlash(true);
    setIsShuttingDown(true);
    useComputerStore.getState().turnOff();
    setTimeout(() => router.push('/'), 1500);
  }, [router]);

  /* ── Music prompt handlers ── */
  const handleMusicAccept = useCallback(() => {
    setMusicAutoplay(true);
    setMusicPrompt(false);
    setMusicNotif('autoplay');
  }, []);

  const handleMusicDecline = useCallback(() => {
    setMusicPrompt(false);
    setMusicNotif('declined');
  }, []);

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div id="desktop">
      <VaporwaveBackground />
      {isShuttingDown && <div className="shutdown-overlay" />}
      
      {/* Shutdown flash animation */}
      {showShutdownFlash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle, #ffffff 0%, #00ff41 50%, #000000 100%)',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'shutdown-flash 1.5s ease-out forwards',
          }}
        />
      )}
      
      <style jsx global>{`
        @keyframes shutdown-flash {
          0% {
            opacity: 1;
            transform: scale(3);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.1);
          }
        }
      `}</style>

      <Topbar time={time} />

      {/* ── Decorations ── */}
      <CassetteWidget musicAutoplay={musicAutoplay} />
      <DesktopIcons openWin={openWin} />
      <GitHubWidget />

      {/* ── Windows ── */}
      <TerminalWindow
        termLines={terminal.termLines}
        termInput={terminal.termInput}
        setTermInput={terminal.setTermInput}
        termOutputRef={terminal.termOutputRef}
        termInputRef={terminal.termInputRef}
        onTermKeyDown={terminal.onTermKeyDown}
        closeWin={closeWin}
      />
      <GamesWindow closeWin={closeWin} />
      <ProjectsWindow closeWin={closeWin} />
      <CvFilesWindow closeWin={closeWin} bringToFront={bringToFront} />
      <GalleryWindow closeWin={closeWin} bringToFront={bringToFront} />
      <MapWindow closeWin={closeWin} />
      <TrainingWindow closeWin={closeWin} />

      {/* ── Profile ── */}
      <ProfilePanel bringToFront={bringToFront} />
      <ScreenAvatar />

      {/* ── Modals ── */}
      <MusicPrompt
        showPrompt={musicPrompt}
        notification={musicNotif}
        onAccept={handleMusicAccept}
        onDecline={handleMusicDecline}
        onDismissNotif={() => setMusicNotif(null)}
      />

      <Taskbar time={time} onShutdown={handleShutdown} toggleWin={toggleWin} />
    </div>
  );
}
