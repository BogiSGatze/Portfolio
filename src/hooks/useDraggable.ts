import { useEffect } from 'react';

/**
 * Makes a window draggable by its title bar.
 * Converts transform-centered windows to pixel positioning on first drag.
 * Clamps position so the window stays within the viewport.
 */
export function useDraggable(
  winRef: React.RefObject<HTMLElement | null>,
  handleRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  bringToFront: (el: HTMLElement | null) => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const win = winRef.current;
    const handle = handleRef.current;
    if (!win || !handle) return;

    const onDown = (e: MouseEvent) => {
      const rect = win.getBoundingClientRect();
      const startLeft = rect.left;
      const startTop  = rect.top;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;

      bringToFront(win);
      e.preventDefault();

      const onMove = (me: MouseEvent) => {
        let x = startLeft + (me.clientX - startMouseX);
        let y = startTop  + (me.clientY - startMouseY);
        x = Math.max(0, Math.min(window.innerWidth  - win.offsetWidth,  x));
        y = Math.max(36, Math.min(window.innerHeight - win.offsetHeight - 48, y));
        win.style.left   = `${x}px`;
        win.style.top    = `${y}px`;
        win.style.right  = 'auto';
        win.style.bottom = 'auto';
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    };

    handle.addEventListener('mousedown', onDown);
    return () => handle.removeEventListener('mousedown', onDown);
  }, [winRef, handleRef, enabled, bringToFront]);
}

/** Disable pointer events on all iframes so they don't swallow mouse events during drag. */
function freezeIframes() {
  document.querySelectorAll('iframe').forEach((f) => {
    (f as HTMLElement).style.pointerEvents = 'none';
  });
}
/** Re-enable pointer events on all iframes after drag ends. */
function thawIframes() {
  document.querySelectorAll('iframe').forEach((f) => {
    (f as HTMLElement).style.pointerEvents = '';
  });
}

/**
 * Initializes drag behaviour on all `.draggable` elements via their `.nbwin-bar` handle.
 * Guards against duplicate initialisation using a data attribute.
 *
 * Each drag creates a self-contained closure so there is no shared mutable state
 * between drag sessions, and per-drag mousemove/mouseup listeners are registered
 * on mousedown and removed on mouseup (no permanent document-level accumulation).
 */
export function initDraggables(bringToFront: (el: HTMLElement | null) => void) {
  document.querySelectorAll<HTMLElement>('.draggable').forEach((el) => {
    // Skip elements that are already wired up to avoid duplicate listeners.
    if (el.dataset.dragInit === '1') return;
    el.dataset.dragInit = '1';

    const handle = el.querySelector<HTMLElement>('.nbwin-bar');
    if (!handle) return;

    // clicking anywhere in the window should bring it to front, not just the
    // title bar. this makes windows behave more intuitively.
    el.addEventListener('mousedown', () => bringToFront(el));

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();

      // Snap the element from any CSS-based centering (%, transform) to an
      // exact pixel position so subsequent style.left/top writes are stable.
      const elRect  = el.getBoundingClientRect();
      const par     = el.offsetParent as HTMLElement | null;
      const parRect = par ? par.getBoundingClientRect() : { left: 0, top: 0 };

      const startLeft = elRect.left - parRect.left;
      const startTop  = elRect.top  - parRect.top;

      el.style.transform = 'none';
      el.style.animation  = 'none';
      el.style.left   = `${startLeft}px`;
      el.style.top    = `${startTop}px`;
      el.style.right  = 'auto';
      el.style.bottom = 'auto';

      bringToFront(el);
      freezeIframes();

      // Capture mouse origin once — these never change for the life of this drag.
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;

      const onMove = (me: MouseEvent) => {
        const x = Math.max(
          0,
          Math.min(window.innerWidth - el.offsetWidth,
            startLeft + (me.clientX - startMouseX)),
        );
        const y = Math.max(
          36,
          Math.min(window.innerHeight - el.offsetHeight - 48,
            startTop + (me.clientY - startMouseY)),
        );
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
        thawIframes();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    });
  });
}
