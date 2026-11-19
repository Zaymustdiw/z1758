import React, { useEffect, useRef } from 'react';

interface ConfettiBurstProps {
  triggerKey: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  aspect: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  shape: 'rect' | 'circle';
  alpha: number;
}

const CONFETTI_COLORS = [
  '#09090B', // obsidian
  '#27272A', // charcoal
  '#52525B', // slate gray
  '#A1A1AA', // silver
  '#E4E4E7', // platinum
  '#FFFFFF', // chalk white
];

export function ConfettiBurst({ triggerKey }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const particles: Particle[] = [];

    const spawnBurst = (originX: number, originY: number, count: number, baseAngle: number, spread: number) => {
      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = 7 + Math.random() * 11;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 6 + Math.random() * 6,
          aspect: 0.45 + Math.random() * 0.4,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.22,
          tiltAngle: Math.random() * Math.PI * 2,
          tiltSpeed: 0.08 + Math.random() * 0.12,
          shape: Math.random() > 0.25 ? 'rect' : 'circle',
          alpha: 1,
        });
      }
    };

    // Launch celebratory bursts from left, center, and right
    spawnBurst(width * 0.2, height * 0.72, 45, -Math.PI / 3, 0.75);
    spawnBurst(width * 0.5, height * 0.65, 65, -Math.PI / 2, 1.15);
    spawnBurst(width * 0.8, height * 0.72, 45, (-2 * Math.PI) / 3, 0.75);

    const gravity = 0.28;
    const drag = 0.985;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2);
      lastTime = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let aliveCount = 0;
      for (const p of particles) {
        p.vx *= Math.pow(drag, dt);
        p.vy = p.vy * Math.pow(drag, dt) + gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotationSpeed * dt;
        p.tiltAngle += p.tiltSpeed * dt;

        if (p.y > window.innerHeight * 0.78) {
          p.alpha = Math.max(0, p.alpha - 0.025 * dt);
        }

        if (p.alpha <= 0 || p.y > window.innerHeight + 40) {
          continue;
        }

        aliveCount++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.tiltAngle));
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          const h = p.size * p.aspect;
          ctx.fillRect(-p.size / 2, -h / 2, p.size, h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (aliveCount > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        animationRef.current = null;
      }
    };

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
    />
  );
}
