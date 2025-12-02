"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, Trail, OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const Electron = ({ radius, speed, offset }: any) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if(ref.current) {
            const t = state.clock.elapsedTime * speed + offset;
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.z = Math.sin(t) * radius;
        }
    });
    return (
        <group>
            {/* Orbite visuelle */}
            <mesh rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 16, 64]} />
                <meshBasicMaterial color="#334155" transparent opacity={0.5} />
            </mesh>
            {/* L'électron */}
            <mesh ref={ref}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

export default function AtomConfig3D({ config }: { config: any }) {
    const shells = config?.shells || [];
    // Rayons des couches : K=2, L=3.5, M=5
    const radii = [2, 3.5, 5];

    return (
        <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden border-4 border-gray-800 relative">
            <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Stars radius={50} />

                {/* NOYAU */}
                <group>
                    <Sphere args={[0.8, 32, 32]}>
                        <meshStandardMaterial color="#ef4444" roughness={0.2} />
                    </Sphere>
                    <Html position={[0, -1.2, 0]} center>
                        <div className="text-red-500 font-bold text-xs bg-black/50 px-2 rounded">{config?.name || "Atome"}</div>
                    </Html>
                </group>

                {/* ÉLECTRONS PAR COUCHE */}
                {shells.map((count: number, layerIndex: number) => (
                    <group key={layerIndex} rotation={[Math.random(), Math.random(), 0]}> 
                        {Array.from({ length: count }).map((_, i) => (
                            <Electron 
                                key={i} 
                                radius={radii[layerIndex]} 
                                speed={0.5 + (2 - layerIndex)*0.2} 
                                offset={(i / count) * Math.PI * 2} 
                            />
                        ))}
                    </group>
                ))}

                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    );
}