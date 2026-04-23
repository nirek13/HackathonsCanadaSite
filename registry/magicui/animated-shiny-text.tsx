'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type AnimatedShinyTextProps = PropsWithChildren<{
  className?: string;
}>;

export function AnimatedShinyText({ className, children }: AnimatedShinyTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={cn('relative inline-flex overflow-hidden', className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.75) 35%, transparent 70%)',
          mixBlendMode: 'overlay',
        }}
        initial={{ x: '-120%' }}
        animate={reduceMotion ? undefined : { x: '120%' }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      />
    </span>
  );
}

