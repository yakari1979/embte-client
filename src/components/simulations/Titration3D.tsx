"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Cylinder, Box, Html, OrbitControls, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// --- LIQUIDE DU BÉCHER ---
const BeakerLiquid = ({ color, volume, maxVolume }: any) => {
    const height = 1.5 + (volume / maxVolume) * 1.5; 

    return (
        <group position={[0, -2 + height / 2, 0]}>
            <mesh>
                <cylinderGeometry args={[1.4, 1.4, height, 32]} />
                <meshPhysicalMaterial 
                    color={color} 
                    transmission={0.9} 
                    opacity={0.8} 
                    transparent 
                    roughness={0.1}
                    thickness={2}
                />
            </mesh>
        </group>
    );
};

// --- VUE MICROSCOPIQUE (Ions) ---
const MoleculeSystem = ({ species, color }: any) => {
    const molecules = useMemo(() => {
        const mols = [];
        const countH = species.h3o === 'MAX' ? 30 : species.h3o === 'HIGH' ? 20 : species.h3o === 'NEUTRAL' ? 5 : 2;
        for(let i=0; i<countH; i++) mols.push({ type: 'H3O', pos: [Math.random()*2-1, Math.random()*2-1, Math.random()*2-1] });
        
        const countOH = species.oh === 'HIGH' ? 20 : species.oh === 'NEUTRAL' ? 5 : 2;
        for(let i=0; i<countOH; i++) mols.push({ type: 'OH', pos: [Math.random()*2-1, Math.random()*2-1, Math.random()*2-1] });

        for(let i=0; i<15; i++) mols.push({ type: 'H2O', pos: [Math.random()*2-1, Math.random()*2-1, Math.random()*2-1] });

        return mols;
    }, [species]);

    return (
        <group position={[3, 0, 0]} scale={0.8}>
            <mesh position={[0,0,0]}>
                <sphereGeometry args={[2.2, 32, 32]} />
                <meshBasicMaterial color="white" wireframe transparent opacity={0.1} />
            </mesh>
            <Html position={[0, 2.5, 0]} center><div className="bg-black/60 text-white text-xs px-2 py-1 rounded border border-white/20">Vue Microscopique</div></Html>

            {molecules.map((mol, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
                    <group position={mol.pos as any}>
                        {mol.type === 'H3O' && (
                            <mesh>
                                <sphereGeometry args={[0.15]} />
                                <meshStandardMaterial color="#ef4444" />
                            </mesh>
                        )}
                        {mol.type === 'OH' && (
                            <mesh>
                                <sphereGeometry args={[0.15]} />
                                <meshStandardMaterial color="#3b82f6" />
                            </mesh>
                        )}
                        {mol.type === 'H2O' && (
                            <mesh>
                                <sphereGeometry args={[0.1]} />
                                <meshStandardMaterial color="#94a3b8" transparent opacity={0.5} />
                            </mesh>
                        )}
                    </group>
                </Float>
            ))}
        </group>
    );
}

export default function Titration3D({ config, volumeAdded }: any) {
    const color = config?.color || "#eab308";
    const volume = parseFloat(config?.solutionVolume || "20");
    const species = config?.species || { h3o: 'MAX', oh: 'NONE' };

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-5, 0, 5]} intensity={0.5} color="white" />

                {/* --- MONTAGE EXPÉRIMENTAL --- */}
                <group position={[-1.5, -1, 0]}>
                    {/* Bécher (Verre) */}
                    <mesh position={[0, -0.5, 0]}>
                        <cylinderGeometry args={[1.5, 1.5, 3.2, 32, 1, true]} />
                        <meshPhysicalMaterial 
                            color="white" 
                            transmission={0.95} 
                            opacity={0.3} 
                            transparent 
                            roughness={0.1} 
                            thickness={0.5}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    {/* Fond Bécher */}
                    <mesh position={[0, -2.1, 0]}>
                        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
                        <meshPhysicalMaterial color="white" transmission={0.9} opacity={0.5} />
                    </mesh>

                    {/* Liquide coloré */}
                    <BeakerLiquid color={color} volume={volume} maxVolume={50} />

                    {/* Burette (Haut) - CORRECTION ICI */}
                    <group position={[0, 4, 0]}>
                        {/* Corps de la burette */}
                        <Cylinder args={[0.3, 0.3, 5, 16]}>
                            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.5} />
                        </Cylinder>
                        
                        {/* Liquide Base (Bleu) à l'intérieur */}
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[0.25, 0.25, 4.8]} />
                            <meshStandardMaterial color="#3b82f6" opacity={0.8} transparent />
                        </mesh>
                        
                        <Html position={[0.5, 0, 0]}><div className="text-xs text-blue-300 font-bold bg-black/50 px-1 rounded">Base (OH⁻)</div></Html>
                    </group>

                    {/* Goutte (Si on verse) */}
                    {volumeAdded > 0 && (
                        <Float speed={5} floatIntensity={2} rotationIntensity={0}>
                            <Sphere args={[0.1]} position={[0, 1.2, 0]}>
                                <meshStandardMaterial color="#3b82f6" />
                            </Sphere>
                        </Float>
                    )}
                </group>

                {/* --- ZOOM MOLÉCULAIRE --- */}
                <MoleculeSystem species={species} color={color} />

                {/* pH Mètre (Sonde) */}
                <group position={[-1, 1, 0]} rotation={[0,0,-0.2]}>
                    <Cylinder args={[0.1, 0.1, 4]} material-color="#333" />
                </group>

                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
}