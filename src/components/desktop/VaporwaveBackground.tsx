'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated vaporwave canvas background with sky gradient,
 * perspective grid floor, sun, twinkling stars, and vignette.
 */
export default function VaporwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    if (!cx) return;

    let W = 0;
    let H = 0;
    let stars: { x: number; y: number; r: number; alpha: number; twinkle: number; speed: number }[] = [];
    let gt = 0;
    let raf = 0;

    const initStars = () => {
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.55,
        r: 0.5 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.6,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      }));
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStars();
    };

    const draw = () => {
      cx.clearRect(0, 0, W, H);
      gt += 0.008;

      /* sky gradient */
      const sky = cx.createLinearGradient(0, 0, 0, H * 0.62);
      sky.addColorStop(0, '#0d0820');
      sky.addColorStop(0.4, '#1a0a3a');
      sky.addColorStop(0.7, '#3d1060');
      sky.addColorStop(1, '#ff2d9b');
      cx.fillStyle = sky;
      cx.fillRect(0, 0, W, H);

      /* grid floor */
      const floorY = H * 0.58;
      const gridH = H - floorY;
      const floor = cx.createLinearGradient(0, floorY, 0, H);
      floor.addColorStop(0, '#c020a0');
      floor.addColorStop(0.4, '#8010c0');
      floor.addColorStop(1, '#200840');
      cx.fillStyle = floor;
      cx.fillRect(0, floorY, W, gridH);

      /* perspective grid lines */
      const vp = { x: W / 2, y: floorY };
      const gridLines = 16;
      cx.strokeStyle = 'rgba(255,45,155,0.35)';
      cx.lineWidth = 1;
      for (let i = 0; i <= gridLines; i++) {
        const x = (W * i) / gridLines;
        cx.beginPath();
        cx.moveTo(x, H);
        cx.lineTo(vp.x, vp.y);
        cx.stroke();
      }

      /* horizontal moving grid lines */
      const hLines = 14;
      for (let j = 0; j <= hLines; j++) {
        const t = (j / hLines + gt * 0.3) % 1;
        const ease = t * t;
        const y = floorY + gridH * ease;
        const xSpread = (1 - ease) * W * 0.5;
        const alpha = 0.6 * (1 - Math.abs(t - 0.5) * 1.5);
        cx.strokeStyle = `rgba(255,45,155,${Math.max(0, alpha)})`;
        cx.beginPath();
        cx.moveTo(vp.x - xSpread, y);
        cx.lineTo(vp.x + xSpread, y);
        cx.stroke();
      }

      /* sun */
      const sunX = W / 2;
      const sunY = H * 0.38;
      const sunR = H * 0.14;
      const sg = cx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sg.addColorStop(0, '#ffe44d');
      sg.addColorStop(0.4, '#ff8c00');
      sg.addColorStop(0.7, '#ff2d9b');
      sg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = sg;
      cx.beginPath();
      cx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      cx.fill();

      /* sun scanlines */
      cx.fillStyle = 'rgba(13,8,32,0.25)';
      for (let sl = 0; sl < 14; sl++) {
        const sy = sunY - sunR * 0.6 + sl * ((sunR * 1.2) / 14);
        const halfW = Math.sqrt(Math.max(0, sunR * sunR - (sy - sunY) * (sy - sunY)));
        cx.fillRect(sunX - halfW, sy, halfW * 2, 3);
      }

      /* twinkling stars */
      for (const s of stars) {
        s.twinkle += s.speed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
        cx.beginPath();
        cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,255,${a})`;
        cx.fill();
      }

      /* horizon glow */
      const hg = cx.createLinearGradient(0, floorY - 20, 0, floorY + 20);
      hg.addColorStop(0, 'rgba(255,45,155,0)');
      hg.addColorStop(0.5, 'rgba(255,45,155,0.35)');
      hg.addColorStop(1, 'rgba(255,45,155,0)');
      cx.fillStyle = hg;
      cx.fillRect(0, floorY - 20, W, 40);

      /* vignette */
      const vg = cx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      cx.fillStyle = vg;
      cx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
