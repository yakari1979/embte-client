"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, OrbitControls, Html, MeshDistortMaterial, Float, Stars, Torus } from '@react-three/drei';
import * as THREE from 'three';

// --- ORGANITES SPÉCIALISÉS ---

const Nucleus = ({ color, onClick }: any) => (
    <group onClick={(e) => { e.stopPropagation(); onClick("NOYAU", "Contient l'information génétique (ADN). C'est le centre de commande."); }}>
        {/* Enveloppe nucléaire */}
        <Sphere args={[1.4, 32, 32]}>
            <meshStandardMaterial color={color} roughness={0.5} />
        </Sphere>
        {/* Nucléole */}
        <Sphere args={[0.5]} position={[0.5, 0.5, 0.5]}>
            <meshStandardMaterial color="#4c1d95" />
        </Sphere>
        {/* Pores nucléaires */}
        {Array.from({ length: 6 }).map((_, i) => (
            <Torus key={i} args={[0.1, 0.05, 16, 32]} position={[Math.sin(i)*1.4, Math.cos(i)*1.4, 0]} lookAt={[0,0,0] as any}>
                <meshStandardMaterial color="#1e1b4b" />
            </Torus>
        ))}
    </group>
);

const Mitochondria = ({ position, onClick }: any) => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position} onClick={(e) => { e.stopPropagation(); onClick("MITOCHONDRIE", "Centrale énergétique. Lieu de la respiration cellulaire (Production d'ATP)."); }}>
                <mesh scale={[1, 0.5, 0.5]}>
                    <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
                    <meshStandardMaterial color="#f97316" roughness={0.3} />
                </mesh>
                {/* Crêtes */}
                <mesh position={[0, 0.05, 0]} scale={[0.9, 0.4, 0.4]}>
                     <capsuleGeometry args={[0.31, 0.7, 4, 8]} />
                     <meshBasicMaterial color="#fdba74" wireframe />
                </mesh>
            </group>
        </Float>
    );
};

const Chloroplast = ({ position, onClick }: any) => (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick("CHLOROPLASTE", "Site de la photosynthèse. Convertit l'énergie lumineuse en sucre."); }}>
            <mesh scale={[1, 0.6, 0.4]}>
                <capsuleGeometry args={[0.4, 1, 4, 16]} />
                <meshStandardMaterial color="#15803d" />
            </mesh>
            
            {/* Thylakoïdes (Empilement de disques verts) - Correction ici avec mesh standard */}
            <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshStandardMaterial color="#4ade80" />
            </mesh>
        </group>
    </Float>
);

const Vacuole = ({ onClick }: any) => (
    <group position={[2, 2, -1]} onClick={(e) => { e.stopPropagation(); onClick("VACUOLE", "Grand sac rempli d'eau. Maintient la pression de turgescence chez les plantes."); }}>
        <Sphere args={[2, 32, 32]}>
            <meshPhysicalMaterial 
                color="#a5f3fc" 
                transmission={0.9} 
                roughness={0} 
                thickness={1} 
                transparent 
                opacity={0.6}
            />
        </Sphere>
    </group>
);

// --- CYTOSQUELETTE ET MEMBRANE ---

const CellMembrane = ({ color, type, children, onClick }: any) => {
    const isPlant = type === 'PLANT';

    return (
        <group onClick={() => onClick(isPlant ? "PAROI + MEMBRANE" : "MEMBRANE CYTOPLASMIQUE", isPlant ? "La paroi cellulosique rigide double la membrane." : "Frontière souple et sélective.")}>
            {isPlant ? (
                // CELLULE VÉGÉTALE
                <group>
                    <mesh>
                        <boxGeometry args={[9, 9, 9]} />
                        <meshStandardMaterial color="#166534" wireframe />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[8.8, 8.8, 8.8]} />
                        <meshPhysicalMaterial color={color} transmission={0.4} opacity={0.3} transparent side={THREE.DoubleSide} />
                    </mesh>
                </group>
            ) : (
                // CELLULE ANIMALE
                <Sphere args={[5, 64, 64]}>
                    <MeshDistortMaterial 
                        color={color} 
                        distort={0.3} 
                        speed={1.5} 
                        roughness={0.2}
                        transmission={0.5}
                        thickness={2}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </Sphere>
            )}
            {children}
        </group>
    );
};

// --- COMPOSANT PRINCIPAL ---

export default function Cell3D({ config }: { config: any }) {
    const [info, setInfo] = useState<{title: string, desc: string} | null>(null);

    const mitochondria = useMemo(() => Array.from({ length: config.mitochondriaCount }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / config.mitochondriaCount);
        const theta = Math.sqrt(config.mitochondriaCount * Math.PI) * phi;
        const r = 3 + Math.random();
        return [r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)];
    }), [config.mitochondriaCount]);

    const setLabel = (title: string, desc: string) => setInfo({title, desc});

    return (
        <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800">
            <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color={config.cellType === 'PLANT' ? '#22c55e' : '#3b82f6'} />
                
                <Stars radius={50} count={500} factor={4} fade speed={1} />

                <CellMembrane color={config.membraneColor} type={config.cellType} onClick={setLabel}>
                    <Nucleus color={config.nucleusColor} onClick={setLabel} />
                    
                    {mitochondria.map((pos, i) => (
                        <Mitochondria key={i} position={pos} onClick={setLabel} />
                    ))}

                    {config.chloroplasts && (
                        <>
                            <Vacuole onClick={setLabel} />
                            {[...Array(6)].map((_, i) => (
                                <Chloroplast key={i} position={[3, (i-3)*1.5, 3]} onClick={setLabel} />
                            ))}
                        </>
                    )}
                </CellMembrane>

                <OrbitControls minDistance={8} maxDistance={20} />
            </Canvas>

            {/* UI: Info Bulle */}
            {info && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                                {info.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{info.desc}</p>
                        </div>
                        <button onClick={() => setInfo(null)} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                </div>
            )}

            {!info && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-xs backdrop-blur pointer-events-none border border-white/10">
                    👆 Cliquez sur un organite pour l'identifier
                </div>
            )}
        </div>
    );
}