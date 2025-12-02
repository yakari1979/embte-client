"use client";
import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, OrbitControls, Tube, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- NOYAU DE FER (Circuit Magnétique) ---
const IronCore = ({ active }: { active: boolean }) => {
    return (
        <group>
            {/* Cadre en fer (4 barres) */}
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[6, 1, 1]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -2, 0]}>
                <boxGeometry args={[6, 1, 1]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-2.5, 0, 0]}>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[2.5, 0, 0]}>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Visualisation du Flux Magnétique (Lueur interne) */}
            {active && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[5.5, 3.5, 0.5]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
                </mesh>
            )}
        </group>
    );
};

// --- BOBINE DYNAMIQUE ---
const CoilWinding = ({ position, turns, color, label, voltage }: any) => {
    // La hauteur de la bobine dépend du nombre de spires (turns)
    // On mappe 100-1000 spires vers une hauteur visuelle
    const height = Math.max(0.5, Math.min(2.8, (turns / 500) * 1.5));
    
    return (
        <group position={position}>
            {/* Le cuivre */}
            <mesh>
                <cylinderGeometry args={[0.8, 0.8, height, 32]} />
                <meshStandardMaterial 
                    color={color} 
                    metalness={0.5} 
                    roughness={0.3}
                    // Texture striée simulée par une map normale ou simple couleur
                />
            </mesh>
            {/* Anneaux décoratifs (fils) */}
            {Array.from({ length: Math.floor(height * 5) }).map((_, i) => (
                <mesh key={i} position={[0, -height/2 + i*0.2 + 0.1, 0]}>
                    <torusGeometry args={[0.81, 0.02, 8, 32]} />
                    <meshBasicMaterial color="#000" opacity={0.2} transparent />
                </mesh>
            ))}
            
            {/* Label */}
            <Html position={[0, -2, 0]} center>
                <div className="flex flex-col items-center gap-1 bg-black/70 p-2 rounded backdrop-blur-sm border border-white/10">
                    <span className="text-gray-400 text-xs font-bold">{label}</span>
                    <span className="text-white font-mono font-bold text-sm">{turns} spires</span>
                    {voltage !== null && (
                        <span className={`text-xs font-bold ${color === '#ef4444' ? 'text-red-400' : 'text-blue-400'}`}>
                            {voltage} V
                        </span>
                    )}
                </div>
            </Html>
        </group>
    );
};

export default function Transformer3D({ u1, u2, n1, n2 }: { u1: number, u2: number, n1: number, n2: number }) {
    const isActive = u1 > 0;

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                
                {/* Circuit Magnétique */}
                <IronCore active={isActive} />

                {/* Primaire (Gauche - Rouge) */}
                <CoilWinding 
                    position={[-2.5, 0, 0]} 
                    turns={n1} 
                    color="#b91c1c" // Cuivre sombre
                    label="PRIMAIRE (Entrée)"
                    voltage={u1}
                />

                {/* Secondaire (Droite - Bleu) */}
                <CoilWinding 
                    position={[2.5, 0, 0]} 
                    turns={n2} 
                    color="#1d4ed8" // Cuivre/Bleu distinctif
                    label="SECONDAIRE (Sortie)"
                    voltage={u2}
                />

                {/* Indication Flux */}
                {isActive && (
                    <Html position={[0, 0, 0]} center>
                        <div className="text-red-500 font-bold text-xs opacity-50 animate-pulse">
                            FLUX MAGNÉTIQUE Φ
                        </div>
                    </Html>
                )}

                <OrbitControls enableZoom={true} minDistance={5} maxDistance={20} />
            </Canvas>
        </div>
    );
}