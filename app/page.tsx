'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { AsciiArt } from '@/components/ui/ascii-art';

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

const MAPLE_LEAF_ASCII = `
                                             .                                              
                                            =%#                                             
                                           :% %=                                            
                                          .%-  %-                                           
                                         .%-   -%.                                          
                                     *=. #*     :%..-+                                      
                                     #++%*       +%+-%                                      
                                     #=              %                                      
                                     #-              %                                      
                              -%*:   %-              %   .+%#                               
                              .%.+%#=%.              %.*%*.#=                               
                               %-   =%               #+.   %                                
                              %%-                         :%%.                              
                              :%                           #*                               
    %%*=                       #+                         +%                       :*%#     
     %+:*%#+  :%*.              %-                       .%-              *%:  =#%#:.%.     
     .%.   .=%%*.#%:   %+       =%                       %+       +%=  :#%:+%%+:   .%-      
      -%.          *%*%--%#      %#                     =%      +%=:%=%*.          %*       
       *%            -*   :%+    .%-                    %.    -%-   -=            **        
        **                  %%    -%                   #+    *%                  =%         
       *%%.                  =%.   **                 .%   .%*                  :%%#.       
       *%:                     *%#=%                   #**%#                      %*        
         %%                                                                     =%:         
          *%:                                                                  %*           
        .%%%.                                                                  #%%:         
       =%%.                                                                     .%%+        
          *%#.                                                                *%*           
            .#%*.                                                          -%#.             
               .*%#:                                                   :*%#.                
                   .*#%:                                           .#%*:                    
                    :*%*                                           +%#:                     
               :-%%*=                                                 -*%%=:                
        -+#%%*+=                                                           =+*%%%+-:        
        .*%*:                                                                 .+%*:         
           .+%#=.                        :%%# =%%=                        .=*%*.            
               .=*%%*=-.                ##  % .% ##.               .-=+%%*=.                
                      .-=+*%%%%*    :+%#:   %  %  .+%*:    =%%%%#+=-:                       
                               %%%*=-.      %  %      --*%%%.                               
                                            #- *=                                           
                                            +* =#                                           
                                            =# =#                                           
                                            =# :%                                           
                                            -# .%.                                          
                                            .%. %.                                          
                                             %##%.                                          
`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

const MAGNETIC_WORDS = ['breaking', 'things'];
const MAGNETIC_REPEL_RADIUS = 240;
const MAGNETIC_REPEL_STRENGTH = 2100;
const MAGNETIC_FRICTION = 0.84;
const MAGNETIC_SPRING = 0.025;
const MAGNETIC_LETTER_COUNT = MAGNETIC_WORDS.join('').length;

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.54 5.32a16.59 16.59 0 0 0-4.12-1.3.06.06 0 0 0-.06.03c-.18.33-.38.76-.52 1.1a15.42 15.42 0 0 0-5.67 0 11.42 11.42 0 0 0-.53-1.1.06.06 0 0 0-.06-.03 16.55 16.55 0 0 0-4.13 1.3.05.05 0 0 0-.02.02C1.8 9.17 1.1 12.92 1.43 16.63a.07.07 0 0 0 .03.05 16.75 16.75 0 0 0 5.07 2.56.06.06 0 0 0 .07-.02c.39-.53.75-1.1 1.06-1.69a.06.06 0 0 0-.03-.08 10.9 10.9 0 0 1-1.58-.75.06.06 0 0 1-.01-.1c.1-.08.2-.16.29-.24a.06.06 0 0 1 .06-.01c3.3 1.5 6.87 1.5 10.13 0a.06.06 0 0 1 .07 0c.09.08.19.16.29.24a.06.06 0 0 1-.01.1c-.5.29-1.03.54-1.58.75a.06.06 0 0 0-.03.08c.32.59.67 1.16 1.06 1.69a.06.06 0 0 0 .07.02 16.69 16.69 0 0 0 5.07-2.56.06.06 0 0 0 .03-.05c.39-4.28-.66-8-2.99-11.29a.04.04 0 0 0-.02-.02ZM8.68 14.38c-.99 0-1.8-.91-1.8-2.02 0-1.11.79-2.01 1.8-2.01 1 0 1.82.9 1.8 2.01 0 1.11-.8 2.02-1.8 2.02Zm6.64 0c-.99 0-1.8-.91-1.8-2.02 0-1.11.79-2.01 1.8-2.01 1 0 1.82.9 1.8 2.01 0 1.11-.8 2.02-1.8 2.02Z" />
    </svg>
  );
}

