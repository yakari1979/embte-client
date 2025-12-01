"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, OrbitControls, Trail, Line } from '@react-three/drei';
import * as THREE from 'three';

// --- LE CŒUR ---
const Heart = ({ rate }: { rate: number }) => {
    const ref = useRef<THREE.Group>(null);
    
    // Animation de battement
    useFrame((state) => {
        if (ref.current) {
            // Vitesse basée sur le heartRate (rate)
            // 60bpm = 1 battement / sec. rate/60 = fréquence Hz
            const speed = (rate / 60) * Math.PI * 2; 
            const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.15;
            ref.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={ref} position={[0, -2, 0]}>
            {/* Forme simplifiée du cœur (2 sphères + pointe) */}
            <Sphere args={[0.7, 32, 32]} position={[-0.5, 0.5, 0]}>
                <meshStandardMaterial color="#ef4444" roughness={0.2} />
            </Sphere>
            <Sphere args={[0.7, 32, 32]} position={[0.5, 0.5, 0]}>
                <meshStandardMaterial color="#ef4444" roughness={0.2} />
            </Sphere>
            <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 1]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} />
            </mesh>
            <Html position={[0, -1.5, 0]} center><div className="text-white text-xs font-bold">{Math.round(rate)} BPM</div></Html>
        </group>
    );
};

// --- LE CERVEAU (Bulbe Rachid) ---
const BrainStem = () => (
    <group position={[0, 3, 0]}>
        <Sphere args={[1.2, 32, 32]} scale={[1, 0.8, 1]}>
            <meshStandardMaterial color="#fcd34d" transparent opacity={0.8} /> {/* Jaune cervelle */}
        </Sphere>
        <Html position={[0, 1.5, 0]} center><div className="bg-black/50 text-white px-2 rounded text-xs">Centre Bulbaire</div></Html>
    </group>
);

// --- LES NERFS (Câbles) ---
const Nerve = ({ start, end, activity, color, label }: any) => {
    // Activity: 'SILENT', 'LOW', 'NORMAL', 'HIGH'
    const isCut = activity === 'SILENT';
    
    // Animation des influx (points lumineux qui circulent)
    const Signal = () => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
            if (ref.current && !isCut) {
                // Vitesse proportionnelle à l'activité
                const speed = activity === 'HIGH' ? 4 : activity === 'LOW' ? 0.5 : 2;
                const t = (state.clock.elapsedTime * speed) % 1;
                const pos = new THREE.Vector3().lerpVectors(new THREE.Vector3(...start), new THREE.Vector3(...end), t);
                ref.current.position.copy(pos);
            }
        });
        if (isCut) return null;
        return (
            <mesh ref={ref}>
                <sphereGeometry args={[0.15]} />
                <meshBasicMaterial color="white" />
            </mesh>
        );
    };

    return (
        <group>
            {/* Le nerf physique */}
            <Line 
                points={[start, end]} 
                color={isCut ? "#52525b" : color} 
                lineWidth={isCut ? 1 : 3} 
                dashed={isCut}
            />
            {/* Si coupé, une croix rouge */}
            {isCut && (
                <Html position={[(start[0]+end[0])/2, (start[1]+end[1])/2, 0]}>
                    <div className="text-red-500 font-bold text-xl">❌</div>
                </Html>
            )}
            {/* Signal électrique */}
            <Signal />
            
            <Html position={[start[0]-0.5, (start[1]+end[1])/2, 0]}>
                <div className={`text-xs font-bold px-1 rounded ${isCut ? 'text-gray-500' : 'text-white'}`} style={{ backgroundColor: color }}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

export default function HeartRate3D({ config }: { config: any }) {
    if (!config) return null;

    return (
        <Canvas camera={{ position: [0, 0, 10] }}>
            <color attach="background" args={['#1e1b4b']} /> {/* Bleu nuit profond */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <BrainStem />
            <Heart rate={config.heartRate} />

            {/* --- CABLAGE NERVEUX --- */}
            
            {/* 1. Nerf de Hering (Sensitif : Cœur/Aorte -> Cerveau) */}
            {/* Pour simplifier, on le fait partir du haut du cœur vers le cerveau */}
            <Nerve 
                start={[0.5, -1, 0]} 
                end={[0.5, 2.5, 0]} 
                activity={config.nerveActivity.hering} 
                color="#22c55e" 
                label="Hering (Sensitif)"
            />

            {/* 2. Nerf X / Vague (Moteur Parasympathique : Cerveau -> Cœur) */}
            <Nerve 
                start={[-0.5, 2.5, 0]} 
                end={[-0.5, -1, 0]} 
                activity={config.nerveActivity.para} 
                color="#3b82f6" 
                label="Nerf X (Frein)"
            />

            {/* 3. Nerf Orthosympathique (Moteur Sympathique : Cerveau -> Cœur) */}
            {/* Trajet un peu décalé */}
            <Nerve 
                start={[1.5, 2.5, 0]} 
                end={[1, -1, 0]} 
                activity={config.nerveActivity.ortho} 
                color="#ef4444" 
                label="Orthosympathique (Accél)"
            />

            <OrbitControls enableZoom={false} />
        </Canvas>
    );
}