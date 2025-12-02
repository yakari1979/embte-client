"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, Cylinder, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Atom = ({ pos, color, size, label }: any) => (
    <group position={pos}>
        <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial color={color} roughness={0.1} />
        </Sphere>
        {label && <Html position={[0, size + 0.2, 0]} center><div className="text-xs font-bold text-white bg-black/50 px-1 rounded">{label}</div></Html>}
    </group>
);

const Bond = ({ start, end, double = false }: any) => {
    const mid = new THREE.Vector3().addVectors(new THREE.Vector3(...start), new THREE.Vector3(...end)).multiplyScalar(0.5);
    const len = new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end));
    
    // Orientation du cylindre
    const orientation = new THREE.Matrix4().lookAt(new THREE.Vector3(...start), new THREE.Vector3(...end), new THREE.Vector3(0,1,0));
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);

    return (
        <group position={mid as any} quaternion={quaternion}>
            {double ? (
                <>
                    <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, len, 8]} />
                        <meshStandardMaterial color="white" />
                    </mesh>
                    <mesh position={[-0.1, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, len, 8]} />
                        <meshStandardMaterial color="white" />
                    </mesh>
                </>
            ) : (
                <mesh rotation={[0, Math.PI/2, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, len, 8]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            )}
        </group>
    );
};

export default function VSEPR3D({ config }: { config: any }) {
    const type = config?.geometryType; // LINEAR, TRIGONAL, TETRAHEDRAL...

    // Positions prédéfinies
    let atoms: any[] = [];
    if (type === 'LINEAR') { // CO2 like
        atoms = [[2,0,0], [-2,0,0]];
    } else if (type === 'TRIGONAL') { // BF3 like
        atoms = [[2,0,0], [-1, 1.73, 0], [-1, -1.73, 0]];
    } else if (type === 'TETRAHEDRAL') { // CH4 like
        atoms = [[0, 2, 0], [1.88, -0.66, 0], [-0.94, -0.66, 1.63], [-0.94, -0.66, -1.63]];
    } else if (type === 'BENT') { // H2O
        atoms = [[1.5, -1, 0], [-1.5, -1, 0]]; // + 2 doublets non liants invisibles en haut
    } else if (type === 'PYRAMIDAL') { // NH3
        atoms = [[1.5, -1, 1], [-1.5, -1, 1], [0, -1, -1.5]]; 
    }

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <group position={[0, 0, 0]}>
                    {/* Atome Central (A) */}
                    <Atom pos={[0,0,0]} color="#ef4444" size={0.8} label="A" />
                    
                    {/* Atomes Périphériques (X) */}
                    {atoms.map((pos, i) => (
                        <React.Fragment key={i}>
                            <Atom pos={pos} color="#cbd5e1" size={0.5} label="X" />
                            <Bond start={[0,0,0]} end={pos} />
                        </React.Fragment>
                    ))}

                    {/* Doublets Non Liants (E) - Fantômes violets */}
                    {(type === 'BENT' || type === 'PYRAMIDAL') && (
                        <group position={[0, 1.5, 0]}>
                            {/* CORRECTION ICI : Props déplacées dans le matériel */}
                            <Sphere args={[0.4]}>
                                <meshStandardMaterial color="purple" transparent opacity={0.3} />
                            </Sphere>
                            <Html><div className="text-purple-400 text-xs">E (Doublet)</div></Html>
                        </group>
                    )}
                </group>

                <OrbitControls autoRotate />
            </Canvas>
        </div>
    );
}