'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

type AnimationStyle = 'none' | 'fade';

type AsciiArtProps = {
  text: string;
  color?: string;
  animationStyle?: AnimationStyle;
  animationDuration?: number;
  animateOnView?: boolean;
  glitchCharsPerFrame?: number;
  glitchFrameMs?: number;
  className?: string;
};

const GLITCH_CHARS = '@%#*+=-:.';

export function AsciiArt({
  text,
  color = 'currentColor',
  animationStyle = 'fade',
  animationDuration = 1.5,
  animateOnView = false,
  glitchCharsPerFrame = 8,
  glitchFrameMs = 90,
  className,
}: AsciiArtProps) {
  const [displayText, setDisplayText] = useState(text);

  const motionProps = useMemo(() => {
    if (animationStyle !== 'fade') {
      return {};
    }

    const transition = { duration: animationDuration };
    if (animateOnView) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.3 },
        transition,
      };
    }

    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition,
    };
  }, [animateOnView, animationDuration, animationStyle]);

  useEffect(() => {
    setDisplayText(text);
    const baseChars = text.split('');
    const mutableIndexes: number[] = [];
    for (let i = 0; i < baseChars.length; i += 1) {
      if (baseChars[i] !== ' ' && baseChars[i] !== '\n') {
        mutableIndexes.push(i);
      }
    }

    if (mutableIndexes.length === 0) return;

    const interval = window.setInterval(() => {
      const nextChars = [...baseChars];
      const swaps = Math.min(glitchCharsPerFrame, mutableIndexes.length);

      for (let i = 0; i < swaps; i += 1) {
        const randomIndex = mutableIndexes[Math.floor(Math.random() * mutableIndexes.length)];
        nextChars[randomIndex] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }

      setDisplayText(nextChars.join(''));
    }, glitchFrameMs);

    return () => window.clearInterval(interval);
  }, [text, glitchCharsPerFrame, glitchFrameMs]);

  return (
    <motion.div
      {...motionProps}
      className={cn('relative overflow-visible', className)}
    >
      <pre
        className="overflow-visible whitespace-pre text-[8px] leading-[1.05] tracking-[0.05em] sm:text-[9px] md:text-[10px]"
        style={{ color, fontFamily: 'var(--font-space-mono)' }}
      >
        {displayText}
      </pre>
    </motion.div>
  );
}