const sponsors = [
  { name: 'Microsoft', src: '/sponsors/microsoft.png' },
  { name: 'Google', src: '/sponsors/google.svg' },
  { name: 'GitHub', src: '/sponsors/github.png' },
  { name: 'Perplexity', src: '/sponsors/perplexity.png' },
  { name: 'Cloudinary', src: '/sponsors/cloudinary.png' },
  { name: 'Tailscale', src: '/sponsors/tailscale.png' },
  { name: 'Warp', src: '/sponsors/warp.png' },
  { name: 'Stan', src: '/sponsors/stan.png' },
  { name: 'Backboard', src: '/sponsors/backboard.svg' },
  { name: 'Reactiv', src: '/sponsors/reactiv.png' },
];

const pastEvents = [
  {
    name: 'Hack Canada 2025',
    logo: '/events/hc25.png',
    photos: [
      '/events/hc25_event.JPG',
      '/events/hc25_event2.jpg',
      '/events/hc25_event3.JPG',
      '/events/hc25_event4.JPG',
    ],
    city: 'Waterloo, ON',
    highlight: 'Our flagship launch year.',
    url: 'https://2025.hackcanada.org/',
  },
  {
    name: 'Hack Canada 2026',
    logo: '/events/hc26.png',
    photos: [
      '/events/hc26_event.jpg',
      '/events/hc26_event2.jpg',
      '/events/hc26_event3.jpg',
      '/events/hc26_event4.jpg',
      '/events/hc26_event5.JPG',
    ],
    city: 'Waterloo, ON',
    highlight: 'Got even bigger.',
    url: 'https://hackcanada.org/',
  },
  {
    name: 'Stan HackAI',
    logo: '/events/stan.png',
    photos: [
      '/events/stan_event.jpg',
      '/events/stan_event2.JPG',
      '/events/stan_event3.jpg',
      '/events/stan_event4.jpg',
      '/events/stan_event5.jpg',
    ],
    city: 'Toronto, ON',
    highlight: 'A focused builder showcase.',
    url: 'https://hackai.ca/',
  },
];

