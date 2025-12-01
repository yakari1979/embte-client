"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, OrbitControls, Html, Trail, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Couleurs (Code standard)
const C_ADENINE = "#ef4444";  // Rouge
const C_THYMINE = "#eab308";  // Jaune
const C_GUANINE = "#3b82f6";  // Bleu
const C_CYTOSINE = "#22c55e"; // Vert
const C_BACKBONE = "#cbd5e1"; // Gris clair (Sucre-Phosphate)

// --- PAIRE DE BASES (Un barreau de l'échelle) ---
const BasePair = ({ index, rotation, separation, isMutated, onClick }: any) => {
    // Logique d'appariement : A-T ou G-C
    // On alterne pour la variété visuelle
    let colorLeft = (index % 2 === 0) ? C_ADENINE : C_GUANINE;
    let colorRight = (index % 2 === 0) ? C_THYMINE : C_CYTOSINE;
    
    // Si mutation : Erreur d'appariement (ex: A avec G)
    if (isMutated) {
        colorRight = (index % 2 === 0) ? C_GUANINE : C_ADENINE; // Incompatible !
    }

    const yPos = (index - 10) * 0.6; // Centré verticalement

    return (
        <group position={[0, yPos, 0]} rotation={[0, rotation, 0]}>
            
            {/* --- BRIN GAUCHE --- */}
            <group position={[-1.2 - separation, 0, 0]}>
                {/* Squelette (Sucre-Phosphate) */}
                <mesh onClick={(e) => { e.stopPropagation(); onClick("Squelette Sucre-Phosphate"); }}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={C_BACKBONE} roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Base Azotée */}
                <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} onClick={(e) => { e.stopPropagation(); onClick(colorLeft); }}>
                    <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
                    <meshStandardMaterial color={colorLeft} emissive={isMutated ? "#ff0000" : "#000000"} emissiveIntensity={isMutated ? 0.5 : 0} />
                </mesh>
            </group>

            {/* --- BRIN DROIT --- */}
            <group position={[1.2 + separation, 0, 0]}>
                {/* Squelette */}
                <mesh onClick={(e) => { e.stopPropagation(); onClick("Squelette Sucre-Phosphate"); }}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={C_BACKBONE} roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Base Azotée */}
                <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} onClick={(e) => { e.stopPropagation(); onClick(colorRight); }}>
                    <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
                    <meshStandardMaterial color={colorRight} emissive={isMutated ? "#ff0000" : "#000000"} emissiveIntensity={isMutated ? 0.5 : 0} />
                </mesh>
            </group>

            {/* --- LIAISONS HYDROGÈNE (Au centre) --- */}
            {/* Disparaissent si séparation (chaleur) ou mutation grave */}
            {separation < 0.5 && !isMutated && (
                <group>
                    <mesh position={[-0.2, 0, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                        <meshBasicMaterial color="white" opacity={0.5} transparent />
                    </mesh>
                    <mesh position={[0.2, 0, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                        <meshBasicMaterial color="white" opacity={0.5} transparent />
                    </mesh>
                </group>
            )}

            {/* ALERTE MUTATION */}
            {isMutated && (
                <Html position={[2.5, 0, 0]}>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse shadow-lg whitespace-nowrap">
                        ERREUR D'APPARIEMENT !
                    </div>
                </Html>
            )}

        </group>
    );
};

// --- HÉLICE COMPLÈTE ---
const DNAHelix = ({ config, onBaseClick }: any) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotation continue
            groupRef.current.rotation.y += delta * config.rotationSpeed;
            
            // Si séparation (chaleur), vibration thermique
            if (config.separation > 0.5) {
                groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 20) * 0.05;
            } else {
                groupRef.current.position.x = 0;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ligne reliant les phosphates (Visuel uniquement, pas physique) */}
            {/* C'est complexe à faire parfaitement en React, on s'appuie sur l'alignement des sphères */}
            
            {Array.from({ length: config.basePairCount }).map((_, i) => (
                <BasePair 
                    key={i} 
                    index={i} 
                    rotation={i * 0.5} 
                    separation={config.separation}
                    isMutated={config.hasMutation && i === config.mutationIndex}
                    onClick={onBaseClick}
                />
            ))}
        </group>
    );
};

export default function DNA3D({ config }: { config: any }) {
    const [info, setInfo] = useState<string | null>(null);

    const handleBaseClick = (colorOrName: string) => {
        let name = colorOrName;
        if(colorOrName === C_ADENINE) name = "Adénine (A)";
        if(colorOrName === C_THYMINE) name = "Thymine (T)";
        if(colorOrName === C_GUANINE) name = "Guanine (G)";
        if(colorOrName === C_CYTOSINE) name = "Cytosine (C)";
        setInfo(name);
        setTimeout(() => setInfo(null), 3000); // Disparait après 3s
    };

    return (
        <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800">
            <Canvas camera={{ position: [0, 0, 18], fov: 40 }}>
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
                
                <Stars radius={50} count={500} factor={4} fade speed={1} />

                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                    <DNAHelix config={config} onBaseClick={handleBaseClick} />
                </Float>

                <OrbitControls enableZoom={true} minDistance={10} maxDistance={30} />
            </Canvas>

            {/* UI: Info Bulle au clic */}
            {info && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="bg-white/90 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-in zoom-in duration-200 border-2 border-white">
                        {info}
                    </div>
                </div>
            )}

            {/* Légende Permanente */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 flex-wrap pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]"></div>
                    <span className="text-xs text-gray-300 font-bold">Adénine</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#eab308] shadow-[0_0_10px_#eab308]"></div>
                    <span className="text-xs text-gray-300 font-bold">Thymine</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]"></div>
                    <span className="text-xs text-gray-300 font-bold">Guanine</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-gray-700 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs text-gray-300 font-bold">Cytosine</span>
                </div>
            </div>
        </div>
    );
}