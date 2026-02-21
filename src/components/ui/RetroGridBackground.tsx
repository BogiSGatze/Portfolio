/**
 * @deprecated This component is not imported anywhere. Safe to delete along with
 * retro-grid.module.scss if no longer needed.
 */
'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/retro-grid.module.scss';

export function RetroGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.fillStyle = '#1a1510';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(139, 119, 101, 0.15)';
      ctx.lineWidth = 1;
      
      const gridSize = 60;
      const horizonY = height * 0.4;
      offset = (offset + 0.3) % gridSize;
      
      for (let y = horizonY; y < height; y += gridSize) {
        const progress = (y - horizonY) / (height - horizonY);
        const adjustedY = y + offset * (1 - progress * 0.5);
        if (adjustedY < height) {
          ctx.beginPath();
          ctx.moveTo(0, adjustedY);
          ctx.lineTo(width, adjustedY);
          ctx.stroke();
        }
      }
      
      const centerX = width / 2;
      for (let x = -width; x < width * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        const distFromCenter = (x - centerX) / width;
        const endX = centerX + distFromCenter * 50;
        ctx.lineTo(endX, horizonY);
        ctx.stroke();
      }
      
      const gradient = ctx.createLinearGradient(0, horizonY - 2, 0, horizonY + 50);
      gradient.addColorStop(0, 'rgba(160, 130, 100, 0.08)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY - 2, width, 52);
      
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.gridCanvas} />;
}
