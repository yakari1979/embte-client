"use client";
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// AJOUT DE OrbitControls DANS LA LISTE DES IMPORTS ICI
import { Sphere, Cylinder, Html, Stars, Float, Line, OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

// --- CELLULE GÉNÉRIQUE (LB ou LT) ---
const Lymphocyte = ({ position, color, type, scale = 1 }: any) => {
    return (
        <group position={position} scale={[scale, scale, scale]}>
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.4} 
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </Sphere>
            {/* Noyau */}
            <Sphere args={[0.4]} position={[0.2, 0.2, 0]}>
                <meshStandardMaterial color="#4c1d95" />
            </Sphere>
            {/* Récepteurs membranaires */}
            {Array.from({ length: 6 }).map((_, i) => (
                <group key={i} rotation={[Math.random()*Math.PI, Math.random()*Math.PI, 0]}>
                    <mesh position={[0, 1, 0]}>
                        {type === 'HUMORAL' ? (
                            <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                        ) : (
                            <boxGeometry args={[0.2, 0.5, 0.2]} />
                        )}
                        <meshStandardMaterial color="#fbbf24" />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// --- SCÈNE 1 : DÉTECTION ---
const RecognitionScene = ({ type, targetPos }: { type: string, targetPos: any }) => {
    const cellRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(cellRef.current) {
            const target = new THREE.Vector3(targetPos[0] - 2.5, targetPos[1], targetPos[2]);
            cellRef.current.position.lerp(target, 0.05);
        }
    });

    const color = type === 'HUMORAL' ? '#eab308' : '#3b82f6';

    return (
        <group>
            <Lymphocyte 
                ref={cellRef} 
                position={[-6, 0, 0]} 
                color={color} 
                type={type} 
            />
            <Html position={[-1, 2, 0]} center>
                <div className="bg-green-600/90 text-white text-xs px-2 py-1 rounded animate-pulse whitespace-nowrap backdrop-blur-sm border border-green-400">
                    Reconnaissance Spécifique !
                </div>
            </Html>
        </group>
    );
};

// --- SCÈNE 2 : MULTIPLICATION ---
// Sous-composant pour animer l'apparition d'un clone
const CloneCell = ({ position, color, type, delay }: any) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(ref.current) {
            const time = state.clock.elapsedTime;
            let scale = Math.max(0, Math.min(1, (time - delay) * 2)); // Effet Pop
            scale = scale === 1 ? 1 + Math.sin(time * 5) * 0.05 : scale; // Respiration
            ref.current.scale.set(scale, scale, scale);
        }
    });
    return (
        <group ref={ref}>
            <Lymphocyte position={position} color={color} type={type} />
        </group>
    );
}

const ExpansionScene = ({ type }: { type: string }) => {
    const color = type === 'HUMORAL' ? '#eab308' : '#3b82f6';
    
    const clones = useMemo(() => Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return {
            x: Math.cos(angle) * 2.5,
            y: Math.sin(angle) * 2.5,
            delay: i * 0.5 // Apparition séquentielle
        };
    }), []);

    return (
        <group>
            <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
                <div className="text-white font-bold bg-black/60 px-3 py-1 rounded border border-white/20 backdrop-blur-md">
                    Mitoses (Clonage)
                </div>
            </Html>
            {clones.map((clone, i) => (
                <CloneCell key={i} position={[clone.x, clone.y, 0]} color={color} type={type} delay={clone.delay} />
            ))}
        </group>
    );
};

// --- SCÈNE 3 : ACTION ---
const Antibody = ({ position, targetPosition, active }: any) => {
    const group = useRef<THREE.Group>(null);
    useFrame(() => {
        if (active && group.current) {
            group.current.position.lerp(new THREE.Vector3(...targetPosition), 0.08);
            group.current.lookAt(new THREE.Vector3(...targetPosition));
        }
    });
    if (!active) return null;
    return (
        <group ref={group} position={position} scale={0.4}>
            <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.1,0.1,1]} /><meshStandardMaterial color="#fbbf24"/></mesh>
            <mesh position={[-0.3,0,-0.5]} rotation={[Math.PI/4,0,0]}><cylinderGeometry args={[0.1,0.1,0.8]} /><meshStandardMaterial color="#fbbf24"/></mesh>
            <mesh position={[0.3,0,-0.5]} rotation={[-Math.PI/4,0,0]}><cylinderGeometry args={[0.1,0.1,0.8]} /><meshStandardMaterial color="#fbbf24"/></mesh>
        </group>
    );
};

