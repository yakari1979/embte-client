"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, Cylinder, Html, OrbitControls } from '@react-three/drei';

// Atome Carbone (Noir), Hydrogène (Blanc), Méthyle (Gros Groupe)
const GroupCH3 = ({ position, rotation }: any) => (
    <group position={position} rotation={rotation}>
        <Sphere args={[0.6]} position={[0,0,0]}><meshStandardMaterial color="#333" /></Sphere>
        <Sphere args={[0.3]} position={[0.5,0.5,0.5]}><meshStandardMaterial color="white" /></Sphere>
        <Sphere args={[0.3]} position={[0.5,-0.5,-0.5]}><meshStandardMaterial color="white" /></Sphere>
        <Sphere args={[0.3]} position={[-0.8,0,0]}><meshStandardMaterial color="white" /></Sphere>
        <Html><div className="text-xs font-bold text-white bg-black/50 px-1 rounded">CH3</div></Html>
    </group>
);

const GroupH = ({ position }: any) => (
    <group position={position}>
        <Sphere args={[0.35]}><meshStandardMaterial color="white" /></Sphere>
        <Html><div className="text-xs text-gray-400">H</div></Html>
    </group>
);

export default function Isomer3D({ isZ }: { isZ: boolean }) {
    // But-2-ene : CH3-CH=CH-CH3
    // Carbone Central Gauche : [-1, 0, 0]
    // Carbone Central Droit : [1, 0, 0]
    
    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 relative">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <group position={[0,0,0]} rotation={[0, 0, 0]}>
                    {/* Double Liaison C=C */}
                    <mesh position={[0, 0.15, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.1, 0.1, 2]} />
                        <meshStandardMaterial color="gray" />
                    </mesh>
                    <mesh position={[0, -0.15, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.1, 0.1, 2]} />
                        <meshStandardMaterial color="gray" />
                    </mesh>

                    {/* Carbones Centraux */}
                    <Sphere args={[0.5]} position={[-1, 0, 0]}><meshStandardMaterial color="#333" /></Sphere>
                    <Sphere args={[0.5]} position={[1, 0, 0]}><meshStandardMaterial color="#333" /></Sphere>

                    {/* GAUCHE (Fixe) : CH3 en haut, H en bas */}
                    <mesh position={[-1.5, 1, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1.5]}/><meshStandardMaterial color="gray"/></mesh>
                    <GroupCH3 position={[-2, 1.5, 0]} />
                    
                    <mesh position={[-1.5, -1, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1.5]}/><meshStandardMaterial color="gray"/></mesh>
                    <GroupH position={[-1.8, -1.2, 0]} />

                    {/* DROITE (Variable selon Z/E) */}
                    {/* Si Z (Même coté) : CH3 en haut. Si E (Opposé) : CH3 en bas. */}
                    
                    {/* Liaison Haut */}
                    <mesh position={[1.5, 1, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1.5]}/><meshStandardMaterial color="gray"/></mesh>
                    {isZ ? <GroupCH3 position={[2, 1.5, 0]} /> : <GroupH position={[1.8, 1.2, 0]} />}

                    {/* Liaison Bas */}
                    <mesh position={[1.5, -1, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1.5]}/><meshStandardMaterial color="gray"/></mesh>
                    {isZ ? <GroupH position={[1.8, -1.2, 0]} /> : <GroupCH3 position={[2, -1.5, 0]} />}

                </group>

                <OrbitControls />
            </Canvas>
        </div>
    );
}