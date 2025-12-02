"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, OrbitControls, Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- PARTICULES (Isotopes) ---
const Isotopes = ({ c14Percent }: { c14Percent: number }) => {
    // On génère 200 particules fixes
    const particles = useMemo(() => Array.from({ length: 200 }).map(() => ({
        pos: [
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 1 + 0.5, // Autour de l'os
            (Math.random() - 0.5) * 1
        ] as [number, number, number],
        id: Math.random()
    })), []);

    return (
        <group>
            {particles.map((p, i) => {
                // Répartition C14 / N14
                // Si i est dans le % de C14 restant, c'est du C14 (Radioactif)
                // Sinon, c'est devenu du N14 (Stable)
                const isC14 = i < (c14Percent * 2); 
                
                return (
                    <mesh key={p.id} position={p.pos}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial 
                            color={isC14 ? "#22c55e" : "#3b82f6"} // Vert (C14) ou Bleu (N14)
                            emissive={isC14 ? "#22c55e" : "#000"}
                            emissiveIntensity={isC14 ? 1.5 : 0}
                            transparent 
                            opacity={isC14 ? 1 : 0.4}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

// --- SCANNER LASER ---
const Scanner = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(group.current) {
            // Balayage
            group.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
        }
    });

    return (
        <group ref={group}>
            <group rotation={[0, 0, Math.PI/2]}>
                {/* Anneau du scanner */}
                <mesh>
                    <torusGeometry args={[1.5, 0.05, 16, 32]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
                </mesh>
                {/* Faisceau laser (Plan) */}
                <mesh rotation={[0, Math.PI/2, 0]}>
                    <planeGeometry args={[3, 3]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.1} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </group>
    );
}

// --- ARTEFACT (Ossement - Fémur stylisé) ---
const BoneArtifact = () => (
    <group rotation={[0, 0, Math.PI/4]}>
        {/* Corps de l'os */}
        <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 3, 16]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.6} />
        </mesh>
        {/* Épiphyse Haut */}
        <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.6} />
        </mesh>
        {/* Épiphyse Bas */}
        <group position={[0, -1.5, 0]}>
            <mesh position={[-0.2, 0, 0]}>
                <sphereGeometry args={[0.45, 16, 16]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.6} />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
                <sphereGeometry args={[0.45, 16, 16]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.6} />
            </mesh>
        </group>
    </group>
);

export default function CarbonDating3D({ config }: { config: any }) {
    const c14 = parseFloat(config?.c14 || "100");
    const activityLevel = c14 > 0 ? Math.max(1, Math.floor(c14 / 10)) : 0; // Pour simuler le bruit du compteur

    return (
        <div className="w-full h-[600px] bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.3} />
                <spotLight position={[10, 10, 10]} intensity={1} angle={0.5} penumbra={1} />
                <pointLight position={[-5, -5, 5]} intensity={0.5} color="#22c55e" />
                
                <Stars radius={50} count={200} />
                <Sparkles count={50} scale={4} size={2} speed={0.4} opacity={0.2} color="#fff" />

                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                    <BoneArtifact />
                    <Isotopes c14Percent={c14} />
                </Float>

                <Scanner />

                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/1.5} />
            </Canvas>
            
            {/* UI Overlay : Compteur Geiger */}
            <div className="absolute top-4 left-4 p-3 bg-gray-900/80 backdrop-blur border border-green-900 rounded-xl flex flex-col gap-2 shadow-lg">
                <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Détecteur Geiger-Müller</div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${c14 > 0 ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`}></div>
                    <div className="text-2xl font-black text-white font-mono">{c14.toFixed(1)}%</div>
                </div>
                {/* Barres d'activité */}
                <div className="flex gap-0.5 h-4 items-end">
                    {[...Array(10)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1.5 rounded-sm ${i < activityLevel ? 'bg-green-500' : 'bg-gray-800'}`}
                            style={{height: `${Math.random() * 100}%`}} // Effet de bruit aléatoire
                        ></div>
                    ))}
                </div>
            </div>

            {/* Légende */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-500 flex flex-col gap-1 items-end">
                <div className="flex items-center gap-2">
                    <span>Carbone 14 (Instable)</span> <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                </div>
                <div className="flex items-center gap-2">
                    <span>Azote 14 (Stable)</span> <div className="w-2 h-2 rounded-full bg-blue-500 opacity-50"></div>
                </div>
            </div>
        </div>
    );
}