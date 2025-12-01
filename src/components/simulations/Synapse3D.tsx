"use client";
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, OrbitControls, Html, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';

// --- NEUROTRANSMETTEURS (Particules) ---
const Neurotransmitters = ({ active, color, targetPositions }: { active: boolean, color: string, targetPositions: any[] }) => {
    // Les neurotransmetteurs partent du haut et vont vers les récepteurs
    const particles = useMemo(() => Array.from({ length: 30 }).map(() => ({
        offset: [Math.random() * 2 - 1, 3, Math.random() * 2 - 1], // Départ (Vésicule)
        target: targetPositions[Math.floor(Math.random() * targetPositions.length)] // Arrivée (Récepteur)
    })), [targetPositions]);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (active && groupRef.current) {
            // Animation de chute vers les cibles
            groupRef.current.children.forEach((mesh, i) => {
                const target = new THREE.Vector3(...particles[i].target);
                // Lerp progressif
                mesh.position.lerp(target, 0.05 + Math.random() * 0.02);
            });
        } else if (!active && groupRef.current) {
            // Reset en haut (caché)
            groupRef.current.children.forEach((mesh, i) => {
                mesh.position.set(...(particles[i].offset as [number, number, number]));
            });
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.offset as any}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    );
};

// --- IONS (Na+ ou Cl-) ---
const IonFlow = ({ active, type }: { active: boolean, type: 'NA' | 'CL' }) => {
    // Ions qui entrent dans le canal
    const color = type === 'NA' ? '#fbbf24' : '#22c55e'; // Jaune (Na+) ou Vert (Cl-)
    const ions = useMemo(() => Array.from({ length: 20 }).map(() => ({
        x: (Math.random() - 0.5) * 4,
        y: -1 + Math.random(), // Au dessus du canal
        z: (Math.random() - 0.5) * 2,
        speed: 1 + Math.random()
    })), []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if(active && groupRef.current) {
            groupRef.current.children.forEach((mesh, i) => {
                mesh.position.y -= delta * ions[i].speed;
                if(mesh.position.y < -4) mesh.position.y = -1; // Loop
            });
        }
    });

    if (!active) return null;

    return (
        <group ref={groupRef}>
            {ions.map((ion, i) => (
                <mesh key={i} position={[ion.x, ion.y, ion.z]}>
                    <sphereGeometry args={[0.08]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
        </group>
    );
}

// --- RÉCEPTEUR CANAL ---
const ReceptorChannel = ({ position, open, color }: { position: any, open: boolean, color: string }) => {
    // Le canal s'ouvre physiquement
    const leftGate = useRef<THREE.Mesh>(null);
    const rightGate = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (leftGate.current && rightGate.current) {
            const targetRot = open ? 0.5 : 0;
            leftGate.current.rotation.z = THREE.MathUtils.lerp(leftGate.current.rotation.z, -targetRot, 0.1);
            rightGate.current.rotation.z = THREE.MathUtils.lerp(rightGate.current.rotation.z, targetRot, 0.1);
        }
    });

    return (
        <group position={position}>
            {/* Base du récepteur */}
            <mesh position={[-0.2, 0, 0]}>
                <boxGeometry args={[0.3, 0.8, 0.8]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
                <boxGeometry args={[0.3, 0.8, 0.8]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            
            {/* Portes (Gates) qui bougent */}
            <group position={[-0.15, 0.4, 0]}>
                <mesh ref={leftGate} position={[0, 0.2, 0]}> {/* Pivot point ajusté */}
                    <boxGeometry args={[0.1, 0.4, 0.6]} />
                    <meshStandardMaterial color={open ? color : "#64748b"} />
                </mesh>
            </group>
            <group position={[0.15, 0.4, 0]}>
                <mesh ref={rightGate} position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.1, 0.4, 0.6]} />
                    <meshStandardMaterial color={open ? color : "#64748b"} />
                </mesh>
            </group>
        </group>
    );
};

// --- BOUTON SYNAPTIQUE ---
const SynapticBouton = () => (
    <group position={[0, 4, 0]}>
        {/* Membrane Pré-synaptique (Demi-sphère organique) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[3.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
            <meshStandardMaterial 
                color="#fcd34d" 
                transparent 
                opacity={0.8} 
                roughness={0.2}
                side={THREE.DoubleSide}
            />
        </mesh>
        {/* Vésicules en attente */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[0.6]} position={[-1.5, 1, 0]} material-color="#fbbf24" />
            <Sphere args={[0.6]} position={[1.5, 1.2, 0]} material-color="#fbbf24" />
            <Sphere args={[0.6]} position={[0, 2, 0.5]} material-color="#fbbf24" />
        </Float>
    </group>
);

export default function Synapse3D({ data }: { data: any }) {
    const isTransmitting = data?.signalTransmitted; // Si vrai -> Canaux ouverts
    const isGaba = data?.message.includes("GABA");
    const ntColor = isGaba ? "#a855f7" : "#ef4444"; // Violet (GABA) ou Rouge (Ach)
    
    // Positions des récepteurs sur la membrane post-synaptique
    const receptorPositions = [
        [-2, -2, 0], [0, -2, 0], [2, -2, 0]
    ];

    // Cibles pour les neurotransmetteurs (juste au dessus des canaux)
    const targetPositions = receptorPositions.map(p => [p[0], p[1] + 0.8, p[2]]);

    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <color attach="background" args={['#0f172a']} /> {/* Fond sombre bio */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, 5, 0]} color="#3b82f6" intensity={0.5} />

            {/* ÉLÉMENT PRÉ-SYNAPTIQUE */}
            <SynapticBouton />

            {/* NEUROTRANSMETTEURS EN MOUVEMENT */}
            <Neurotransmitters 
                active={!!data} // S'active dès qu'on a des données (stimulation)
                color={ntColor} 
                targetPositions={targetPositions} 
            />

            {/* ÉLÉMENT POST-SYNAPTIQUE */}
            <group position={[0, -2.5, 0]}>
                {/* Membrane */}
                <Box args={[8, 0.5, 4]} position={[0, -0.25, 0]}>
                    <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
                </Box>
                
                {/* Récepteurs Canaux */}
                {receptorPositions.map((pos, i) => (
                    <ReceptorChannel 
                        key={i} 
                        position={[pos[0], 0.5, pos[2]]} 
                        open={isTransmitting} // S'ouvre SEULEMENT si signal transmis (pas bloqué)
                        color={ntColor}
                    />
                ))}
            </group>

            {/* FLUX IONIQUE (Si ouvert) */}
            <IonFlow active={isTransmitting} type={isGaba ? 'CL' : 'NA'} />

            {/* LABELS */}
            <Html position={[4, 2, 0]} center>
                <div className="text-white text-xs font-mono bg-black/50 p-1 rounded">Vésicules</div>
            </Html>
            <Html position={[4, -2, 0]} center>
                <div className="text-white text-xs font-mono bg-black/50 p-1 rounded">Récepteurs</div>
            </Html>

            <OrbitControls />
        </Canvas>
    );
}