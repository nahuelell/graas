"use client";

import { useEffect, useRef } from "react";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };

/**
 * Chispas de soldadura en canvas.
 * - origin: punto de emisión en proporción del contenedor (0..1).
 * - rate: chispas por frame (puede ser decimal).
 * - burst: cantidad de chispas de un disparo inicial.
 */
export function Sparks({
  origin = { x: 0.5, y: 0.5 },
  rate = 1.2,
  burst = 0,
  spread = Math.PI * 1.1,
  direction = -Math.PI / 2,
  speed = 7,
  gravity = 0.22,
  active = true,
  className,
}: {
  origin?: { x: number; y: number };
  rate?: number;
  burst?: number;
  spread?: number;
  direction?: number;
  speed?: number;
  gravity?: number;
  active?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const sparks: Spark[] = [];
    const emit = (n: number) => {
      for (let i = 0; i < n; i++) {
        const a = direction + (Math.random() - 0.5) * spread;
        const s = speed * (0.35 + Math.random() * 0.9);
        const max = 40 + Math.random() * 50;
        sparks.push({
          x: origin.x * w + (Math.random() - 0.5) * 6,
          y: origin.y * h + (Math.random() - 0.5) * 4,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: max,
          max,
          size: 0.8 + Math.random() * 1.8,
          hue: 38 + Math.random() * 18,
        });
      }
    };
    if (burst) emit(burst);

    let acc = 0;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (activeRef.current) {
        acc += rate * (0.6 + Math.random() * 0.8);
        const n = Math.floor(acc);
        acc -= n;
        emit(n);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        const px = p.x;
        const py = p.y;
        p.vy += gravity;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h - 2 && p.vy > 0) {
          p.vy *= -0.35;
          p.vx *= 0.7;
          p.y = h - 2;
        }
        p.life -= 1;
        const t = p.life / p.max;
        if (t <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${60 + t * 35}%, ${t})`;
        ctx.lineWidth = p.size * t + 0.3;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * 1.6, py - p.vy * 1.6);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [origin.x, origin.y, rate, burst, spread, direction, speed, gravity]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
