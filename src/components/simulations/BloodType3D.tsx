"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Cone, Box, OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- ANTIGÈNES (Marqueurs de surface) ---
const AntigenA = ({ position, rotation }: any) => (
    // Antigène A = Pyramide/Cône (Bleu)
    <group position={position} rotation={rotation}>
        <Cone args={[0.15, 0.4, 4]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#3b82f6" />
        </Cone>
        <Cylinder args={[0.05, 0.05, 0.2]} position={[0, 0, 0]} material-color="white"/>
    </group>
);

const AntigenB = ({ position, rotation }: any) => (
    // Antigène B = Sphère (Jaune)
    <group position={position} rotation={rotation}>
        <Sphere args={[0.15]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#eab308" />
        </Sphere>
        <Cylinder args={[0.05, 0.05, 0.2]} position={[0, 0, 0]} material-color="white"/>
    </group>
);

const AntigenRh = ({ position, rotation }: any) => (
    // Antigène Rh = Cube (Vert)
    <group position={position} rotation={rotation}>
        <Box args={[0.25, 0.25, 0.25]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#22c55e" />
        </Box>
        <Cylinder args={[0.05, 0.05, 0.2]} position={[0, 0, 0]} material-color="white"/>
    </group>
);

// --- GLOBULE ROUGE ---
const RedBloodCell = ({ antigens }: { antigens: string[] }) => {
    // Forme biconcave approximée par une sphère écrasée avec une distorsion
    // Pour simplifier ici, on utilise un Tore aplati
    return (
        <group>
            {/* Corps du globule */}
            <mesh scale={[1, 1, 0.4]}>
                <torusGeometry args={[1.5, 0.8, 32, 64]} />
                <meshPhysicalMaterial 
                    color="#ef4444" 
                    roughness={0.2} 
                    clearcoat={0.5} 
                    clearcoatRoughness={0.1}
                />
            </mesh>
            {/* Centre rempli (pour pas faire un donut vide) */}
            <mesh scale={[1, 1, 0.2]}>
                <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
                <meshStandardMaterial color="#dc2626" />
            </mesh>

            {/* Placement des Antigènes sur la surface */}
            {/* On en place 8 autour */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x = Math.cos(angle) * 2.3;
                const y = Math.sin(angle) * 2.3;
                
                // On alterne les antigènes présents
                const antigenType = antigens[i % antigens.length];
                
                if (!antigenType) return null; // Groupe O- (pas d'antigènes)

                return (
                    <group key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI/2]}>
                        {antigenType === 'A' && <AntigenA rotation={[0,0,0]} position={[0,0,0]} />}
                        {antigenType === 'B' && <AntigenB rotation={[0,0,0]} position={[0,0,0]} />}
                        {antigenType === 'Rh' && <AntigenRh rotation={[0,0,0]} position={[0,0,0]} />}
                    </group>
                )
            })}
        </group>
    );
};

export default function BloodType3D({ data }: { data: any }) {
    const antigens = data?.antigens || [];

    return (
        <Canvas camera={{ position: [0, 0, 6] }}>
            <color attach="background" args={['#f1f5f9']} /> {/* Fond laboratoire clair */}
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <RedBloodCell antigens={antigens} />
            </Float>

            <OrbitControls />
        </Canvas>
    );
}