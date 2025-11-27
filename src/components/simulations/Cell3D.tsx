"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Capsule, Box } from '@react-three/drei';
import * as THREE from 'three';

// 1. Organite : NOYAU
const Nucleus = ({ color, onClick }: any) => {
  return (
    <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onClick("Noyau : Contient l'ADN"); }}>
      <meshStandardMaterial color={color} roughness={0.3} />
    </Sphere>
  );
};

// 2. Organite : MITOCHONDRIE (Forme de capsule)
const Mitochondria = ({ position, onClick }: any) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => { if(mesh.current) mesh.current.rotation.x += 0.01; }); // Petite animation
  
  return (
    <Capsule ref={mesh} args={[0.3, 1, 4, 8]} position={position} onClick={(e) => { e.stopPropagation(); onClick("Mitochondrie : Centrale énergétique"); }}>
      <meshStandardMaterial color="#ffa500" />
    </Capsule>
  );
};

// 3. Organite : CHLOROPLASTE (Pour les plantes)
const Chloroplast = ({ position, onClick }: any) => {
  return (
    <Sphere args={[0.4, 16, 16]} position={position} onClick={(e) => { e.stopPropagation(); onClick("Chloroplaste : Siège de la photosynthèse"); }}>
      <meshStandardMaterial color="#006400" />
    </Sphere>
  );
};

// 4. La CELLULE (Container)
const CellModel = ({ config, onPartClick }: { config: any, onPartClick: (name: string) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotation lente de toute la cellule
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  // Génération aléatoire des positions pour les mitochondries
  const mitochondria = Array.from({ length: config.mitochondriaCount }).map((_, i) => {
    // Calcul de position sphérique aléatoire (autour du noyau)
    const phi = Math.acos(-1 + (2 * i) / config.mitochondriaCount);
    const theta = Math.sqrt(config.mitochondriaCount * Math.PI) * phi;
    const r = 3.5; // Rayon
    return (
      <Mitochondria 
        key={`mito-${i}`} 
        position={[r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)]}
        onClick={onPartClick}
      />
    );
  });

  return (
    <group ref={groupRef}>
      {/* --- MEMBRANE (Sphère Transparente) --- */}
      <Sphere args={[5, 64, 64]} onClick={() => onPartClick("Membrane Cytoplasmique : Protège la cellule")}>
        <meshPhysicalMaterial 
          color={config.membraneColor} 
          transmission={0.6} // Transparence type verre/eau
          opacity={0.5}
          transparent
          thickness={1}
          roughness={0}
          side={THREE.DoubleSide} // Visible de l'intérieur et l'extérieur
        />
      </Sphere>

      {/* --- PAROI (Si Végétale - Cube filaire autour) --- */}
      {config.hasCellWall && (
         <Box args={[11, 11, 11]} onClick={(e) => {e.stopPropagation(); onPartClick("Paroi Cellulosique : Rigidité végétale");}}>
            <meshStandardMaterial color="#2e8b57" wireframe />
         </Box>
      )}

      {/* --- ORGANITES --- */}
      <Nucleus color={config.nucleusColor} onClick={onPartClick} />
      {mitochondria}
      
      {/* Chloroplastes si activés */}
      {config.chloroplasts && Array.from({length: 8}).map((_, i) => (
          <Chloroplast key={`chloro-${i}`} position={[2, (i-4), 2]} onClick={onPartClick} />
      ))}
    </group>
  );
};

export default function Cell3D({ config }: { config: any }) {
  const [label, setLabel] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-inner">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <CellModel config={config} onPartClick={setLabel} />
        
        <OrbitControls enableZoom={true} minDistance={6} maxDistance={20} />
      </Canvas>

      {/* Étiquette Flottante (UI) */}
      {label && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-6 py-3 rounded-full shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in font-bold border border-blue-200">
           🧬 {label}
        </div>
      )}
      
      <div className="absolute top-4 right-4 text-white/50 text-xs">
          Clic gauche: Tourner • Molette: Zoomer • Clic sur organite: Info
      </div>
    </div>
  );
}