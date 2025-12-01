"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Html, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const COLORS: any = {
  'A': '#ef4444', // Rouge
  'T': '#eab308', // Jaune
  'C': '#22c55e', // Vert
  'G': '#3b82f6', // Bleu
  'U': '#d946ef', // Violet
};

// --- BASE AZOTÉE (Design Moléculaire) ---
const BasePair = ({ type, position, isRNA = false }: { type: string, position: any, isRNA?: boolean }) => {
    return (
        <group position={position}>
            {/* Atome Central */}
            <mesh>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color={COLORS[type]} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Lettre Incrustée */}
            <Text 
                position={[0, 0, 0.45]} 
                fontSize={0.3} 
                color="white" 
                anchorX="center" 
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="black"
            >
                {type}
            </Text>
            {/* Liaison Sucre-Phosphate (Tige) */}
            <mesh position={[0, isRNA ? 0.6 : -0.6, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.8]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            {/* Phosphate (Petite boule) */}
            <mesh position={[0, isRNA ? 1.1 : -1.1, 0]}>
                <sphereGeometry args={[0.25]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
    );
};

// --- ARN POLYMÉRASE (La Machine) ---
const Polymerase = () => (
    <group position={[2, 0, 0]}>
        {/* Corps principal (Semi-transparent) */}
        <mesh>
            <sphereGeometry args={[3.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8]} /> {/* Forme ouverte */}
            <meshPhysicalMaterial 
                color="#60a5fa" 
                transmission={0.6} 
                opacity={0.4} 
                transparent 
                roughness={0.2} 
                thickness={2}
                clearcoat={1}
            />
        </mesh>
        {/* Label */}
        <Html position={[0, 4, 0]} center>
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg font-bold">
                ARN Polymérase
            </div>
        </Html>
    </group>
);

// --- NUCLÉOTIDES LIBRES (Ambiance) ---
const FreeNucleotides = () => {
    const nucleotides = useMemo(() => Array.from({ length: 20 }).map(() => ({
        type: ['A', 'U', 'C', 'G'][Math.floor(Math.random() * 4)],
        pos: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10 + 5, // Au dessus
            (Math.random() - 0.5) * 5
        ] as [number, number, number]
    })), []);

    return (
        <group>
            {nucleotides.map((n, i) => (
                <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}>
                    <group position={n.pos} scale={0.5}>
                        <mesh>
                            <sphereGeometry args={[0.3]} />
                            <meshStandardMaterial color={COLORS[n.type]} transparent opacity={0.6} />
                        </mesh>
                    </group>
                </Float>
            ))}
        </group>
    );
};

// --- PROCESSUS D'ASSEMBLAGE ---
const TranscriptionProcess = ({ data, isPlaying, onFinish }: { data: any, isPlaying: boolean, onFinish: () => void }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [progress, setProgress] = useState(0);

    useFrame((state, delta) => {
        if (isPlaying) {
            if (progress < data.templateStrand.length + 2) {
                setProgress((prev) => prev + delta * 1.5);
            } else {
                onFinish();
            }
        }
    });

    const offset = -progress * 1.2;

    return (
        <group ref={groupRef} position={[offset + 5, 0, 0]}>
            {/* BRIN ADN MODÈLE (Fixe en bas) */}
            {data.templateStrand.map((base: string, i: number) => (
                <group key={`dna-${i}`}>
                    <BasePair type={base} position={[i * 1.2, -1.5, 0]} />
                    {/* Liaison hydrogène brisée si sous l'enzyme */}
                    {Math.abs(i - progress) > 2 && (
                        <mesh position={[i * 1.2, 0, 0]}>
                            <cylinderGeometry args={[0.05, 0.05, 2]} />
                            <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} />
                        </mesh>
                    )}
                </group>
            ))}

            {/* BRIN ARNm (En construction) */}
            {data.mrnaStrand.map((base: string, i: number) => {
                // N'apparait que si l'enzyme est passée
                if (i > progress + 3) return null;

                // Animation d'arrivée "magnétique"
                let yPos = 1.5;
                let scale = 1;
                let opacity = 1;

                if (i > progress) {
                    // Le nucléotide arrive du ciel
                    yPos = 8 - (progress - i + 4) * 3;
                    if (yPos < 1.5) yPos = 1.5;
                    scale = Math.min(1, Math.max(0, 1 - (yPos - 1.5) / 5)); // Grandit en arrivant
                }

                // Animation de départ (l'ARNm se détache à gauche)
                if (i < progress - 4) {
                    yPos += (progress - i - 4) * 0.5; // Monte et part
                }

                return (
                    <group key={`rna-${i}`} position={[i * 1.2, yPos, 0]} scale={scale}>
                        <BasePair type={base} position={[0, 0, 0]} isRNA={true} />
                        {/* Liaison covalente entre nucléotides ARN */}
                        {i > 0 && i <= progress && (
                            <mesh position={[-0.6, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.08, 0.08, 1.2]} />
                                <meshStandardMaterial color="#d946ef" /> {/* Squelette ARN coloré */}
                            </mesh>
                        )}
                    </group>
                );
            })}
        </group>
    );
};

export default function Transcription3D({ data, isPlaying, onFinish }: { data: any, isPlaying: boolean, onFinish: () => void }) {
    return (
        <div className="w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative border-4 border-gray-800">
            <Canvas camera={{ position: [0, 2, 14], fov: 45 }}>
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, 5, 5]} color="#3b82f6" intensity={0.8} />
                
                {/* Particules d'ambiance */}
                <Stars radius={50} depth={50} count={300} factor={2} saturation={0} fade speed={1} />
                <FreeNucleotides />

                {/* Machine */}
                <Polymerase />
                <TranscriptionProcess data={data} isPlaying={isPlaying} onFinish={onFinish} />

                <OrbitControls enableZoom={true} minDistance={5} maxDistance={20} />
            </Canvas>

            {/* Légende Interactive */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white text-xs space-y-2 shadow-lg">
                <h4 className="font-bold text-gray-400 uppercase mb-1">Code Génétique</h4>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#ef4444]"></div> Adénine (A)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#d946ef]"></div> Uracile (U) <span className="text-gray-400 ml-1">- Spécifique ARN</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#eab308]"></div> Thymine (T) <span className="text-gray-400 ml-1">- Spécifique ADN</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#22c55e]"></div> Cytosine (C)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#3b82f6]"></div> Guanine (G)</div>
            </div>
        </div>
    );
}