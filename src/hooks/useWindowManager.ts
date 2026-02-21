import { useCallback, useRef } from 'react';

/**
 * Manages window open/close/toggle and z-index ordering for the desktop.
 * All window manipulation is done via DOM IDs to match the neobrutalist CSS.
 */
export function useWindowManager() {
  const zCounterRef = useRef(100);

  /** Increment z-index so clicked window appears on top */
  const bringToFront = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    zCounterRef.current += 1;
    el.style.zIndex = String(zCounterRef.current);
  }, []);

  /** Open a window by adding the 'open' class and showing it */
  const openWin = useCallback(
    (id: string, tbId?: string) => {
      const w = document.getElementById(id);
      const tb = tbId ? document.getElementById(tbId) : null;
      if (!w) return;
      w.classList.add('open');
      w.style.removeProperty('display');

      /* Center the window on the desktop viewport */
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = w.getBoundingClientRect();
      const topbarH = 36;
      const taskbarH = 48;
      const left = Math.max(0, (vw - rect.width) / 2);
      const top = Math.max(topbarH, (vh - taskbarH - rect.height) / 2);
      w.style.left = `${left}px`;
      w.style.top = `${top}px`;
      w.style.right = 'auto';
      w.style.bottom = 'auto';

      if (tb) tb.classList.add('active');
      bringToFront(w);
    },
    [bringToFront],
  );

  /** Close a window by hiding it */
  const closeWin = useCallback((id: string, tbId?: string) => {
    const w = document.getElementById(id);
    const tb = tbId ? document.getElementById(tbId) : null;
    if (!w) return;
    w.classList.remove('open');
    w.style.display = 'none';
    if (tb) tb.classList.remove('active');
  }, []);

  /** Toggle a window between open and closed */
  const toggleWin = useCallback(
    (id: string, tbId?: string) => {
      const w = document.getElementById(id);
      if (!w) return;

      const isHidden = getComputedStyle(w).display === 'none';
      if (isHidden) {
        w.classList.add('open');
        w.style.removeProperty('display');

        /* Center the window on the desktop viewport (same as openWin) */
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = w.getBoundingClientRect();
        const topbarH = 36;
        const taskbarH = 48;
        const left = Math.max(0, (vw - rect.width) / 2);
        const top = Math.max(topbarH, (vh - taskbarH - rect.height) / 2);
        w.style.left = `${left}px`;
        w.style.top = `${top}px`;
        w.style.right = 'auto';
        w.style.bottom = 'auto';

        if (tbId) document.getElementById(tbId)?.classList.add('active');
        bringToFront(w);
      } else {
        w.style.display = 'none';
        w.classList.remove('open');
        if (tbId) document.getElementById(tbId)?.classList.remove('active');
      }
    },
    [bringToFront],
  );

  return { bringToFront, openWin, closeWin, toggleWin };
}
