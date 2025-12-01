"use client";

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Cylinder, Html, Cone, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface MendelPeaProps {
    color: string;
    shape: string;
    flower: string;
    position: any;
    onClick: () => void;
    isSelected: boolean;
    showFlower: boolean; // Pour n'afficher la fleur que si le trait est pertinent (Trihybridisme)
}

// --- SOUS-COMPOSANT : FLEUR DE POIS ---
const PeaFlower = ({ color }: { color: string }) => {
    const petalColor = color === 'PURPLE' ? '#a855f7' : '#f3f4f6';
    return (
        <group position={[0.5, 0.8, 0]} rotation={[0, 0, -0.5]} scale={0.4}>
            {/* Tige fleur */}
            <Cylinder args={[0.05, 0.05, 1]} position={[0, -0.5, 0]} material-color="#15803d" />
            
            {/* Pétales (Forme papilionacée simplifiée) */}
            <group position={[0, 0, 0]}>
                {/* Étendard (Grand pétale) */}
                <Sphere args={[0.8, 16, 16]} position={[0, 0.5, -0.2]} scale={[1, 1, 0.2]}>
                    <meshStandardMaterial color={petalColor} />
                </Sphere>
                {/* Ailes (Côtés) */}
                <Sphere args={[0.5, 16, 16]} position={[-0.4, 0.2, 0.2]} rotation={[0, 0.5, 0]} scale={[1, 0.5, 0.2]}>
                    <meshStandardMaterial color={petalColor} />
                </Sphere>
                <Sphere args={[0.5, 16, 16]} position={[0.4, 0.2, 0.2]} rotation={[0, -0.5, 0]} scale={[1, 0.5, 0.2]}>
                    <meshStandardMaterial color={petalColor} />
                </Sphere>
                {/* Carène (Centre) */}
                <Cone args={[0.3, 0.8, 16]} position={[0, 0, 0.3]} rotation={[0, 0, Math.PI]}>
                    <meshStandardMaterial color={color === 'PURPLE' ? '#7e22ce' : '#e5e7eb'} />
                </Cone>
            </group>
        </group>
    );
};

export const MendelPea = ({ color, shape, flower, position, onClick, isSelected, showFlower }: MendelPeaProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
     if(meshRef.current) {
         // Rotation douce au survol
         if (hovered || isSelected) {
             meshRef.current.rotation.y += 0.02;
             meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
         } else {
             // Retour position repos
             meshRef.current.rotation.y *= 0.95;
             meshRef.current.rotation.x *= 0.95;
         }
     }
  });

  // Couleurs riches
  const peaColor = color === 'YELLOW' ? '#facc15' : '#4ade80'; // Jaune Or vs Vert Herbe
  
  // Paramètres de forme
  const isWrinkled = shape === 'WRINKLED';
  const distort = isWrinkled ? 0.6 : 0;
  const speed = isWrinkled ? 0 : 0; // Fixe la distortion pour qu'elle ne bouge pas (plus réaliste)
  
  // Labels
  const labelColor = color === 'YELLOW' ? 'Jaune (Dom)' : 'Vert (Réc)';
  const labelShape = shape === 'ROUND' ? 'Lisse (Dom)' : 'Ridé (Réc)';

  return (
    <group position={position}>
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[0, 0.1]}>
          <group 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            scale={isSelected ? 1.2 : 1}
          >
              {/* LA GRAINE */}
              <Sphere ref={meshRef} args={[0.6, 64, 64]}>
                <MeshDistortMaterial 
                    color={peaColor} 
                    distort={distort} 
                    speed={speed} 
                    roughness={isWrinkled ? 0.8 : 0.2} // Lisse = brillant, Ridé = mat
                    metalness={0.1}
                    emissive={isSelected ? "#ffffff" : "#000000"} 
                    emissiveIntensity={isSelected ? 0.3 : 0}
                />
              </Sphere>

              {/* FLEUR (Si activée) */}
              {showFlower && <PeaFlower color={flower} />}
          </group>
      </Float>

      {/* Ombre portée au sol */}
      <ContactShadows opacity={0.4} scale={5} blur={1.5} far={1.2} />

      {/* BULLE D'INFO */}
      {isSelected && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-2xl p-3 rounded-xl border border-green-500/50 min-w-[140px] text-center animate-in zoom-in duration-200">
                <div className="font-bold text-gray-900 dark:text-white text-sm mb-1 border-b border-gray-200 pb-1">Phénotype</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-x-2 gap-y-1 text-left">
                    <span className="font-semibold">Couleur:</span> <span>{labelColor}</span>
                    <span className="font-semibold">Forme:</span> <span>{labelShape}</span>
                    {showFlower && <><span className="font-semibold">Fleur:</span> <span>{flower === 'PURPLE' ? 'Violette' : 'Blanche'}</span></>}
                </div>
                
                {/* Petite flèche */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-800"></div>
            </div>
        </Html>
      )}

    </group>
  );
};