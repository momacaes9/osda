import { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  spin: number;
  angle: number;
  star: boolean;
}

const MAX_SPARKLES = 220;

/**
 * Green glitter that follows the mouse (and finger on touch screens).
 * Canvas overlay with pointer-events: none, so it never blocks clicks.
 * Turns itself off for users who prefer reduced motion.
 */
export function GlitterCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const sparkles: Sparkle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let running = false;
    let last = { x: -1, y: -1 };

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count && sparkles.length < MAX_SPARKLES; i++) {
        const maxLife = 35 + Math.random() * 35;
        sparkles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.6,
          vy: Math.random() * 1.2 - 0.3,
          life: maxLife,
          maxLife,
          size: 1.5 + Math.random() * 3.5,
          hue: 80 + Math.random() * 60, // lime → emerald
          spin: (Math.random() - 0.5) * 0.3,
          angle: Math.random() * Math.PI,
          star: Math.random() < 0.35,
        });
      }
    };

    const drawStar = (s: Sparkle, alpha: number) => {
      const r = s.size * 1.8;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(0, -r);
        ctx.lineTo(r * 0.22, -r * 0.22);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= 1;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03; // gentle gravity
        s.vx *= 0.98;
        s.angle += s.spin;
        const t = s.life / s.maxLife;
        const twinkle = 0.6 + 0.4 * Math.sin((s.maxLife - s.life) * 0.6 + s.hue);
        const alpha = t * twinkle;
        if (s.star) {
          drawStar(s, alpha);
        } else {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.4);
          g.addColorStop(0, `hsla(${s.hue}, 100%, 80%, ${alpha})`);
          g.addColorStop(0.4, `hsla(${s.hue}, 95%, 55%, ${alpha * 0.6})`);
          g.addColorStop(1, `hsla(${s.hue}, 90%, 40%, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      if (sparkles.length) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (x: number, y: number) => {
      const dist = last.x < 0 ? 0 : Math.hypot(x - last.x, y - last.y);
      last = { x, y };
      spawn(x, y, Math.min(6, 1 + Math.floor(dist / 8)));
      start();
    };

    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => {
      spawn(e.clientX, e.clientY, 18);
      start();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="glitter-canvas" aria-hidden="true" />;
}