const Virus = ({ position, neutralized }: any) => (
    <group position={position}>
        <Sphere args={[0.5]}><meshStandardMaterial color={neutralized ? "#9ca3af" : "#ef4444"} /></Sphere>
        {Array.from({length:6}).map((_,i)=><mesh key={i} rotation={[i,i,0]}><cylinderGeometry args={[0.05,0.05,1.2]}/><meshStandardMaterial color="#7f1d1d"/></mesh>)}
    </group>
);

const ActionScene = ({ type, config }: any) => {
    const virusPositions: [number, number, number][] = [[2, 1, 0], [3, -1, 1], [1, 0, -2]];
    
    const ltRef = useRef<THREE.Group>(null);
    const perforins = useMemo(() => Array.from({length: 15}).map(() => ({x: Math.random(), y: Math.random()-0.5})), []);
    
    useFrame((state, delta) => {
        if(ltRef.current && type === 'CELLULAR') ltRef.current.position.lerp(new THREE.Vector3(-2,0,0), delta);
    });

    return (
        <group>
            {type === 'HUMORAL' ? (
                <>
                    {/* Plasmocyte */}
                    <Lymphocyte position={[-4, 0, 0]} color="#eab308" type="HUMORAL" scale={1.2} />
                    {/* Cibles */}
                    {virusPositions.map((pos, i) => <Virus key={i} position={pos} neutralized={config.targetState === 'NEUTRALIZED'} />)}
                    {/* Anticorps */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Antibody 
                            key={i} 
                            position={[-4 + Math.random(), Math.random()*2-1, Math.random()*2]} 
                            targetPosition={virusPositions[i % 3]} 
                            active={true} 
                        />
                    ))}
                </>
            ) : (
                <>
                    {/* LT Tueur */}
                    <group ref={ltRef} position={[-5, 0, 0]}>
                        <Lymphocyte position={[0,0,0]} color="#3b82f6" type="CELLULAR" />
                        {/* Perforines */}
                        {config.killerActive && perforins.map((p, i) => (
                            <mesh key={i} position={[2 + p.x*3, p.y, 0]}>
                                <sphereGeometry args={[0.05]} />
                                <meshBasicMaterial color="cyan" />
                            </mesh>
                        ))}
                    </group>
                    {/* Cellule Cible */}
                    <group position={[3, 0, 0]}>
                        <Sphere args={[1.8]} scale={config.targetState === 'LYSED' ? 0.1 : 1}>
                            <meshStandardMaterial color={config.targetState === 'LYSED' ? '#1f2937' : '#10b981'} wireframe={config.targetState === 'LYSED'} />
                        </Sphere>
                        {config.targetState === 'LYSED' && <Html center><div className="text-red-500 font-black text-2xl bg-black/50 p-2 rounded">LYSE</div></Html>}
                    </group>
                </>
            )}
        </group>
    );
};


// --- COMPOSANT PRINCIPAL ---
export default function SpecificImmunity3D({ type, config, stageName }: { type: string, config: any, stageName: string }) {
    
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={50} />

            {/* AFFICHER LA BONNE SCÈNE SELON L'ÉTAPE */}
            
            {stageName === 'RECOGNITION' && (
                <RecognitionScene type={type} targetPos={[3, 0, 0]} />
            )}

            {stageName === 'EXPANSION' && (
                <ExpansionScene type={type} />
            )}

            {stageName === 'ACTION' && (
                <ActionScene type={type} config={config} />
            )}

            {/* Cible statique pour l'étape 1 (Recognition) pour donner un but au lymphocyte */}
            {stageName === 'RECOGNITION' && (
                type === 'HUMORAL' 
                ? <Virus position={[3, 0, 0]} neutralized={false} />
                : <group position={[3,0,0]}><Sphere args={[1.5]}><meshStandardMaterial color="#10b981" wireframe/></Sphere></group>
            )}

            <OrbitControls />
        </Canvas>
    );
}