'use client';

import { useEffect, useState } from 'react';
import GradientBlinds from './components/GradientBlinds';

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
    <div className="min-h-screen relative overflow-hidden">
      <GradientBlinds
        gradientColors={['#8B1A1A', '#2A2A2A', '#6B1A1A', '#1A1A1A']}
        angle={45}
        noise={0.1}
        blindCount={18}
        blindMinWidth={70}
        mouseDampening={0.15}
        spotlightRadius={0.5}
        spotlightSoftness={1.0}
        spotlightOpacity={0.4}
        mixBlendMode="normal"
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="relative w-full max-w-5xl">
          <div className="md:hidden flex flex-col items-center">
            <div className="relative backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl w-full max-w-md p-8 mb-8">
              <div className="text-left space-y-4 w-full">
                <div className={`space-y-3 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>              
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase" style={{ fontFamily: 'var(--font-zalando)' }}>
                    <span className={`inline-block transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      Hackathons
                    </span>
                    <br />
                    <span className={`inline-block transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      Canada
                    </span>
                  </h1>
                  
                  <p className={`text-base sm:text-lg text-white/80 font-light transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    Powering the Next Generation of Innovation..
                  </p>
                  <p className={`text-sm sm:text-base text-white/70 font-light transition-all duration-700 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    We host everything from exclusive events to massive conferences.
                  </p>
                </div>

                <div className={`flex flex-col gap-3 transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <button className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm sm:text-base hover:bg-white/90 transition-all hover:scale-105 shadow-lg">
                    Apply Now
                  </button>
                  <button className="px-6 py-3 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 w-full max-w-md transition-all duration-700 delay-900 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-left">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedNumber value={50} suffix="+" />
                </div>
                <div className="text-xs text-white/70">Hackathons</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedNumber value={5000} suffix="+" />
                </div>
                <div className="text-xs text-white/70">Participants</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedNumber value={200} suffix="+" />
                </div>
                <div className="text-xs text-white/70">Projects</div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedNumber value={100} suffix="+" />
                </div>
                <div className="text-xs text-white/70">Partners</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative" style={{ aspectRatio: '1118/667', width: '100%', maxWidth: '1118px' }}>
            <div 
              className="absolute inset-0 backdrop-blur-md bg-white/10 border border-white/10"
              style={{
                maskImage: 'url(/blob.svg)',
                WebkitMaskImage: 'url(/blob.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                padding: '5rem'
              }}
            >
              <div className="h-full flex items-center">
                <div className="text-left space-y-4 md:space-y-6 w-full">
                  <div className={`space-y-3 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>              
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase" style={{ fontFamily: 'var(--font-zalando)' }}>
                      <span className={`inline-block transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Hackathons
                      </span>
                      <br />
                      <span className={`inline-block transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Canada
                      </span>
                    </h1>
                    
                    <p className={`text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-light transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      Powering the Next Generation of Innovation..
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg text-white/70 max-w-2xl font-light transition-all duration-700 delay-600 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      We host everything from exclusive events to massive conferences.
                    </p>
                  </div>

                  <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <button className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm sm:text-base hover:bg-white/90 transition-all hover:scale-105 shadow-lg">
                      Apply Now
                    </button>
                    <button className="px-6 py-3 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 z-20" style={{ width: '60%' }}>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 transition-all duration-700 delay-900 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    <AnimatedNumber value={50} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Hackathons</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    <AnimatedNumber value={5000} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Participants</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    <AnimatedNumber value={200} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Projects</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    <AnimatedNumber value={100} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}