"use client";
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls, Html, Float, Stars, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// --- BACTÉRIE (L'ennemi) ---
const Bacteria = ({ position, stage }: { position: {x: number, y: number, z: number}, stage: string }) => {
    const ref = useRef<THREE.Group>(null);
    
    // État pour la digestion (rétrécissement)
    useFrame((state, delta) => {
        if (ref.current) {
            // Mouvement fluide vers la position cible
            ref.current.position.lerp(new THREE.Vector3(position.x, position.y, position.z), 0.08);
            
            // Rotation continue
            ref.current.rotation.x += 0.01;
            ref.current.rotation.y += 0.02;

            // Effet de digestion (Rétrécissement)
            if (stage === 'DIGESTION') {
                const currentScale = ref.current.scale.x;
                if (currentScale > 0.1) {
                    const newScale = THREE.MathUtils.lerp(currentScale, 0.05, delta * 2);
                    ref.current.scale.set(newScale, newScale, newScale);
                }
            } else if (stage === 'REJET') {
                ref.current.scale.set(0, 0, 0); // Disparu
            } else {
                // Taille normale
                ref.current.scale.set(1, 1, 1);
            }
        }
    });

    // Couleur changeante : Vert (Vivant) -> Noir/Gris (Digéré)
    const color = stage === 'DIGESTION' ? '#3f3f46' : '#22c55e';

    return (
        <group ref={ref} position={[5, 0, 0]}>
            {/* Corps de la bactérie (Capsule) */}
            <mesh>
                <capsuleGeometry args={[0.3, 1.2, 4, 16]} />
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.8}
                    emissive={stage === 'DIGESTION' ? '#000000' : '#15803d'}
                />
            </mesh>
            
            {/* Pili / Cils (petits poils) */}
            {Array.from({ length: 12 }).map((_, i) => (
                <mesh key={i} position={[0, (i - 6) * 0.15, 0]} rotation={[Math.PI / 2, 0, (i * Math.PI) / 6]}>
                     <cylinderGeometry args={[0.02, 0.02, 1.4]} />
                     <meshStandardMaterial color="#166534" />
                </mesh>
            ))}

            <Html position={[0, 1, 0]} center distanceFactor={10}>
                <div className={`text-xs font-bold px-2 py-0.5 rounded ${stage === 'DIGESTION' ? 'bg-black text-white' : 'bg-green-600 text-white'}`}>
                    {stage === 'DIGESTION' ? 'Destruction...' : 'Bactérie'}
                </div>
            </Html>
        </group>
    );
};

// --- LYSOSOMES (Les armes) ---
const Lysosomes = ({ active }: { active: boolean }) => {
    // Plein de petites vésicules enzymatiques
    const lysosomes = useMemo(() => Array.from({ length: 8 }).map(() => ({
        offset: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
    })), []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Si digestion, ils se rassemblent au centre (vers la bactérie)
            // Sinon ils flottent autour
            const targetScale = active ? 0.2 : 1; 
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta);
            groupRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            {lysosomes.map((l, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={l.offset as any}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial color="#ef4444" emissive="#b91c1c" transparent opacity={0.9} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

// --- DÉBRIS (Rejet) ---
const Debris = ({ visible }: { visible: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if(visible && groupRef.current) {
            groupRef.current.position.x += delta * 1.5; // Expulsion
            groupRef.current.rotation.z += delta;
        } else if (!visible && groupRef.current) {
            groupRef.current.position.set(0,0,0); // Reset
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef}>
            {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={i} position={[Math.random()-0.5, Math.random()-0.5, Math.random()-0.5]}>
                    <dodecahedronGeometry args={[0.08]} />
                    <meshStandardMaterial color="#52525b" />
                </mesh>
            ))}
            <Html position={[0, 0.5, 0]}>
                <div className="text-xs bg-gray-700 text-white px-1 rounded">Déchets</div>
            </Html>
        </group>
    );
}

// --- MACROPHAGE (La Cellule) ---
const Macrophage = ({ stage }: { stage: string }) => {
    // La couleur change légèrement si activé
    const color = stage === 'DIGESTION' ? '#fdba74' : '#ffecb3'; // Orange pale si digestion, beige sinon

    return (
        <group>
            {/* Membrane Cytoplasmique */}
            <Sphere args={[2.2, 64, 64]}>
                <MeshDistortMaterial 
                    color={color} 
                    distort={0.3} 
                    speed={1.5}
                    transparent 
                    opacity={0.35} // Plus transparent pour voir dedans
                    roughness={0.2}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </Sphere>
            
            {/* Noyau (Gros truc au fond) */}
            <mesh position={[-0.5, -0.5, -0.5]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#fb7185" roughness={0.8} /> {/* Rose/Violet */}
            </mesh>
        </group>
    );
};


export default function Phagocytosis3D({ config }: { config: any }) {
    // Détermination de l'étape pour les animations internes
    // Le config.message nous aide à savoir où on en est, ou on peut passer une prop 'stage'
    const isDigesting = config?.message?.includes("DIGESTION") || config?.message?.includes("enzymes");
    const isRejecting = config?.message?.includes("EXOCYTOSE") || config?.message?.includes("Rejet");
    
    // Déduction du stage string pour passer aux composants
    let stage = 'PATROL';
    if (config?.message?.includes("ADHÉRENCE")) stage = 'ADHESION';
    if (config?.message?.includes("INGESTION")) stage = 'INGESTION';
    if (isDigesting) stage = 'DIGESTION';
    if (isRejecting) stage = 'REJET';

    const bacterialPos = config ? config.bacteriaPos : { x: 5, y: 0, z: 0 };

    return (
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            {/* ÉCLAIRAGE TYPE MICROSCOPE */}
            <color attach="background" args={['#111827']} /> {/* Fond noir/bleu nuit */}
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -5, -5]} color="#60a5fa" intensity={0.8} /> {/* Rim light bleu */}

            {/* Particules ambiantes (Sang/Lymphe) */}
            <Stars radius={20} depth={50} count={300} factor={2} saturation={0} fade speed={1} />

            {/* LA CELLULE */}
            <group position={[-1, 0, 0]}>
                <Macrophage stage={stage} />
                <Lysosomes active={stage === 'DIGESTION'} />
                
                {/* LA CIBLE */}
                <Bacteria position={bacterialPos} stage={stage} />
                
                {/* LES DÉCHETS */}
                <Debris visible={stage === 'REJET'} />
            </group>

            <OrbitControls minDistance={4} maxDistance={12} />
        </Canvas>
    );
}