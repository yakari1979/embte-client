"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Html, Trail, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- ORBITALES (Couches K, L, M, N...) ---
const Orbital = ({ radius, isActive }: { radius: number, isActive: boolean }) => (
    <group rotation={[Math.PI/2, 0, 0]}>
        <mesh>
            <torusGeometry args={[radius, 0.02, 16, 64]} />
            <meshBasicMaterial color={isActive ? "#fbbf24" : "#475569"} transparent opacity={isActive ? 1 : 0.3} />
        </mesh>
    </group>
);

// --- PHOTON (Particule ondulatoire) ---
const Photon = ({ color, direction, active, onFinish }: any) => {
    const ref = useRef<THREE.Group>(null);
    const [dist, setDist] = useState(0);

    useFrame((state, delta) => {
        if (active && ref.current) {
            setDist(d => d + delta * 5); // Vitesse lumière (simulée)
            
            // Mouvement ondulatoire (Sinusoïde)
            ref.current.position.x = direction * dist;
            ref.current.position.y = Math.sin(dist * 10) * 0.2; 
            
            // Disparition loin
            if (dist > 10) {
                setDist(0);
                if (onFinish) onFinish();
            }
        }
    });

    if (!active) return null;

    return (
        <group ref={ref}>
            <Sphere args={[0.15]}>
                <meshBasicMaterial color={color} toneMapped={false} />
                <pointLight color={color} intensity={2} distance={2} />
            </Sphere>
            <Trail width={0.2} length={2} color={color} attenuation={(t) => t*t}>
                <mesh><sphereGeometry args={[0.05]}/><meshBasicMaterial/></mesh>
            </Trail>
        </group>
    );
};

// --- ÉLECTRON (Particule qui saute) ---
const Electron = ({ targetRadius, color }: { targetRadius: number, color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    // On stocke le rayon actuel pour l'animation
    const currentRadius = useRef(targetRadius);

    useFrame((state, delta) => {
        if (ref.current) {
            // Rotation sur l'orbite
            const angle = state.clock.elapsedTime * 2;
            
            // Animation fluide du saut (Lerp sur le rayon)
            currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, delta * 2);
            
            const x = Math.cos(angle) * currentRadius.current;
            const z = Math.sin(angle) * currentRadius.current;
            
            ref.current.position.set(x, 0, z);
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1} />
            <pointLight distance={2} intensity={1} color="#3b82f6" />
        </mesh>
    );
};

export default function BohrAtom3D({ n1, n2, color, isAnimating }: any) {
    const [photonActive, setPhotonActive] = useState(false);

    // Déclenchement du photon au changement d'état
    useEffect(() => {
        if (isAnimating) {
            setPhotonActive(true);
            const t = setTimeout(() => setPhotonActive(false), 2000);
            return () => clearTimeout(t);
        }
    }, [n1, n2, isAnimating]);

    // Rayons des orbites (n=1 -> 2, n=2 -> 3.5, etc.)
    const getRadius = (n: number) => 1.5 + (n - 1) * 1.5;

    // Direction du photon : Sortant (Emission) ou Entrant (Absorption)
    // Ici on simplifie : on montre toujours un photon qui part si émission
    const isEmission = n2 < n1;

    return (
        <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl relative">
            <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                <color attach="background" args={['#000000']} />
                <Stars radius={50} count={500} factor={4} fade speed={1} />
                <ambientLight intensity={0.2} />

                {/* NOYAU */}
                <Sphere args={[0.8, 32, 32]}>
                    <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} />
                </Sphere>
                <Html position={[0, -1.2, 0]} center><div className="text-red-500 font-bold text-xs">NOYAU (+)</div></Html>

                {/* ORBITALES (n=1 à n=5) */}
                {[1, 2, 3, 4, 5].map(n => (
                    <Orbital key={n} radius={getRadius(n)} isActive={n === n2 || n === n1} />
                ))}

                {/* ÉLECTRON */}
                <Electron targetRadius={getRadius(n2)} color={color} />

                {/* PHOTON (Animation) */}
                {/* Si émission : part du centre vers l'extérieur. Si absorption : inverse (non implémenté ici pour simplicité, on montre l'émission) */}
                {photonActive && isEmission && (
                    <group rotation={[0, Math.PI/4, 0]}> {/* Angle arbitraire */}
                        <Photon color={color} direction={1} active={true} />
                    </group>
                )}

                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    );
}