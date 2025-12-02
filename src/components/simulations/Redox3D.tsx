"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, OrbitControls, Tube } from '@react-three/drei';
import * as THREE from 'three';

const Electrode = ({ position, color, label, isAnode, active }: any) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (active && isAnode && ref.current) {
            // L'anode se ronge (rétrécit)
            ref.current.scale.x = Math.max(0.8, ref.current.scale.x - delta * 0.005);
            ref.current.scale.z = Math.max(0.8, ref.current.scale.z - delta * 0.005);
        }
    });

    return (
        <group position={position}>
            <mesh ref={ref}>
                <boxGeometry args={[1, 4, 0.5]} />
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
            </mesh>
            <Html position={[0, 2.5, 0]} center>
                <div className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-black border">{label}</div>
            </Html>
        </group>
    );
};

const Electrons = ({ active }: { active: boolean }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (active && group.current) {
            // Mouvement Zn -> Cu (Gauche vers Droite)
            group.current.children.forEach((el: any) => {
                el.position.x += delta * 2;
                if (el.position.x > 3) el.position.x = -3;
            });
        }
    });

    if (!active) return null;
    return (
        <group position={[0, 3, 0]} ref={group}>
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[-3 + i*1.5, 0, 0]}>
                    <sphereGeometry args={[0.15]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
            ))}
        </group>
    );
};

export default function Redox3D({ config }: { config: any }) {
    const connected = config?.electronFlow !== "Aucun";

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Béchers */}
                <group position={[-2, -1, 0]}>
                    <Cylinder args={[1.5, 1.5, 3, 32, 1, true]} material-color="white" material-transparent material-opacity={0.3} />
                    <Cylinder args={[1.4, 1.4, 2.5, 32]} position={[0, -0.2, 0]} material-color="#e0f2fe" material-transparent material-opacity={0.6} /> {/* ZnSO4 Incolore */}
                    <Electrode position={[0, 1, 0]} color="#94a3b8" label="Zinc (Anode -)" isAnode={true} active={connected} />
                </group>

                <group position={[2, -1, 0]}>
                    <Cylinder args={[1.5, 1.5, 3, 32, 1, true]} material-color="white" material-transparent material-opacity={0.3} />
                    <Cylinder args={[1.4, 1.4, 2.5, 32]} position={[0, -0.2, 0]} material-color="#3b82f6" material-transparent material-opacity={0.6} /> {/* CuSO4 Bleu */}
                    <Electrode position={[0, 1, 0]} color="#b45309" label="Cuivre (Cathode +)" isAnode={false} active={connected} />
                </group>

                {/* Pont Salin */}
                <mesh position={[0, 0, 0]} rotation={[0,0,Math.PI/2]}>
                    <torusGeometry args={[2, 0.2, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#fcd34d" />
                </mesh>

                {/* Fil électrique */}
                <mesh position={[0, 3, 0]} rotation={[0,0,Math.PI/2]}>
                    <cylinderGeometry args={[0.05, 0.05, 6]} />
                    <meshStandardMaterial color="black" />
                </mesh>

                {/* Voltmètre */}
                <group position={[0, 4, 0]}>
                    <Box args={[1.5, 1, 0.5]} material-color="#333" />
                    <Html position={[0, 0, 0.3]} center transform>
                        <div className="text-red-500 font-mono font-bold text-xl bg-black px-1">{config?.voltage || "0.00"} V</div>
                    </Html>
                </group>

                <Electrons active={connected} />

                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
}