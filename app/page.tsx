'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AsciiArt } from '@/components/ui/ascii-art';
import { SmoothCursor } from '@/registry/magicui/smooth-cursor';

const BUTTERFLY_ASCII = `
                                             %%%*                                                   
                                           .%:-  %*                                                 
                                           %% %=-@%%                                                
                                          :%%+.*   %%        *%#:%                                  
                                          =%:- =%   =%:     +.%% %%                                 
                                          =%%##%%%   %%    **%%% :%                                 
                                          =%::%+:%*   #*  %%%%=# :%                                 
                                          % *%%   #    %.%-.%%%. :%                                 
                                         #% *%     +   -%= +  =  :%                                 
                                        :#=  %     *   .%%#   .  *.                                 
                                       *%%. %%:         #%       %   +*                             
                                     %%:+ =    :         %      +*   *                              
                                   #%%% %@#              %      #   #                               
                                  *%%%.*.   .            =+  : .:  =                                
                                  %%%%%+       -      :  =#    % :       %:                         
                                  *%:%%%         :  - +. ==:. % *      #-                           
                            =%%%%%%%%%+*%=    #   + = *  * : % #     *                              
                           % %%%+   %%%-%%%%-   # :* **= %:.%.    #                                 
                           % *%%         -%*#%%.  - =%**#%.**  #                                    
                           =%- %%=            %+%% +=%%%%%# +                                       
                        %%@:%-      .+      .*%%%%=+%%%%%%                                          
                      =%**%%%:                %%:% %%%-                                             
                      =%%%%= %            .  : #%%*                                                 
                       +%% =% :%%%%=        %* %                                                    
                         :%% *#%=       .%#                                                         
                            #%+*=    +@%.                                                           
                            %=:%% *%%=                                                              
                             .%%%%:                                                                 
`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Home() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const cards = [
    { src: '/pic1.JPG', rotate: -9, top: '6%', left: '56%' },
    { src: '/pic2.JPG', rotate: 8, top: '14%', left: '72%' },
    { src: '/pic3.JPG', rotate: -19, top: '40%', left: '59%' },
    { src: '/pic4.JPG', rotate: 15, top: '48%', left: '76%' },
    { src: '/pic5.JPG', rotate: -3, top: '30%', left: '85%' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f2ef] text-[#171717]">
      <SmoothCursor />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 12%, rgba(217, 214, 209, 0.65), transparent 46%), radial-gradient(circle at 82% 24%, rgba(200, 195, 188, 0.45), transparent 41%), radial-gradient(circle at 48% 80%, rgba(215, 210, 202, 0.35), transparent 55%)',
        }}
      />

      <motion.pre
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute left-4 top-8 hidden whitespace-pre-wrap text-[10px] leading-4 tracking-[0.4em] text-black/45 md:block"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        {`░░░   /\\_/\\    ░░░
<>  {  o o }  <>
____(   ^   )____
\\\\\\\\      ////
░░░░░░░░░░░░░░░░`}
      </motion.pre>

      <motion.pre
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.22, x: 0 }}
        transition={{ duration: 1.2, delay: 0.25 }}
        className="pointer-events-none absolute bottom-6 right-4 hidden whitespace-pre-wrap text-[10px] leading-4 tracking-[0.35em] text-black/45 lg:block"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        {`//\\\\//\\\\//\\\\
<>   []   <>
__--__--__--__
\\\\//\\\\//\\\\//`}
      </motion.pre>

      <main className="relative z-10 px-6 pb-28 pt-16 sm:px-10 md:px-16 lg:px-24 lg:pt-20">
        <section ref={heroRef} className="relative mx-auto grid min-h-168 max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <motion.p
              {...fadeUp}
              className="text-xs uppercase tracking-[0.55em] text-black/55"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              hackathons canada
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              className="mt-10 max-w-5xl text-3xl leading-[1.05] tracking-tight sm:text-5xl md:mt-16 md:text-6xl lg:text-[6rem]"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              build strange.
              <br />
              launch loud.
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="mt-10 max-w-md text-sm uppercase tracking-[0.42em] text-black/55 sm:mt-14"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              one network. many wild builds.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:mt-14 md:mt-16"
            >
              <Link href="/database">
                <motion.span
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex rounded-full border border-black bg-black px-7 py-3 text-xs uppercase tracking-[0.3em] text-white"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  view hackathons
                </motion.span>
              </Link>
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-black/40 bg-transparent px-7 py-3 text-xs uppercase tracking-[0.3em] text-black"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                contact
              </motion.button>
            </motion.div>
          </div>

          <div className="hidden lg:block" />
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
            className="pointer-events-none absolute inset-0 hidden lg:block"
          >
            {cards.map((card, idx) => {
              const isActive = activeCard === idx;

              return (
                <motion.button
                  key={card.src}
                  type="button"
                  drag
                  dragMomentum
                  dragConstraints={heroRef}
                  dragElastic={0.2}
                  dragTransition={{ power: 0.24, timeConstant: 240, bounceStiffness: 280, bounceDamping: 14 }}
                  initial={{ opacity: 0, y: 18, rotate: card.rotate }}
                  whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: 0.15 + idx * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  animate={{
                    scale: isActive ? 1.09 : 1,
                    zIndex: isActive ? 30 : idx + 1,
                  }}
                  onClick={() => setActiveCard((prev) => (prev === idx ? null : idx))}
                  className="pointer-events-auto absolute aspect-4/5 w-[clamp(9.5rem,14vw,13rem)] overflow-hidden rounded-2xl border border-black/15 bg-white/85 shadow-[0_18px_35px_-20px_rgba(0,0,0,0.7)]"
                  style={{
                    top: card.top,
                    left: card.left,
                    rotate: `${card.rotate}deg`,
                  }}
                >
                  <Image
                    src={card.src}
                    alt={`Hackathon card ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 70vw, 24vw"
                    className="object-cover"
                    draggable={false}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        <section className="mx-auto mt-28 grid max-w-7xl gap-20 lg:mt-40 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="relative min-h-80 lg:pt-10">
            <motion.div
              {...fadeUp}
              className="pointer-events-none absolute -left-40 top-0 w-216 scale-125 lg:-left-56 lg:top-2 lg:scale-[1.4]"
            >
              <AsciiArt
                text={BUTTERFLY_ASCII}
                color="rgba(0, 0, 0, 0.6)"
                animationStyle="fade"
                animationDuration={1.5}
                animateOnView={false}
                glitchCharsPerFrame={100}
                glitchFrameMs={90}
                className="w-full"
              />
            </motion.div>
          </div>

          <div>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mb-12 max-w-md text-xs uppercase tracking-[0.32em] text-black/55"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              We run hackathons and tech events that connects your company with top builders. Spark real ideas, surface raw talent, and ship what actually matters.
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.28 }}
              className="grid grid-cols-2 gap-x-10 gap-y-10 sm:gap-x-14 md:max-w-md"
            >
              {[
                ['50+', 'events'],
                ['5k+', 'builders'],
                ['200+', 'projects'],
                ['100+', 'partners'],
              ].map(([value, label]) => (
                <motion.div key={label} whileHover={{ y: -4 }}>
                  <p
                    className="text-4xl leading-none tracking-tight sm:text-5xl"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-2 text-[11px] uppercase tracking-[0.28em] text-black/60"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}