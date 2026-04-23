'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

type AnimationStyle = 'none' | 'fade';

type AsciiArtProps = {
  text?: string;
  src?: string;
  resolution?: number;
  color?: string;
  animationStyle?: AnimationStyle;
  animationDuration?: number;
  animateOnView?: boolean;
  glitchCharsPerFrame?: number;
  glitchFrameMs?: number;
  className?: string;
};

type AsciiArtFromImageProps = {
  src: string;
  resolution?: number;
  color?: string;
  animationStyle?: AnimationStyle;
  animationDuration?: number;
  animateOnView?: boolean;
  className?: string;
};

const GLITCH_CHARS = '@%#*+=-:.';
const IMAGE_ASCII_CHARS = ' .:-=+*#%@';

export function AsciiArt({
  text,
  src,
  resolution = 80,
  color = 'currentColor',
  animationStyle = 'fade',
  animationDuration = 1.5,
  animateOnView = false,
  glitchCharsPerFrame = 8,
  glitchFrameMs = 90,
  className,
}: AsciiArtProps) {
  const [sourceText, setSourceText] = useState(text ?? '');
  const preRef = useRef<HTMLPreElement | null>(null);

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
    let isCancelled = false;

    const renderTextFromImage = async () => {
      if (!src) {
        setSourceText(text ?? '');
        return;
      }

      try {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';

        const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = src;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSourceText(text ?? '');
          return;
        }

        const width = Math.max(16, Math.floor(resolution));
        const height = Math.max(8, Math.floor((loaded.height / loaded.width) * width * 0.55));
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(loaded, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height).data;
        const density = ' .:-=+*#%@';
        const rows: string[] = [];

        for (let y = 0; y < height; y += 1) {
          let row = '';
          for (let x = 0; x < width; x += 1) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3] / 255;
            const brightness = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * a;
            const charIndex = Math.round(brightness * (density.length - 1));
            row += density[charIndex];
          }
          rows.push(row);
        }

        if (!isCancelled) {
          setSourceText(rows.join('\n'));
        }
      } catch {
        if (!isCancelled) {
          setSourceText(text ?? '');
        }
      }
    };

    void renderTextFromImage();

    return () => {
      isCancelled = true;
    };
  }, [resolution, src, text]);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = sourceText;
    }

    const baseChars = sourceText.split('');
    const mutableIndexes: number[] = [];
    for (let i = 0; i < baseChars.length; i += 1) {
      if (baseChars[i] !== ' ' && baseChars[i] !== '\n') {
        mutableIndexes.push(i);
      }
    }

    if (mutableIndexes.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      const nextChars = [...baseChars];
      const swaps = Math.min(glitchCharsPerFrame, mutableIndexes.length);

      for (let i = 0; i < swaps; i += 1) {
        const randomIndex = mutableIndexes[Math.floor(Math.random() * mutableIndexes.length)];
        nextChars[randomIndex] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }

      if (preRef.current) {
        preRef.current.textContent = nextChars.join('');
      }
    }, glitchFrameMs);

    return () => window.clearInterval(interval);
  }, [sourceText, glitchCharsPerFrame, glitchFrameMs]);

  return (
    <motion.div
      {...motionProps}
      className={cn('relative overflow-visible', className)}
    >
      <pre
        ref={preRef}
        className="overflow-visible whitespace-pre text-[8px] leading-[1.05] tracking-[0.05em] sm:text-[9px] md:text-[10px]"
        style={{ color, fontFamily: 'var(--font-space-mono)' }}
      >
        {sourceText}
      </pre>
    </motion.div>
  );
}

export function AsciiArtFromImage({
  src,
  resolution = 100,
  color = 'currentColor',
  animationStyle = 'fade',
  animationDuration = 1.5,
  animateOnView = false,
  className,
}: AsciiArtFromImageProps) {
  const [ascii, setAscii] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

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
    mounted.current = true;
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      if (!mounted.current) return;
      const targetWidth = Math.max(24, Math.floor(resolution));
      const ratio = image.height / image.width || 1;
      const targetHeight = Math.max(24, Math.floor(targetWidth * ratio * 0.55));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Unable to render ASCII art.');
        return;
      }

      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      const pixels = ctx.getImageData(0, 0, targetWidth, targetHeight).data;

      const lines: string[] = [];
      for (let y = 0; y < targetHeight; y += 1) {
        let row = '';
        for (let x = 0; x < targetWidth; x += 1) {
          const i = (y * targetWidth + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3] / 255;
          const luminance = ((0.299 * r + 0.587 * g + 0.114 * b) * a) / 255;
          const idx = Math.max(
            0,
            Math.min(IMAGE_ASCII_CHARS.length - 1, Math.floor((1 - luminance) * (IMAGE_ASCII_CHARS.length - 1)))
          );
          row += IMAGE_ASCII_CHARS[idx];
        }
        lines.push(row);
      }

      setAscii(lines.join('\n'));
      setError(null);
    };

    image.onerror = () => {
      if (!mounted.current) return;
      setError('Could not load image for ASCII conversion.');
      setAscii('');
    };

    image.src = src.trim();

    return () => {
      mounted.current = false;
    };
  }, [resolution, src]);

  return (
    <motion.div {...motionProps} className={cn('relative overflow-visible', className)}>
      <pre
        className="overflow-visible whitespace-pre text-[8px] leading-[1.05] tracking-[0.05em] sm:text-[9px] md:text-[10px]"
        style={{ color, fontFamily: 'var(--font-space-mono)' }}
      >
        {error ?? ascii}
      </pre>
    </motion.div>
  );
}
