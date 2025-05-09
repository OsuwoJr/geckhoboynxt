'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import Image from 'next/image';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const scrollToFeaturedProducts = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      const yOffset = -100; // Offset to account for header height
      const y = featuredSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const navigateToBooking = () => {
    router.push('/booking');
  };

  return (
    <>
      <section 
        ref={heroRef}
        className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black"
        role="banner"
        aria-label="Hero section"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/images/hero-bg.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover opacity-50"
            quality={100}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.1)_0%,transparent_70%)]" />

        {/* Content */}
        <div className="relative z-[2] text-center p-8">
          <h1 className="text-[clamp(3rem,15vw,8rem)] leading-none m-0 flex flex-col items-center gap-2">
            <span className="font-['Brush_Script_MT'] text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] -rotate-[5deg]">
              It&apos;s
            </span>
            <span className="font-['Impact'] font-black text-white uppercase tracking-[0.1em] [text-shadow:_2px_2px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              GECKHOBOY
            </span>
          </h1>

          <div className="flex gap-4 justify-center flex-wrap mt-8 md:flex-row flex-col">
            <Button 
              text="Explore Merch" 
              variant="primary" 
              size="lg" 
              onClick={scrollToFeaturedProducts} 
            />
            <Button 
              text="Book Now" 
              variant="secondary" 
              size="lg" 
              onClick={navigateToBooking} 
            />
          </div>
        </div>

        {/* Noise Overlay */}
        <div 
          className="absolute inset-0 z-[1] opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </section>

      {/* Scroll Target */}
      <div id="content-start" className="h-0 w-full" />
    </>
  );
};

export default Hero; 