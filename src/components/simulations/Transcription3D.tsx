// "use client";

// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Sphere, Box, Cylinder, Html } from '@react-three/drei'; // <-- Import Html ici
// import * as THREE from 'three';

// // Couleurs standardisées
// const COLORS: any = {
//   'A': '#ff4d4d', // Rouge
//   'T': '#ffff4d', // Jaune
//   'C': '#4dff4d', // Vert
//   'G': '#4d79ff', // Bleu
//   'U': '#ff00ff', // Violet (Uracile)
// };

// const Nucleotide = ({ type, position }: any) => {
//   return (
//     <group position={position}>
//       {/* Base Azotée */}
//       <Box args={[0.8, 0.8, 0.8]}>
//         <meshStandardMaterial color={COLORS[type]} />
//       </Box>
      
//       {/* Lettre (CORRECTION ICI : On utilise Html au lieu de Text) */}
//       <Html position={[0, 0, 0.5]} center transform pointerEvents="none">
//         <div style={{ 
//             color: 'black', 
//             fontWeight: 'bold', 
//             fontSize: '8px', 
//             userSelect: 'none' 
//         }}>
//             {type}
//         </div>
//       </Html>

//       {/* Squelette Sucre-Phosphate */}
//       <Sphere args={[0.3]} position={[0, -0.6, 0]}>
//          <meshStandardMaterial color="white" />
//       </Sphere>
//     </group>
//   );
// };

// const TranscriptionProcess = ({ data, isPlaying }: { data: any, isPlaying: boolean }) => {
//   const groupRef = useRef<THREE.Group>(null);
//   const [progress, setProgress] = useState(0);

//   // Animation : L'ADN défile vers la gauche pour simuler l'avancée de l'enzyme
//   useFrame((state, delta) => {
//     if (isPlaying && progress < data.templateStrand.length - 5) {
//         setProgress((prev) => prev + delta * 1.5); // Vitesse
//     }
//   });

//   // Position de la "fenêtre" de lecture
//   const offset = -progress * 1.2; // Espace entre les bases

//   return (
//     <group ref={groupRef} position={[offset + 5, 0, 0]}>
      
//       {/* --- 1. BRIN ADN MODÈLE (En bas) --- */}
//       {data.templateStrand.map((base: string, i: number) => (
//         <Nucleotide key={`dna-${i}`} type={base} position={[i * 1.2, -1.5, 0]} />
//       ))}

//       {/* --- 2. BRIN ARNm EN CONSTRUCTION (En haut) --- */}
//       {data.mrnaStrand.map((base: string, i: number) => {
//         // L'ARN n'apparait que si la tête de lecture est passée
//         if (i > progress + 3) return null; // Pas encore créé
        
//         // Animation d'arrivée du nucléotide (il tombe du ciel)
//         let yPos = 0.5;
//         if (i > progress) yPos = 5 - (progress - i + 4) * 2; 
//         if (yPos < 0.5) yPos = 0.5;

//         return (
//            <group key={`rna-${i}`}>
//               <Nucleotide type={base} position={[i * 1.2, yPos, 0]} />
//               {/* Liaison hydrogène temporaire */}
//               {yPos === 0.5 && (
//                   <Cylinder args={[0.05, 0.05, 1]} position={[i * 1.2, -0.5, 0]}>
//                       <meshBasicMaterial color="white" opacity={0.5} transparent />
//                   </Cylinder>
//               )}
//            </group>
//         )
//       })}

//     </group>
//   );
// };

// const Enzyme = () => {
//     // L'ARN Polymérase est fixe au centre de l'écran
//     return (
//         <group position={[2, 0, 0]}>
//             <Sphere args={[3.5, 32, 32]}>
//                 <meshPhysicalMaterial 
//                     color="#a2d9ff" 
//                     transmission={0.6} 
//                     opacity={0.3} 
//                     transparent 
//                     roughness={0}
//                     thickness={2}
//                 />
//             </Sphere>
//             {/* CORRECTION ICI : Html au lieu de Text */}
//             <Html position={[0, 4, 0]} center>
//                 <div style={{ 
//                     color: 'white', 
//                     background: 'rgba(0,0,0,0.5)', 
//                     padding: '4px 8px', 
//                     borderRadius: '4px',
//                     fontSize: '12px',
//                     whiteSpace: 'nowrap'
//                 }}>
//                     ARN Polymérase
//                 </div>
//             </Html>
//         </group>
//     )
// }

// export default function Transcription3D({ data, isPlaying }: { data: any, isPlaying: boolean }) {
//   return (
//     <div className="w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
//       <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
//         <ambientLight intensity={0.8} />
//         <pointLight position={[10, 10, 10]} />
        
