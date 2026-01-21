'use client';

import { useEffect, useState } from 'react';
import GradientBlinds from './components/GradientBlinds';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';

const AnimatedNumber = ({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#ffe4e4] overflow-hidden">
      <GradientBlinds
        gradientColors={['#ff919e', '#5227FF']}
        angle={20}
        noise={0.5}
        blindCount={16}
        blindMinWidth={60}
        mouseDampening={0.15}
        spotlightRadius={0.5}
        mixBlendMode="multiply"
        distortAmount={20}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full max-w-6xl ml-2 sm:ml-4 lg:ml-8">
          <div className="md:hidden flex flex-col items-center gap-6">
            <div className="relative backdrop-blur-md bg-black/5 border border-black/10 rounded-2xl w-full max-w-md p-6">
              <div className="text-left space-y-4 w-full">
                <div className={`space-y-3 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>              
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black uppercase" style={{ fontFamily: 'var(--font-zalando)' }}>
                    <span className={`inline-block transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      Hackathons
                    </span>
                    <br />
                    <span className={`inline-block transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      Canada
                    </span>
                  </h1>
                  
                  <p className={`text-sm sm:text-base text-black/80 font-light transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    Powering the Next Generation of Innovation..
                  </p>
                  <p className={`text-xs sm:text-sm text-black/70 font-light transition-all duration-700 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    We host everything from exclusive events to massive conferences.
                  </p>
                </div>

                <div className={`flex flex-col gap-3 transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <button className="px-5 py-2.5 bg-black text-white rounded-full font-semibold text-sm hover:bg-black/90 transition-all hover:scale-105 shadow-lg">
                    Apply Now
                  </button>
                  <button className="px-5 py-2.5 bg-transparent border-2 border-black/30 text-black rounded-full font-semibold text-sm hover:bg-black/10 hover:border-black/50 transition-all backdrop-blur-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 w-full max-w-md transition-all duration-700 delay-900 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-left">
                <div className="text-2xl font-bold text-black mb-1">
                  <AnimatedNumber value={50} suffix="+" />
                </div>
                <div className="text-xs text-black/70">Hackathons</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-black mb-1">
                  <AnimatedNumber value={5000} suffix="+" />
                </div>
                <div className="text-xs text-black/70">Participants</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-black mb-1">
                  <AnimatedNumber value={200} suffix="+" />
                </div>
                <div className="text-xs text-black/70">Projects</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-black mb-1">
                  <AnimatedNumber value={100} suffix="+" />
                </div>
                <div className="text-xs text-black/70">Partners</div>
              </div>
            </div>

            <div className={`w-full max-w-md transition-all duration-700 delay-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Carousel className="w-full" style={{ height: '300px' }}>
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <CarouselItem key={num}>
                      <div className="p-1">
                        <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '280px' }}>
                          <Image
                            src={`/pic${num}.JPG`}
                            alt={`Image ${num}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            <div className="relative flex-shrink-0" style={{ aspectRatio: '1118/667', width: '100%', maxWidth: '750px' }}>
              <div 
                className="absolute inset-0 backdrop-blur-md bg-black/5 border border-black/10"
                style={{
                  maskImage: 'url(/blob.svg)',
                  WebkitMaskImage: 'url(/blob.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  padding: '3rem 4rem 4.5rem 4rem'
                }}
              >
                <div className="h-full flex flex-col justify-center">
                  <div className="text-left space-y-4 md:space-y-5 w-full">
                    <div className={`space-y-3 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>              
                      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black uppercase" style={{ fontFamily: 'var(--font-zalando)' }}>
                        <span className={`inline-block transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          Hackathons
                        </span>
                        <br />
                        <span className={`inline-block transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          Canada
                        </span>
                      </h1>
                      
                      <p className={`text-sm sm:text-base md:text-lg text-black/80 max-w-xl font-light transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Powering the Next Generation of Innovation..
                      </p>
                      <p className={`text-xs sm:text-sm md:text-base text-black/70 max-w-xl font-light transition-all duration-700 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        We host everything from exclusive events to massive conferences.
                      </p>
                    </div>

                    <div className={`flex flex-col sm:flex-row gap-3 mb-6 md:mb-8 transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <button className="px-5 py-2.5 bg-black text-white rounded-full font-semibold text-sm hover:bg-black/90 transition-all hover:scale-105 shadow-lg">
                        Apply Now
                      </button>
                      <button className="px-5 py-2.5 bg-transparent border-2 border-black/30 text-black rounded-full font-semibold text-sm hover:bg-black/10 hover:border-black/50 transition-all backdrop-blur-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 z-20" style={{ width: '60%', paddingBottom: '0.75rem' }}>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-3 transition-all duration-700 delay-900 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-black mb-1">
                      <AnimatedNumber value={50} suffix="+" />
                    </div>
                    <div className="text-xs text-black/70">Hackathons</div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-black mb-1">
                      <AnimatedNumber value={5000} suffix="+" />
                    </div>
                    <div className="text-xs text-black/70">Participants</div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-black mb-1">
                      <AnimatedNumber value={200} suffix="+" />
                    </div>
                    <div className="text-xs text-black/70">Projects</div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-black mb-1">
                      <AnimatedNumber value={100} suffix="+" />
                    </div>
                    <div className="text-xs text-black/70">Partners</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full max-w-md lg:max-w-lg">
              <Carousel className="w-full" style={{ height: '450px' }}>
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <CarouselItem key={num}>
                      <div className="p-1">
                        <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '430px' }}>
                          <Image
                            src={`/pic${num}.JPG`}
                            alt={`Image ${num}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}