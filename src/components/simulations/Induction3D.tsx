"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
// AJOUT DE 'Sphere' et 'Line' DANS LES IMPORTS
import { Cylinder, Box, Html, OrbitControls, Float, Tube, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// --- BOBINE (SOLÉNOÏDE) ---
const Coil = ({ currentDirection }: { currentDirection: number }) => {
    // Création d'une spirale de cuivre
    const curve = useMemo(() => {
        const points = [];
        for (let i = 0; i < 100; i++) {
            const angle = 0.5 * i;
            const x = Math.cos(angle) * 1.5;
            const y = (i - 50) * 0.08; // Longueur
            const z = Math.sin(angle) * 1.5;
            points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    return (
        <group rotation={[0, 0, Math.PI / 2]}> {/* Couchée */}
            {/* Le fil de cuivre */}
            <Tube args={[curve, 64, 0.08, 8, false]}>
                <meshStandardMaterial 
                    color="#b45309" // Cuivre
                    metalness={0.8} 
                    roughness={0.2} 
                    emissive="#f59e0b" // Légère lueur si courant
                    emissiveIntensity={currentDirection !== 0 ? 0.5 : 0}
                />
            </Tube>
            
            {/* Support transparent */}
            <Cylinder args={[1.4, 1.4, 8.5, 32]} rotation={[Math.PI/2, 0, 0]}>
                <meshPhysicalMaterial color="white" transmission={0.9} opacity={0.3} transparent />
            </Cylinder>

            {/* LED Témoin (S'allume si courant) */}
            <group position={[0, 5, 0]}>
                <Box args={[1, 1, 1]} position={[0, -0.5, 0]} material-color="#333" />
                <Sphere args={[0.4]} position={[0, 0.2, 0]}>
                    <meshStandardMaterial 
                        color={currentDirection !== 0 ? "#ef4444" : "#444"} 
                        emissive={currentDirection !== 0 ? "#ef4444" : "#000"} 
                        emissiveIntensity={2}
                    />
                </Sphere>
                {/* Fils de connexion (Utilisation du Line de Drei) */}
                <Line points={[[0, -1, 0], [2, -1, 2]]} color="#fbbf24" lineWidth={2} /> 
                <Line points={[[0, -1, 0], [-2, -1, 2]]} color="#fbbf24" lineWidth={2} /> 
            </group>
        </group>
    );
};

// --- AIMANT ---
const Magnet = ({ position }: { position: number }) => {
    return (
        <group position={[position, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            {/* Pôle Nord (Rouge) */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            <Html position={[0, 1.5, 0.6]} center><div className="text-white font-bold font-mono">N</div></Html>
            
            {/* Pôle Sud (Bleu) */}
            <mesh position={[0, -1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <Html position={[0, -1.5, 0.6]} center><div className="text-white font-bold font-mono">S</div></Html>

            {/* Champ Magnétique */}
            <group>
                {[...Array(8)].map((_, i) => (
                    <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
                        <mesh position={[1.2, 0, 0]} rotation={[0, 0, 0]}>
                            <torusGeometry args={[1.5, 0.02, 8, 32, Math.PI]} />
                            <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
};

// --- VOLTMÈTRE ---
const Galvanometer = ({ voltage }: { voltage: number }) => {
    const angle = THREE.MathUtils.clamp(voltage, -5, 5) * (Math.PI / 4) / 5;

    return (
        <group position={[0, 3, -3]} rotation={[0.2, 0, 0]}>
            <Box args={[4, 3, 1]} material-color="#1f2937" />
            <mesh position={[0, 0, 0.51]}>
                <planeGeometry args={[3.5, 2.5]} />
                <meshBasicMaterial color="#f3f4f6" />
            </mesh>
            <group position={[0, -0.8, 0.6]} rotation={[0, 0, -angle]}>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[0.05, 1.8, 0.02]} />
                    <meshBasicMaterial color="#dc2626" />
                </mesh>
            </group>
            <Html position={[0, 0.5, 0.6]} transform scale={0.5}>
                <div className="text-black font-mono font-bold text-lg">
                    {voltage > 0 ? "+" : ""}{voltage} V
                </div>
            </Html>
            <Html position={[0, -1.5, 0]} transform scale={0.5}>
                <div className="text-white text-xs bg-black px-1 rounded">GALVANOMÈTRE</div>
            </Html>
        </group>
    );
};

export default function Induction3D({ magnetPosition, config }: { magnetPosition: number, config: any }) {
    const voltage = parseFloat(config?.voltage || "0");
    const direction = config?.currentDirection || 0;

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 relative">
            <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, 5, 0]} intensity={0.5} color="#fbbf24" />

                <group position={[0, -1, 0]}>
                    <Coil currentDirection={direction} />
                    <Magnet position={magnetPosition} />
                    <Galvanometer voltage={voltage} />
                </group>

                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2} />
            </Canvas>
            
            <div className="absolute top-4 left-4 text-xs text-white/50">
                Bobine : Cuivre 100 spires • Aimant : Permanent
            </div>
        </div>
    );
}