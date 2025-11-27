"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Tube, Html, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Le Signal électrique (Boule lumineuse)
const NerveImpulse = ({ path, onFinish }: { path: THREE.CatmullRomCurve3, onFinish: () => void }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [pos, setPos] = useState(0);

    useFrame((state, delta) => {
        if (pos < 1) {
            // Avance le long de la courbe
            setPos((p) => p + delta * 1.5); // Vitesse du signal
            const point = path.getPointAt(Math.min(pos, 1));
            if (ref.current) ref.current.position.copy(point);
        } else {
            onFinish();
        }
    });

    if (pos >= 1) return null;

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ffff00" toneMapped={false} />
            <pointLight intensity={2} distance={5} color="#ffff00" />
        </mesh>
    );
};

// Le Neurone (Structure)
const NeuronStructure = ({ curve }: { curve: THREE.CatmullRomCurve3 }) => {
    return (
        <group>
            {/* Corps Cellulaire (Soma) */}
            <Sphere args={[1.5, 32, 32]} position={[-5, 0, 0]}>
                <meshStandardMaterial color="#60a5fa" roughness={0.4} />
            </Sphere>
            <Html position={[-5, 2, 0]} center><div className="text-xs text-white bg-black/50 px-2 rounded">Corps Cellulaire</div></Html>

            {/* Noyau */}
            <Sphere args={[0.5, 16, 16]} position={[-5, 0, 0]}>
                <meshStandardMaterial color="#1d4ed8" />
            </Sphere>

            {/* Dendrites (Petits tubes autour du corps) */}
            {[0, 1, 2, 3, 4].map(i => (
                <mesh key={i} position={[-5, 0, 0]} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
                    <cylinderGeometry args={[0.1, 0.2, 4]} />
                    <meshStandardMaterial color="#60a5fa" />
                </mesh>
            ))}

            {/* Axone (Le tube long) */}
            <Tube args={[curve, 64, 0.4, 8, false]}>
                <meshStandardMaterial color="#93c5fd" transparent opacity={0.8} />
            </Tube>
            <Html position={[0, 1, 0]} center><div className="text-xs text-white bg-black/50 px-2 rounded">Axone</div></Html>

            {/* Terminaison Synaptique */}
            <Sphere args={[0.8, 16, 16]} position={[5, 0, 0]}>
                <meshStandardMaterial color="#60a5fa" />
            </Sphere>
            <Html position={[5, 2, 0]} center><div className="text-xs text-white bg-black/50 px-2 rounded">Synapse</div></Html>
        </group>
    );
};

export default function Neuron3D({ isFiring, onSignalEnd }: { isFiring: boolean, onSignalEnd: () => void }) {
    // Création de la forme de l'axone (courbe)
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(-2, 0.5, 0),
            new THREE.Vector3(2, -0.5, 0),
            new THREE.Vector3(5, 0, 0)
        ]);
    }, []);

    return (
        <div className="w-full h-[400px] bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-700">
            <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                
                <NeuronStructure curve={curve} />

                {/* Si le neurone tire, on lance l'animation du signal */}
                {isFiring && (
                    <NerveImpulse path={curve} onFinish={onSignalEnd} />
                )}

                <OrbitControls enableZoom={false} />
            </Canvas>
            {/* <div className="absolute bottom-2 right-2 text-white/30 text-xs">Visualisation simplifiée</div> */}
        </div>
    );
}