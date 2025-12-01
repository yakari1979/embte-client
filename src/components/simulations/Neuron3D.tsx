"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Tube, Html, Trail, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- IMPULSION NERVEUSE (Signal Électrique) ---
const NerveImpulse = ({ path, onFinish }: { path: THREE.CatmullRomCurve3, onFinish: () => void }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [pos, setPos] = useState(0);

    useFrame((state, delta) => {
        if (pos < 1) {
            // Vitesse rapide (c'est de l'électricité !)
            setPos((p) => p + delta * 2.0); 
            const point = path.getPointAt(Math.min(pos, 1));
            if (ref.current) ref.current.position.copy(point);
        } else {
            onFinish();
        }
    });

    if (pos >= 1) return null;

    return (
        <group>
            {/* Noyau du signal */}
            <mesh ref={ref}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color="#fcd34d" toneMapped={false} />
                <pointLight intensity={3} distance={4} color="#fbbf24" decay={2} />
            </mesh>
            {/* Traînée lumineuse */}
            <Trail width={0.6} length={4} color="#fbbf24" attenuation={(t) => t * t}>
                <mesh position={[0,0,0]} />
            </Trail>
        </group>
    );
};

// --- GAINE DE MYÉLINE (Segments) ---
const MyelinSheath = ({ curve }: { curve: THREE.CatmullRomCurve3 }) => {
    // On divise la courbe en segments
    const segments = 5;
    return (
        <group>
            {Array.from({ length: segments }).map((_, i) => {
                // On calcule la position le long de la courbe pour chaque segment
                // C'est une approximation visuelle pour l'effet "saucisse"
                const t = (i + 0.5) / segments;
                const pos = curve.getPointAt(t);
                const tangent = curve.getTangentAt(t);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

                return (
                    <mesh key={i} position={pos} quaternion={quaternion} scale={[1, 1.2, 1]}>
                        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                        <meshStandardMaterial color="#fef3c7" roughness={0.3} /> {/* Couleur crème/gras */}
                    </mesh>
                );
            })}
        </group>
    );
};

// --- STRUCTURE DU NEURONE ---
const NeuronStructure = ({ curve }: { curve: THREE.CatmullRomCurve3 }) => {
    return (
        <group>
            {/* AXONE (Câble central) */}
            <Tube args={[curve, 64, 0.15, 8, false]}>
                <meshStandardMaterial color="#94a3b8" />
            </Tube>

            {/* MYÉLINE */}
            <MyelinSheath curve={curve} />

            {/* CORPS CELLULAIRE (Soma) - Forme Organique */}
            <group position={[-5, 0, 0]}>
                <Sphere args={[1.8, 32, 32]} scale={[1, 0.8, 1]}>
                    <meshStandardMaterial color="#60a5fa" roughness={0.5} />
                </Sphere>
                {/* Noyau */}
                <Sphere args={[0.6]} position={[0, 0, 0.5]}>
                    <meshStandardMaterial color="#1e3a8a" />
                </Sphere>
                
                {/* Dendrites (Branches) */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 8]}>
                        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, 0.5]}>
                            <cylinderGeometry args={[0.05, 0.3, 2]} />
                            <meshStandardMaterial color="#60a5fa" />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* TERMINAISON SYNAPTIQUE (Arborisation terminale) */}
            <group position={[5, 0, 0]}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
                        <mesh position={[1, 0, 0]} rotation={[0, 0, -1]}>
                            <cylinderGeometry args={[0.05, 0.1, 2]} />
                            <meshStandardMaterial color="#60a5fa" />
                        </mesh>
                        <Sphere args={[0.3]} position={[2, 0, 0]}>
                            <meshStandardMaterial color="#fcd34d" /> {/* Bouton synaptique */}
                        </Sphere>
                    </group>
                ))}
            </group>

            {/* LABELS FLOTTANTS */}
            <Html position={[-5, 2.5, 0]} center>
                <div className="bg-blue-900/80 text-blue-100 text-xs px-2 py-1 rounded backdrop-blur border border-blue-700">
                    Soma (Corps)
                </div>
            </Html>
            <Html position={[0, 2, 0]} center>
                <div className="bg-yellow-900/80 text-yellow-100 text-xs px-2 py-1 rounded backdrop-blur border border-yellow-700">
                    Axone Myélinisé
                </div>
            </Html>
            <Html position={[5, 2.5, 0]} center>
                <div className="bg-purple-900/80 text-purple-100 text-xs px-2 py-1 rounded backdrop-blur border border-purple-700">
                    Synapses
                </div>
            </Html>
        </group>
    );
};

export default function Neuron3D({ isFiring, onSignalEnd }: { isFiring: boolean, onSignalEnd: () => void }) {
    // Forme de l'axone (Légèrement courbée pour faire naturel)
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(-2.5, 0.2, 0),
            new THREE.Vector3(0, -0.2, 0),
            new THREE.Vector3(2.5, 0.2, 0),
            new THREE.Vector3(5, 0, 0)
        ]);
    }, []);

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
            <color attach="background" args={['#0f172a']} /> {/* Fond sombre */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, 5, 0]} color="#3b82f6" intensity={0.5} />

            {/* Particules d'ambiance (Cytoplasme/Milieu extra-cellulaire) */}
            <Stars radius={50} depth={50} count={200} factor={2} saturation={0} fade speed={1} />

            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <NeuronStructure curve={curve} />
            </Float>

            {isFiring && (
                <NerveImpulse path={curve} onFinish={onSignalEnd} />
            )}

            <OrbitControls enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI - Math.PI/4} />
        </Canvas>
    );
}