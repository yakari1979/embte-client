"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// Composant pour UNE paire de bases (un barreau de l'échelle)
const BasePair = ({ position, rotation, color1, color2, separation, isMutated, onClick }: any) => {
  const width = 1.0; 
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      
      {/* --- BRIN GAUCHE --- */}
      <group position={[-width - separation, 0, 0]}>
        {/* Atome du squelette */}
        <Sphere args={[0.25, 16, 16]}>
           <meshStandardMaterial color="#dddddd" />
        </Sphere>
        {/* Base Azotée Gauche */}
        <Cylinder args={[0.08, 0.08, width, 8]} rotation={[0, 0, -Math.PI / 2]} position={[width/2, 0, 0]} onClick={(e) => {e.stopPropagation(); onClick(color1);}}>
            <meshStandardMaterial color={color1} />
        </Cylinder>
      </group>

      {/* --- BRIN DROIT --- */}
      <group position={[width + separation, 0, 0]}>
        {/* Atome du squelette */}
        <Sphere args={[0.25, 16, 16]}>
            <meshStandardMaterial color="#dddddd" />
        </Sphere>
        {/* Base Azotée Droite */}
        <Cylinder args={[0.08, 0.08, width, 8]} rotation={[0, 0, Math.PI / 2]} position={[-width/2, 0, 0]} onClick={(e) => {e.stopPropagation(); onClick(color2);}}>
            <meshStandardMaterial color={color2} />
        </Cylinder>
      </group>

      {/* Indicateur visuel de mutation (petit anneau clignotant) */}
      {isMutated && (
        <mesh position={[0,0,0]}>
           <torusGeometry args={[0.5, 0.05, 16, 32]} />
           <meshBasicMaterial color="white" />
        </mesh>
      )}

    </group>
  );
};

// L'Hélice complète
const DNAHelix = ({ config, onBaseClick }: { config: any, onBaseClick: (info: string) => void }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Animation de rotation (Vitesse contrôlée par le backend)
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * config.rotationSpeed;
    }
  });

  const pairs = [];
  
  // Couleurs des bases
  const ADENINE = "#ff4d4d"; // Rouge
  const THYMINE = "#ffff4d"; // Jaune
  const GUANINE = "#4d79ff"; // Bleu
  const CYTOSINE = "#4dff4d"; // Vert

  const getBaseName = (color: string) => {
      if(color === ADENINE) return "Adénine (A)";
      if(color === THYMINE) return "Thymine (T)";
      if(color === GUANINE) return "Guanine (G)";
      if(color === CYTOSINE) return "Cytosine (C)";
      return "Inconnu";
  }

  const handleClick = (color: string) => {
      onBaseClick(`Base Azotée : ${getBaseName(color)}`);
  }

  for (let i = 0; i < config.basePairCount; i++) {
    const y = (i - config.basePairCount / 2) * 0.6;
    const rotation = i * 0.5;

    // Logique d'appariement correct : A avec T, G avec C
    let c1, c2;
    if (i % 2 === 0) { c1 = ADENINE; c2 = THYMINE; } 
    else { c1 = GUANINE; c2 = CYTOSINE; }

    // Logique de MUTATION (Si le backend dit que l'index i est muté)
    let isMutatedPair = false;
    if (config.hasMutation && i === config.mutationIndex) {
        c2 = GUANINE; // ERREUR ! A ne va pas avec G (Rouge avec Bleu)
        isMutatedPair = true;
    }

    pairs.push(
      <BasePair 
        key={i} 
        position={[0, y, 0]} 
        rotation={rotation} 
        color1={c1} 
        color2={c2}
        separation={config.separation}
        isMutated={isMutatedPair}
        onClick={handleClick}
      />
    );
  }

  return (
    <group ref={groupRef}>
      {pairs}
    </group>
  );
};

export default function DNA3D({ config }: { config: any }) {
  const [info, setInfo] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-inner">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <DNAHelix config={config} onBaseClick={setInfo} />
        
        <OrbitControls enableZoom={true} />
      </Canvas>

      {/* UI Info Bulle */}
      {info && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg border border-gray-600 backdrop-blur-md animate-pulse">
              {info}
          </div>
      )}
       <div className="absolute bottom-4 left-4 text-white/50 text-xs">
          Rouge=A, Jaune=T, Bleu=G, Vert=C
      </div>
    </div>
  );
}