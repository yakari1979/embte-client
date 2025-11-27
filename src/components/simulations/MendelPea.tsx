"use client";

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Cylinder, Html } from '@react-three/drei'; // Ajout de Html
import * as THREE from 'three';

interface MendelPeaProps {
    color: string;
    shape: string;
    flower: string;
    position: any;
    onClick: () => void; // Fonction quand on clique
    isSelected: boolean; // Est-ce que ce pois est sélectionné ?
}

export const MendelPea = ({ color, shape, flower, position, onClick, isSelected }: MendelPeaProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false); // Pour l'effet de survol

  // Petite rotation aléatoire + Animation si survolé
  useFrame((state) => {
     if(meshRef.current) {
         meshRef.current.rotation.y += 0.005;
         if (hovered || isSelected) {
             meshRef.current.rotation.y += 0.02; // Tourne plus vite si actif
         }
     }
  });

  // Couleurs et Textes pour l'affichage
  const peaColor = color === 'YELLOW' ? '#FCD34D' : '#4ADE80';
  const flowerColor = flower === 'PURPLE' ? '#A855F7' : '#FFFFFF';
  const distortion = shape === 'ROUND' ? 0 : 0.6;

  const labelColor = color === 'YELLOW' ? 'Jaune' : 'Vert';
  const labelShape = shape === 'ROUND' ? 'Lisse' : 'Ridé';

  return (
    <group position={position}>
      
      {/* LA GRAINE (LE POIS) */}
      <Sphere 
        ref={meshRef} 
        args={[0.6, 32, 32]}
        onClick={(e) => { e.stopPropagation(); onClick(); }} // On déclenche le clic
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial 
            color={peaColor} 
            distort={distortion} 
            speed={2} 
            roughness={0.4}
            emissive={isSelected ? "#ffffff" : "#000000"} // Brille un peu si sélectionné
            emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </Sphere>

      {/* TIGE */}
      <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#166534" />
      </Cylinder>

      {/* FLEUR (Optionnel) */}
      <group position={[0, 1.3, 0]}>
          <Sphere args={[0.25, 8, 8]}>
              <meshStandardMaterial color={flowerColor} />
          </Sphere>
          {[0, 1, 2, 3].map(i => (
              <Cylinder key={i} args={[0.02, 0.1, 0.6]} position={[0,0,0]} rotation={[0, 0, (i * Math.PI)/2 + 0.5]}>
                  <meshStandardMaterial color={flowerColor} />
              </Cylinder>
          ))}
      </group>

      {/* BULLE D'INFO (S'affiche si isSelected est TRUE) */}
      {isSelected && (
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-green-500 min-w-[120px] text-center animate-in zoom-in duration-200">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{labelColor}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">{labelShape}</p>
                {flower && <p className="text-[10px] text-purple-500 mt-1">Fleur {flower === 'PURPLE' ? 'Violette' : 'Blanche'}</p>}
                
                {/* Petite flèche vers le bas */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-500"></div>
            </div>
        </Html>
      )}

    </group>
  );
};