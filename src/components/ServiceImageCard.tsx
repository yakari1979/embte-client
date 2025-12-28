'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceImageCardProps {
  src: string;
  alt: string;
}

export default function ServiceImageCard({ src, alt }: ServiceImageCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!imgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(imgRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.95, // Départ légèrement plus petit pour l'effet d'apparition
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imgRef.current,
          start: 'top 85%', // Déclenche un peu plus tôt
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="
        w-full 
        h-[360px]
        object-cover
        rounded-3xl
        
        /* BORDURE & OMBRE (Style Nexus Orange) */
        border-2
        border-nexus-orange/50
        shadow-[0_0_20px_rgba(255,107,0,0.15)]
        
        /* ANIMATION */
        transition-all
        duration-500
        cursor-pointer
        
        /* AU SURVOL */
        hover:scale-[1.02] 
        hover:border-nexus-orange
        hover:shadow-[0_0_35px_rgba(255,107,0,0.4)]
      "
    />
  );
}