//         {/* L'Enzyme (Fixe) */}
//         <Enzyme />

//         {/* Le Processus (Mobile) */}
//         <TranscriptionProcess data={data} isPlaying={isPlaying} />

//         <OrbitControls enableZoom={true} />
//       </Canvas>

//       <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded-lg text-white text-xs">
//          <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ff4d4d]"></div> Adénine (A)</div>
//          <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ff00ff]"></div> Uracile (U) - ARN</div>
//          <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ffff4d]"></div> Thymine (T) - ADN</div>
//          <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#4dff4d]"></div> Cytosine (C)</div>
//          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#4d79ff]"></div> Guanine (G)</div>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

// ... (Code des couleurs et composant Nucleotide et Enzyme inchangés) ...
// Garde les constantes COLORS, le composant Nucleotide et Enzyme comme avant.

const COLORS: any = {
  'A': '#ff4d4d', 'T': '#ffff4d', 'C': '#4dff4d', 'G': '#4d79ff', 'U': '#ff00ff',
};

const Nucleotide = ({ type, position }: any) => {
  return (
    <group position={position}>
      <Box args={[0.8, 0.8, 0.8]}><meshStandardMaterial color={COLORS[type]} /></Box>
      <Html position={[0, 0, 0.5]} center transform pointerEvents="none">
        <div style={{ color: 'black', fontWeight: 'bold', fontSize: '8px', userSelect: 'none' }}>{type}</div>
      </Html>
      <Sphere args={[0.3]} position={[0, -0.6, 0]}><meshStandardMaterial color="white" /></Sphere>
    </group>
  );
};

const Enzyme = () => {
    return (
        <group position={[2, 0, 0]}>
            <Sphere args={[3.5, 32, 32]}>
                <meshPhysicalMaterial color="#a2d9ff" transmission={0.6} opacity={0.3} transparent roughness={0} thickness={2}/>
            </Sphere>
            <Html position={[0, 4, 0]} center>
                <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap'}}>ARN Polymérase</div>
            </Html>
        </group>
    )
}

// --- CORRECTION MAJEURE ICI DANS TRANSCRIPTION PROCESS ---
const TranscriptionProcess = ({ data, isPlaying, onFinish }: { data: any, isPlaying: boolean, onFinish: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (isPlaying) {
        // On laisse aller jusqu'à la fin de la chaîne + une marge (length + 2)
        if (progress < data.templateStrand.length + 2) {
            setProgress((prev) => prev + delta * 1.5); // Un peu plus rapide
        } else {
            // L'animation est finie
            onFinish();
        }
    }
  });

  // Position de la "fenêtre" de lecture
  const offset = -progress * 1.2;

  return (
    <group ref={groupRef} position={[offset + 5, 0, 0]}>
      {/* ADN */}
      {data.templateStrand.map((base: string, i: number) => (
        <Nucleotide key={`dna-${i}`} type={base} position={[i * 1.2, -1.5, 0]} />
      ))}

      {/* ARNm */}
      {data.mrnaStrand.map((base: string, i: number) => {
        if (i > progress + 3) return null;
        
        let yPos = 0.5;
        // Animation de chute plus fluide
        if (i > progress) yPos = 8 - (progress - i + 4) * 2; 
        if (yPos < 0.5) yPos = 0.5;

        return (
           <group key={`rna-${i}`}>
              <Nucleotide type={base} position={[i * 1.2, yPos, 0]} />
              {yPos === 0.5 && (
                  <Cylinder args={[0.05, 0.05, 1]} position={[i * 1.2, -0.5, 0]}>
                      <meshBasicMaterial color="white" opacity={0.5} transparent />
                  </Cylinder>
              )}
           </group>
        )
      })}
    </group>
  );
};

// --- AJOUT DE LA PROPRIÉTÉ onFinish DANS LE COMPOSANT PRINCIPAL ---
export default function Transcription3D({ data, isPlaying, onFinish }: { data: any, isPlaying: boolean, onFinish: () => void }) {
  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
      <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <Enzyme />
        
        {/* On passe onFinish au processus */}
        <TranscriptionProcess data={data} isPlaying={isPlaying} onFinish={onFinish} />

        <OrbitControls enableZoom={true} />
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded-lg text-white text-xs">
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ff4d4d]"></div> Adénine (A)</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ff00ff]"></div> Uracile (U) - ARN</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#ffff4d]"></div> Thymine (T) - ADN</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#4dff4d]"></div> Cytosine (C)</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#4d79ff]"></div> Guanine (G)</div>
      </div>
    </div>
  );
}