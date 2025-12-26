'use client';

import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene: string; // L'URL est obligatoire
  className?: string;
}

export default function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Overlay pour fondre la 3D dans le noir */}
      <div className="absolute inset-0 bg-gradient-to-r from-nexus-black via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Scène 3D */}
      <Spline scene={scene} />
    </div>
  );
}