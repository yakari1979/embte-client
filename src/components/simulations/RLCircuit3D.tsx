"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder, Box, Html, OrbitControls, Tube, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- BOBINE (Inductance) ---
const Inductor = ({ energyPercent }: { energyPercent: number }) => {
    // La bobine rougit quand elle stocke de l'énergie magnétique
    const intensity = energyPercent / 100;
    const coilColor = new THREE.Color("#b45309").lerp(new THREE.Color("#ef4444"), intensity);
    const glowIntensity = intensity * 2;

    const curve = useMemo(() => {
        const points = [];
        for (let i = 0; i < 80; i++) {
            const angle = 0.8 * i;
            const x = Math.cos(angle) * 1.2;
            const y = (i - 40) * 0.08;
            const z = Math.sin(angle) * 1.2;
            points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    return (
        <group rotation={[0, 0, Math.PI/2]} position={[0, 3, 0]}>
            <Tube args={[curve, 64, 0.1, 8, false]}>
                <meshStandardMaterial 
                    color={coilColor} 
                    emissive="#ef4444" 
                    emissiveIntensity={glowIntensity}
                    metalness={0.6} 
                    roughness={0.2} 
                />
            </Tube>
            {/* Noyau de fer doux (optionnel, améliore L) */}
            <Cylinder args={[1, 1, 6.5, 32]} rotation={[Math.PI/2, 0, 0]}>
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Html position={[0, -2, 0]} distanceFactor={8}>
                <div className="bg-black/60 text-white px-2 py-1 rounded text-xs border border-white/20">Bobine (L)</div>
            </Html>
        </group>
    );
};

// --- LAMPE TÉMOIN (Résistance visuelle) ---
const Lamp = ({ currentPercent }: { currentPercent: number }) => {
    const intensity = currentPercent / 100;
    return (
        <group position={[4, 0, 0]}>
            {/* Ampoule */}
            <Sphere args={[1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial 
                    color="#fef3c7" 
                    emissive="#fbbf24" 
                    emissiveIntensity={intensity * 3} 
                    transparent opacity={0.4 + intensity*0.6}
                />
            </Sphere>
            {/* Culot */}
            <Cylinder args={[0.4, 0.4, 0.5]} position={[0, -0.5, 0]} material-color="grey" />
            
            <Html position={[0, 2, 0]} center>
                <div className={`text-xs font-bold px-2 py-1 rounded ${intensity > 0.5 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                    {Math.round(intensity * 100)}% Lum.
                </div>
            </Html>
        </group>
    );
};

// --- FLUX D'ÉLECTRONS ---
const ElectronFlow = ({ speed }: { speed: number }) => {
    // speed vient de l'intensité (0 à 100 approx)
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (ref.current && speed > 1) {
            // Rotation du groupe pour simuler le circuit
            ref.current.rotation.z -= delta * (speed / 50); 
        }
    });

    const particles = useMemo(() => Array.from({length: 20}).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        // On les place sur un cercle fictif pour l'animation simple
        return (
            <mesh key={i} position={[Math.cos(angle)*4, Math.sin(angle)*3, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
        )
    }), []);

    return <group ref={ref}>{particles}</group>;
};

export default function RLCircuit3D({ config }: { config: any }) {
    const percent = parseFloat(config?.percent || "0");
    // L'énergie magnétique est proportionnelle au carré du courant, mais on utilise percent pour simplifier l'effet visuel
    
    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Circuit Fil */}
                <mesh rotation={[Math.PI/2, 0, 0]}>
                    <torusGeometry args={[4, 0.05, 8, 4]} /> {/* Rectangle */}
                    <meshStandardMaterial color="silver" />
                </mesh>

                {/* Composants */}
                <Inductor energyPercent={percent} />
                <Lamp currentPercent={percent} />
                
                {/* Générateur */}
                <group position={[-4, 0, 0]}>
                    <Box args={[2, 3, 1]} material-color="#334155" />
                    <Text position={[0, 0, 0.6]} fontSize={0.8} color="white">G</Text>
                </group>

                {/* Électrons */}
                <ElectronFlow speed={percent} />

                <OrbitControls enableZoom={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}