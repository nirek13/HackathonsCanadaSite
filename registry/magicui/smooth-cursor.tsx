'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

function isTouchDevice() {
  if (typeof window === 'undefined') return true;
  // Hybrid devices often report touch points even with a mouse.
  // Enable custom cursor whenever a fine pointer is present.
  return !window.matchMedia('(any-pointer: fine)').matches;
}

export function SmoothCursor() {
  const reduceMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dotX = useTransform(x, (v) => v - 6);
  const dotY = useTransform(y, (v) => v - 6);
  const ringX = useTransform(x, (v) => v - 24);
  const ringY = useTransform(y, (v) => v - 24);

  const spring = useMemo(() => {
    return {
      stiffness: 0.18,
      damping: 0.78,
    };
  }, []);

  useEffect(() => {
    const evaluatePointer = () => {
      setHasFinePointer(!isTouchDevice());
    };
    evaluatePointer();
    window.addEventListener('resize', evaluatePointer);
    return () => window.removeEventListener('resize', evaluatePointer);
  }, []);

  const enabled = !reduceMotion && hasFinePointer;

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (pos.current.x === 0 && pos.current.y === 0) {
        pos.current.x = target.current.x;
        pos.current.y = target.current.y;
      }
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;

      pos.current.x += dx * spring.stiffness;
      pos.current.y += dy * spring.stiffness;

      x.set(pos.current.x);
      y.set(pos.current.y);

      raf.current = window.requestAnimationFrame(tick);
    };

    raf.current = window.requestAnimationFrame(tick);
    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [enabled, spring.damping, spring.stiffness, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-60 h-3 w-3 rounded-full bg-black/70"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-59 h-12 w-12 rounded-full border border-black/20"
        style={{
          x: ringX,
          y: ringY,
          backdropFilter: 'blur(2px)',
        }}
      />
    </>
  );
}

