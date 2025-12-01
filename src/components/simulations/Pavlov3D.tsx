"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, OrbitControls, Line, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Zone du cerveau (Sphère lumineuse)
const BrainArea = ({ position, color, label, active }: any) => (
    <group position={position}>
        <Sphere args={[0.5, 32, 32]}>
            <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={active ? 2 : 0.2} 
                transparent opacity={0.8}
            />
        </Sphere>
        <Html distanceFactor={10}>
            <div className={`text-xs px-2 py-1 rounded font-bold transition-all shadow-lg border border-white/20 whitespace-nowrap ${active ? 'bg-white text-black scale-110' : 'bg-black/60 text-white backdrop-blur-sm'}`}>
                {label}
            </div>
        </Html>
        {active && <pointLight distance={3} intensity={2} color={color} />}
    </group>
);

// Neurone/Connexion (Tube)
const NeuralPath = ({ start, end, active, isNewPath }: any) => {
    // CORRECTION ICI : On utilise 'any' pour la ref car le composant Line de Drei est complexe (Line2)
    const ref = useRef<any>(null);

    useFrame((state) => {
        if(active && ref.current) {
            // Accès direct au matériel de la ligne Drei
            if (ref.current.material) {
                // Animation de l'opacité (pulsation)
                ref.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
                // Important pour que Three.js prenne en compte le changement
                ref.current.material.needsUpdate = true;
            }
        }
    });

    return (
        <group>
            {/* Ligne principale */}
            <Line 
                ref={ref}
                points={[start, end]} 
                color={active ? (isNewPath ? "#facc15" : "#ffffff") : "#334155"} 
                lineWidth={active ? 3 : 1} 
                dashed={isNewPath && !active}
                transparent // Important pour l'opacité
                opacity={0.5}
            />
            
            {/* Si c'est la nouvelle voie de conditionnement */}
            {isNewPath && (
                <Html position={[(start[0]+end[0])/2, (start[1]+end[1])/2, 0]}>
                    <div className="text-[10px] font-bold text-yellow-400 bg-black/80 px-2 py-0.5 rounded border border-yellow-500/50 backdrop-blur-sm">
                        Liaison Temporaire
                    </div>
                </Html>
            )}
        </group>
    );
};

export default function Pavlov3D({ config }: { config: any }) {
    const posAuditory = [-2, 1, 0];  
    const posGustatory = [2, 1, 0];  
    const posMotor = [0, -2, 0];     

    const path = config?.brainPath || [];
    const activeAuditory = path.includes('AUDITORY');
    const activeGustatory = path.includes('GUSTATORY');
    const activeMotor = path.includes('MOTOR');
    const activeConnection = path.includes('CONNECTION');

    return (
        <div className="w-full h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 relative">
            <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
                <color attach="background" args={['#020617']} />
                
                {/* Ambiance */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Silhouette Cerveau */}
                <Sphere args={[3.8, 32, 32]} scale={[1, 0.8, 0.8]}>
                    <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.05} />
                </Sphere>

                {/* AIRES CÉRÉBRALES */}
                <BrainArea position={posAuditory} color="#3b82f6" label="1. Aire Auditive" active={activeAuditory} />
                <BrainArea position={posGustatory} color="#ef4444" label="2. Aire Gustative" active={activeGustatory} />
                <BrainArea position={posMotor} color="#22c55e" label="3. Aire Motrice (Bulbe)" active={activeMotor} />

                {/* VOIES NERVEUSES */}
                <NeuralPath start={posGustatory} end={posMotor} active={activeGustatory && activeMotor} isNewPath={false} />
                <NeuralPath start={posAuditory} end={posMotor} active={activeConnection} isNewPath={true} />

                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/1.5} />
            </Canvas>
            
            {/* Indicateur de Salivation (Feedback visuel fort) */}
            {config?.salivation && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                    <div className="text-4xl">💧</div>
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full font-bold shadow-lg text-sm mt-2 border-2 border-blue-400">
                        RÉPONSE SALIVAIRE
                    </div>
                </div>
            )}
            
            <div className="absolute top-4 left-4 text-xs text-gray-500 font-mono">
                CORTEX CÉRÉBRAL (Vue Schématique)
            </div>
        </div>
    );
}