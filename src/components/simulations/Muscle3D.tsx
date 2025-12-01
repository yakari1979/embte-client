"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, OrbitControls, Html, Stars, Float } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

// --- PARTICULES (Calcium & ATP) ---
const FloatingParticles = ({ count, color, active }: { count: number, color: string, active: boolean }) => {
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.5
        }));
    }, [count]);

    if (!active) return null;

    return (
        <group>
            {particles.map((data, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
                    <Sphere args={[0.08 * data.scale, 8, 8]} position={data.position}>
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
};

// --- MYOSINE (Filament Épais avec Têtes) ---
const MyosinFilament = () => {
    // Création des têtes de myosine le long du filament
    const heads = useMemo(() => {
        const items = [];
        for(let i = -3; i <= 3; i+= 0.8) {
            // Têtes en haut et en bas
            items.push({ x: i, y: 0.25, rot: 0.5 });
            items.push({ x: i + 0.4, y: -0.25, rot: -0.5 });
        }
        return items;
    }, []);

    return (
        <group>
            {/* Tige centrale */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 8, 16]} />
                <meshStandardMaterial color="#b91c1c" roughness={0.4} /> {/* Rouge Sang Sombre */}
            </mesh>
            
            {/* Têtes de Myosine */}
            {heads.map((h, i) => (
                <group key={i} position={[h.x, h.y, 0]} rotation={[0, 0, h.rot]}>
                    <mesh position={[0, 0.1, 0]}>
                        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
                        <meshStandardMaterial color="#ef4444" /> {/* Rouge Vif */}
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// --- ACTINE (Filament Fin - Double Hélice simulée) ---
const ActinFilament = ({ position }: { position: any }) => {
    return (
        <animated.group position={position}>
            {/* On utilise une texture striée ou simplement des sphères pour imiter l'actine G */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 4.5, 16]} />
                <meshStandardMaterial color="#60a5fa" />
            </mesh>
            
            {/* Protéines régulatrices (Troponine/Tropomyosine) simulées par des anneaux */}
            {[...Array(6)].map((_, i) => (
                <mesh key={i} position={[-2 + i * 0.8, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                    <torusGeometry args={[0.08, 0.02, 8, 16]} />
                    <meshStandardMaterial color="#fbbf24" /> {/* Jaune pour la régulation */}
                </mesh>
            ))}
        </animated.group>
    );
};

// --- DISQUE Z (Structure en zigzag) ---
const ZDisk = ({ position }: { position: any }) => (
    <animated.group position={position}>
        <mesh>
            <boxGeometry args={[0.2, 3.5, 3.5]} />
            <meshStandardMaterial 
                color="#475569" 
                metalness={0.6}
                roughness={0.2}
                transparent
                opacity={0.8}
            />
        </mesh>
        {/* Structure interne du disque Z */}
        <mesh position={[0,0,0]} rotation={[0,0,0]}>
             <boxGeometry args={[0.25, 3.4, 0.1]} />
             <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0,0,0]} rotation={[Math.PI/2,0,0]}>
             <boxGeometry args={[0.25, 3.4, 0.1]} />
             <meshStandardMaterial color="#94a3b8" />
        </mesh>
    </animated.group>
);

export default function Muscle3D({ sarcomereLength, calcium, atp }: { sarcomereLength: number, calcium: boolean, atp: boolean }) {
    // Conversion pourcentage -> position
    // 100% (Relâché) = Disques à +/- 4.5
    // 70% (Contracté) = Disques à +/- 3.0
    const targetPos = (sarcomereLength / 100) * 4.5;

    // Animation fluide des ressorts
    const { x } = useSpring({
        x: targetPos,
        config: { mass: 5, tension: 120, friction: 30 } // Mouvement lourd et organique
    });

    return (
        <Canvas camera={{ position: [0, 1, 8], fov: 45 }}>
            {/* ÉCLAIRAGE SCÈNE MICROSCOPIQUE */}
            <color attach="background" args={['#0f172a']} /> {/* Fond sombre */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" /> {/* Lumière bleue de contre */}
            
            {/* Effet particules ambiantes */}
            <Stars radius={50} depth={50} count={200} factor={2} saturation={0} fade speed={1} />

            {/* --- PARTICULES BIOCHIMIQUES --- */}
            {/* Calcium (Bleu) */}
            <FloatingParticles count={40} color="#3b82f6" active={calcium} />
            {/* ATP (Jaune/Or) */}
            <FloatingParticles count={30} color="#fbbf24" active={atp} />

            {/* --- SARCOMÈRE --- */}
            <group>
                {/* Centre : Myosine (Fixe) */}
                <MyosinFilament />

                {/* Gauche : Actine et Disque Z (Mobiles) */}
                <group>
                    {/* Actines du haut et du bas */}
                    <ActinFilament position={x.to(val => [-val + 2.2, 0.5, 0])} /> 
                    <ActinFilament position={x.to(val => [-val + 2.2, -0.5, 0])} /> 
                    <ActinFilament position={x.to(val => [-val + 2.2, 0, 0.5])} /> 
                    <ActinFilament position={x.to(val => [-val + 2.2, 0, -0.5])} /> 
                    {/* Disque Z Gauche */}
                    <ZDisk position={x.to(val => [-val, 0, 0])} />
                </group>

                {/* Droite : Actine et Disque Z (Mobiles inverse) */}
                <group rotation={[0, Math.PI, 0]}> {/* Miroir pour la droite */}
                    <ActinFilament position={x.to(val => [-val + 2.2, 0.5, 0])} />
                    <ActinFilament position={x.to(val => [-val + 2.2, -0.5, 0])} />
                    <ActinFilament position={x.to(val => [-val + 2.2, 0, 0.5])} />
                    <ActinFilament position={x.to(val => [-val + 2.2, 0, -0.5])} />
                    {/* Disque Z Droit */}
                    <ZDisk position={x.to(val => [-val, 0, 0])} />
                </group>
            </group>

            {/* LABELS FLOTTANTS */}
            <Html position={[0, 1.5, 0]} center>
                <div className="text-white/50 text-xs font-mono tracking-widest text-center">
                    ZONE H
                </div>
            </Html>
            <Html position={[-4, 2, 0]} center>
                <div className="bg-black/60 text-white px-2 py-1 rounded text-xs border border-gray-600">
                    Disque Z
                </div>
            </Html>

            <OrbitControls minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI - Math.PI/4} />
        </Canvas>
    );
}