"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, Html, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- BÉBÉ (Schématique) ---
const Fetus = ({ position, rotation }: any) => (
    <group position={position} rotation={rotation}>
        {/* Tête */}
        <Sphere args={[1.4, 32, 32]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color="#fca5a5" />
        </Sphere>
        {/* Corps */}
        <Sphere args={[1.3, 32, 32]} position={[0, 1.5, 0]} scale={[1, 1.2, 0.8]}>
            <meshStandardMaterial color="#fca5a5" />
        </Sphere>
        {/* Membres repliés */}
        <Sphere args={[0.5]} position={[0.8, 1, 0.5]}><meshStandardMaterial color="#fca5a5" /></Sphere>
        <Sphere args={[0.5]} position={[-0.8, 1, 0.5]}><meshStandardMaterial color="#fca5a5" /></Sphere>
    </group>
);

// --- UTÉRUS (Muscle) ---
const Uterus = ({ contractionIntensity, cervixOpening }: any) => {
    const muscleRef = useRef<THREE.Mesh>(null);
    
    // Animation de pulsation (Contraction)
    useFrame((state) => {
        if(muscleRef.current && contractionIntensity > 20) {
            const speed = contractionIntensity / 10;
            const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.02;
            muscleRef.current.scale.set(scale, scale, scale);
        }
    });

    // Couleur change selon l'intensité (Rose -> Rouge vif)
    const color = contractionIntensity > 50 ? "#dc2626" : "#f472b6";

    return (
        <group>
            {/* Paroi utérine (Haut) */}
            <mesh ref={muscleRef} position={[0, 2, 0]}>
                <sphereGeometry args={[3.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                <meshStandardMaterial 
                    color={color} 
                    side={THREE.DoubleSide} 
                    transparent opacity={0.6} // Translucide pour voir le bébé
                    roughness={0.2}
                />
            </mesh>

            {/* Col de l'utérus (Cervix) - S'ouvre */}
            {/* L'ouverture est simulée par le rayon interne du tore */}
            <mesh position={[0, -1.5, 0]} rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[1.5, 1.5 - (cervixOpening/10), 16, 32]} /> 
                {/* Plus cervixOpening est grand, plus le tube est fin (ouverture large) */}
                <meshStandardMaterial color="#be185d" />
            </mesh>
        </group>
    );
};

export default function Childbirth3D({ config }: { config: any }) {
    const contraction = config?.contractionIntensity || 0;
    const opening = config?.cervixOpening || 0;
    const babyY = -config?.babyPosition / 30; // Descente

    return (
        <div className="w-full h-[600px] bg-pink-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-4 border-pink-200 dark:border-pink-900">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} intensity={1} />
                
                <group position={[0, 0, 0]}>
                    <Uterus contractionIntensity={contraction} cervixOpening={opening} />
                    <Fetus position={[0, 1 + babyY, 0]} rotation={[Math.PI, 0, 0]} /> {/* Tête en bas */}
                </group>

                {/* Indicateurs visuels */}
                <Html position={[3, 2, 0]}>
                    <div className="bg-white/80 p-2 rounded text-xs font-bold shadow text-pink-600">
                        Contractions: {contraction}%
                    </div>
                </Html>
                <Html position={[3, -1.5, 0]}>
                    <div className="bg-white/80 p-2 rounded text-xs font-bold shadow text-purple-600">
                        Dilatation: {opening} cm
                    </div>
                </Html>

                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/1.5} />
            </Canvas>
        </div>
    );
}