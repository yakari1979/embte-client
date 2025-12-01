"use client";
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls, Html, Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

// --- SPERMATOZOÏDE ---
const Sperm = ({ startPos, target, speed, isWinner }: { startPos: any, target: any, speed: number, isWinner: boolean }) => {
    const ref = useRef<THREE.Group>(null);
    const [finished, setFinished] = useState(false);

    useFrame((state, delta) => {
        if (ref.current && !finished) {
            // Avancer vers la cible
            const direction = new THREE.Vector3().subVectors(target, ref.current.position).normalize();
            
            // Vitesse variable selon le backend
            const moveSpeed = speed * (isWinner ? 2.5 : 1 + Math.random()); 
            
            ref.current.position.add(direction.multiplyScalar(delta * moveSpeed));
            
            // Regarder la cible
            ref.current.lookAt(target);

            // Mouvement de la queue (ondulation simulée par wiggle)
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.2;

            // Arrêt au contact
            if (ref.current.position.distanceTo(target) < 1.8) {
                setFinished(true);
            }
        }
    });

    return (
        <group ref={ref} position={startPos}>
            {/* Tête */}
            <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={isWinner ? "#60a5fa" : "#cbd5e1"} emissive={isWinner ? "#2563eb" : "#000"} />
            </mesh>
            {/* Queue (Trail) */}
            <Trail width={0.4} length={4} color={isWinner ? "#60a5fa" : "#94a3b8"} attenuation={(t) => t * t}>
                <mesh position={[0, 0, 0.5]}>
                    <sphereGeometry args={[0.05]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </Trail>
        </group>
    );
};

// --- OVOCYTE ---
const Egg = ({ state }: { state: string }) => {
    if (state === 'ABSENT') return null;

    const color = state === 'OLD' ? '#fbbf24' : '#fcd34d'; // Jaune pâle ou Jaune foncé

    return (
        <group>
            {/* Zone Pellucide (Halo transparent) */}
            <Sphere args={[2.2, 64, 64]}>
                <MeshDistortMaterial 
                    color="#ffffff" 
                    transparent 
                    opacity={0.3} 
                    distort={0.2} 
                    speed={1} 
                    roughness={0}
                />
            </Sphere>
            {/* Cytoplasme */}
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.8}
                />
            </Sphere>
            {/* Noyau */}
            <Sphere args={[0.5]} position={[0.5, 0.5, 0]}>
                <meshStandardMaterial color="#f472b6" /> {/* Rose */}
            </Sphere>
        </group>
    );
};

export default function Fertilization3D({ config }: { config: any }) {
    const spermCount = 50; // Nombre de particules
    const winnerIndex = Math.floor(Math.random() * spermCount);

    // Génération positions de départ (autour de l'oeuf)
    const spermList = useMemo(() => {
        return Array.from({ length: spermCount }).map(() => ({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                5 + Math.random() * 10 // Ils viennent du fond
            )
        }));
    }, []);

    const target = new THREE.Vector3(0, 0, 0);

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <color attach="background" args={['#020617']} /> {/* Noir profond uterus */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, 5]} color="#f43f5e" intensity={0.5} /> {/* Ambiance charnelle */}

            {/* Particules ambiantes */}
            <Stars radius={50} depth={50} count={500} factor={4} saturation={0} fade speed={1} />

            <Egg state={config?.eggState || 'PRESENT'} />

            {config?.eggState === 'PRESENT' && spermList.map((s, i) => (
                <Sperm 
                    key={i} 
                    startPos={s.pos} 
                    target={target} 
                    speed={config.spermSpeed} 
                    isWinner={config.success && i === winnerIndex} 
                />
            ))}

            <OrbitControls autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
}