export default function Home() {
  const [eventPhotoIndexes, setEventPhotoIndexes] = useState<number[]>(() =>
    pastEvents.map(() => 0),
  );
  const conclusionMagnetRef = useRef<HTMLSpanElement | null>(null);
  const magneticLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const magneticStateRef = useRef(
    Array.from({ length: MAGNETIC_LETTER_COUNT }, () => ({ x: 0, y: 0, vx: 0, vy: 0 })),
  );
  const magneticMouseRef = useRef({ x: -9999, y: -9999 });
  const magneticRafRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEventPhotoIndexes((prev) =>
        prev.map((idx, eventIdx) => {
          const photoCount = pastEvents[eventIdx].photos.length;
          return (idx + 1) % photoCount;
        }),
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loop = () => {
      const wrap = conclusionMagnetRef.current;
      if (!wrap) {
        magneticRafRef.current = requestAnimationFrame(loop);
        return;
      }
      const wrapRect = wrap.getBoundingClientRect();
      const { x: mx, y: my } = magneticMouseRef.current;

      magneticStateRef.current.forEach((s, i) => {
        const el = magneticLetterRefs.current[i];
        if (!el) return;

        const r = el.getBoundingClientRect();
        const ox = r.left - wrapRect.left + r.width / 2;
        const oy = r.top - wrapRect.top + r.height / 2;

        const dx = ox + s.x - mx;
        const dy = oy + s.y - my;
        const dist = Math.hypot(dx, dy);

        if (dist < MAGNETIC_REPEL_RADIUS && dist > 0) {
          const force = (MAGNETIC_REPEL_RADIUS - dist) / MAGNETIC_REPEL_RADIUS;
          s.vx += (dx / dist) * force * force * MAGNETIC_REPEL_STRENGTH * 0.016;
          s.vy += (dy / dist) * force * force * MAGNETIC_REPEL_STRENGTH * 0.016;
        }

        s.vx += -s.x * MAGNETIC_SPRING;
        s.vy += -s.y * MAGNETIC_SPRING;
        s.vx *= MAGNETIC_FRICTION;
        s.vy *= MAGNETIC_FRICTION;
        s.x += s.vx;
        s.y += s.vy;

        el.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px)`;
      });

      magneticRafRef.current = requestAnimationFrame(loop);
    };

    magneticRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(magneticRafRef.current);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-hna-neutral text-hna-blue">
      <main className="relative z-10 px-6 pb-28 pt-6 sm:px-10 md:px-16 lg:px-24 lg:pt-8">
        <section className="relative lg:-mr-24 lg:min-h-[min(75vh,720px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-16 h-72 w-72 rounded-full bg-hna-red/12 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,36rem)_1fr] lg:gap-8 xl:grid-cols-[minmax(0,40rem)_1fr]">
            <div className="relative z-10 w-full max-w-2xl text-left lg:max-w-none">
              <motion.h1
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.12 }}
                className="max-w-2xl text-3xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:max-w-xl lg:text-[5.5rem] xl:max-w-2xl xl:text-[6rem]"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                build strange.
                <br />
                launch <span className="text-hna-red">loud.</span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="mt-10 max-w-xl text-sm uppercase leading-relaxed text-hna-blue/60 sm:mt-14 lg:max-w-md"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                A home for hackathons.
                
                We organize flagship events, connect builders
                with sponsors, and keep a live database of every hackathon worth showing up to.
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
                    className="inline-flex rounded-full border border-hna-red bg-hna-red px-7 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-hna-red/90"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    view hackathons
                  </motion.span>
                </Link>
                <Link href="mailto:hackathonscanada@gmail.com">
                  <motion.span
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex rounded-full border border-hna-red/40 bg-transparent px-7 py-3 text-xs uppercase tracking-[0.3em] text-hna-red transition hover:border-hna-red hover:bg-hna-red/5"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    contact
                  </motion.span>
                </Link>
              </motion.div>
            </div>

            <div className="hidden min-h-[min(52vw,680px)] lg:block" aria-hidden="true" />
          </div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
            className="relative hidden aspect-square w-full lg:absolute lg:right-0 lg:top-1/2 lg:block lg:aspect-square lg:w-[min(52vw,680px)] lg:max-w-[680px] lg:-translate-y-1/2"
          >
            <Image
              src="/hero-scene.png"
              alt="Inukshuk landscape illustration"
              fill
              sizes="(max-width: 1024px) 85vw, 52vw"
              className="object-contain object-right"
              priority
            />
          </motion.div>
        </section>

        <section className="mx-auto mt-40 grid max-w-7xl items-center gap-16 lg:mt-56 lg:grid-cols-2 lg:gap-20">
          <motion.div
            {...fadeUp}
            className="pointer-events-none flex items-center justify-center overflow-hidden lg:justify-end"
          >
            <AsciiArt
              text={BUTTERFLY_ASCII}
              color="rgba(29, 42, 68, 0.6)"
              animationStyle="fade"
              animationDuration={1.5}
              animateOnView={false}
              glitchCharsPerFrame={100}
              glitchFrameMs={90}
              className="w-full max-w-md scale-110 lg:max-w-lg lg:scale-125"
            />
          </motion.div>

          <div>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mb-12 max-w-md text-xs uppercase tracking-[0.32em] text-hna-blue/55"
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
                    className="text-4xl leading-none tracking-tight text-hna-red sm:text-5xl"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-2 text-[11px] uppercase tracking-[0.28em] text-hna-blue/60"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="relative mx-auto mt-40 w-full max-w-7xl lg:mt-56">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 -bottom-20 -top-6 -z-10 blur-3xl"
            style={{
              backgroundImage:
                'radial-gradient(50% 38% at 16% 72%, rgba(29, 42, 68, 0.32), transparent 72%), radial-gradient(44% 34% at 84% 66%, rgba(114, 28, 36, 0.28), transparent 74%), radial-gradient(56% 42% at 50% 94%, rgba(45, 74, 34, 0.2), transparent 78%)',
            }}
          />
          <motion.section
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2.3rem] border border-hna-blue/10 bg-hna-blue p-8 text-white shadow-[0_34px_72px_-42px_rgba(29,42,68,0.9)] sm:p-10 lg:p-14"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-24"
              style={{
                opacity: 0.62,
                backgroundImage:
                  'radial-gradient(circle at 18% 22%, rgba(179, 84, 30, 0.34), rgba(29, 42, 68, 0.2) 28%, rgba(29, 42, 68, 0) 62%), radial-gradient(circle at 82% 18%, rgba(114, 28, 36, 0.22), rgba(29, 42, 68, 0) 55%), radial-gradient(circle at 52% 84%, rgba(45, 74, 34, 0.2), rgba(29, 42, 68, 0) 58%)',
              }}
            />
            <div
              className="pointer-events-none absolute -inset-12 -z-10 opacity-65 blur-3xl"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 18%, rgba(29, 42, 68, 0.24), transparent 42%), radial-gradient(circle at 82% 15%, rgba(114, 28, 36, 0.22), transparent 36%), radial-gradient(circle at 50% 92%, rgba(45, 74, 34, 0.2), transparent 44%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-75"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 18%, rgba(29, 42, 68, 0.24), transparent 42%), radial-gradient(circle at 82% 15%, rgba(114, 28, 36, 0.22), transparent 36%), radial-gradient(circle at 50% 92%, rgba(45, 74, 34, 0.2), transparent 44%)',
              }}
            />
            <div className="relative z-10">
              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="text-[11px] uppercase tracking-[0.36em] text-hna-red-light"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                sponsors
              </motion.p>
              <motion.h2
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.22 }}
                className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                backed by teams shaping what builders use next.
              </motion.h2>
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.3 }}
                className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
              >
                {sponsors.map((sponsor, idx) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: 0.07 * idx }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="flex h-16 items-center bg-white rounded-xl justify-center px-4"
                  >
                    <Image
                      src={sponsor.src}
                      alt={`${sponsor.name} logo`}
                      width={100}
                      height={100}
                      className="h-8 w-auto object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        </div>

        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="relative mx-auto mt-40 max-w-7xl lg:mt-56"
        >
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-hna-blue/10 pb-6">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.36em] text-hna-red"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                past events
              </p>
              <h2
                className="mt-3 text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                moments that shaped us.
              </h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {pastEvents.map((event, idx) => (
              <Link
                key={event.name}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-hna-blue/10 bg-white shadow-[0_18px_48px_-28px_rgba(29,42,68,0.4)] transition duration-300 hover:-translate-y-1.5 hover:border-hna-red/30 hover:shadow-[0_32px_64px_-24px_rgba(114,28,36,0.22)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-hna-blue">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${event.name}-${eventPhotoIndexes[idx]}`}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.985 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={event.photos[eventPhotoIndexes[idx]]}
                          alt={`${event.name} event photo`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-t from-hna-blue/80 via-hna-blue/25 to-hna-blue/5" />
                    <span
                      className="absolute left-4 top-4 rounded-full border border-hna-blue/20 bg-hna-blue/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-hna-blue/70 backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      past
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                      <Image
                        src={event.logo}
                        alt={`${event.name} logo`}
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-xl border border-white/25 bg-white/90 object-contain p-1 shadow-md"
                      />
                      <h3
                        className="text-xl leading-tight tracking-tight text-white sm:text-2xl"
                        style={{ fontFamily: 'var(--font-newsreader)' }}
                      >
                        {event.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-sm text-hna-blue/75">
                      <MapPin className="h-4 w-4 shrink-0 text-hna-red/70" />
                      <span>{event.city}</span>
                    </div>
                    <p
                      className="mt-3 text-[11px] uppercase tracking-[0.24em] text-hna-red"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      {event.highlight}
                    </p>

                    <div className="mt-5 flex items-center justify-end border-t border-hna-blue/8 pt-5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full bg-hna-blue px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition group-hover:bg-hna-red"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        visit
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>


        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="relative mx-auto mt-40 max-w-7xl pt-18 lg:mt-56"
        >
          <h2
            className="mt-5 max-w-5xl text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[5.2rem]"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            start{' '}
            <span
              ref={conclusionMagnetRef}
              onMouseMove={(e) => {
                const rect = conclusionMagnetRef.current?.getBoundingClientRect();
                if (!rect) return;
                magneticMouseRef.current = {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                };
              }}
              onMouseLeave={() => {
                magneticMouseRef.current = { x: -9999, y: -9999 };
              }}
              className="inline-flex gap-[0.22em] align-baseline"
            >
              {(() => {
                let letterIndex = 0;
                return MAGNETIC_WORDS.map((word, wordIdx) => (
                  <span key={word} className="inline-flex">
                    {word.split('').map((letter) => {
                      const idx = letterIndex++;
                      return (
                        <span
                          key={`${word}-${idx}`}
                          ref={(el) => {
                            magneticLetterRefs.current[idx] = el;
                          }}
                          className="inline-block will-change-transform"
                        >
                          {letter}
                        </span>
                      );
                    })}
                    {wordIdx < MAGNETIC_WORDS.length - 1 ? <span>&nbsp;</span> : null}
                  </span>
                ));
              })()}
            </span>
            <br />
            with the right builders.
          </h2>
          <div className="mt-12">
            <Link href="mailto:hackathonscanada@gmail.com">
              <motion.span
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex rounded-full border border-hna-red/40 bg-transparent px-7 py-3 text-xs uppercase tracking-[0.3em] text-hna-red transition hover:border-hna-red hover:bg-hna-red/5"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                contact
              </motion.span>
            </Link>
          </div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="pointer-events-none mt-12 block w-full max-w-[320px] mx-auto opacity-25 mix-blend-multiply lg:absolute lg:left-[72%] lg:-top-32 lg:-z-10 lg:mt-0 lg:w-180 lg:-translate-x-[20%] lg:scale-110 lg:opacity-35 lg:block"
          >
            <AsciiArt
              text={MAPLE_LEAF_ASCII}
              color="rgba(114, 28, 36, 0.5)"
              animationStyle="fade"
              animationDuration={1.2}
              animateOnView={false}
              glitchCharsPerFrame={95}
              glitchFrameMs={90}
              className="w-full"
            />
          </motion.div>
        </motion.section>

        <footer className="mx-auto mt-32 max-w-7xl pt-6 lg:mt-40">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="https://discord.com/invite/wp42amwcWy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join us on Discord"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
            >
              <DiscordIcon className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/hackathonsna/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="https://www.instagram.com/hackathoncanada/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
            >
              <Instagram className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="mailto:hackathonscanada@gmail.com"
              aria-label="Email Hackathons North America"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
            >
              <Mail className="h-4.5 w-4.5" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/favicon.ico" alt="HNA logo" width={28} height={32} className="h-8 w-auto" />
            <p
              className="text-sm uppercase tracking-[0.28em] text-hna-blue/70 sm:text-base"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              HNA
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}