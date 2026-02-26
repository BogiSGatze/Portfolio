import { useState, useEffect } from 'react';

/**
 * Returns the current time formatted as HH:MM:SS, updated every second.
 */
export function useClock(): string {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
