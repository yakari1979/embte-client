"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- PHOTON & ÉLECTRON ---
const ParticleSystem = ({ lambda, intensity, isEjected, speed }: any) => {
    // Couleur du photon
    const getColor = (l: number) => {
        if (l < 400) return "#a855f7"; // UV (Violet)
        if (l < 500) return "#3b82f6"; // Bleu
        if (l < 600) return "#eab308"; // Jaune
        return "#ef4444"; // Rouge
    };
    const photonColor = getColor(lambda);

    const particles = useRef<THREE.Group>(null);
    const electronGroup = useRef<THREE.Group>(null);

    // Animation continue
    useFrame((state, delta) => {
        if (particles.current) {
            // Photons qui tombent
            particles.current.children.forEach((mesh: any) => {
                mesh.position.y -= delta * 10;
                if (mesh.position.y < 0) {
                    mesh.position.y = 10; // Reset en haut
                    mesh.position.x = (Math.random() - 0.5) * 4;
                    mesh.position.z = (Math.random() - 0.5) * 4;
                }
            });
        }

        if (electronGroup.current) {
            // Électrons qui partent (si éjectés)
            electronGroup.current.children.forEach((mesh: any) => {
                if (isEjected) {
                    mesh.visible = true;
                    mesh.position.y += delta * Math.max(2, speed / 100); // Vitesse dépendant de l'énergie cinétique
                    // Si atteint l'anode (haut)
                    if (mesh.position.y > 8) {
                        mesh.position.y = 0.2; // Reset sur la plaque
                        mesh.position.x = (Math.random() - 0.5) * 4;
                        mesh.position.z = (Math.random() - 0.5) * 4;
                    }
                } else {
                    mesh.visible = false;
                }
            });
        }
    });

    // Création des particules
    const photonCount = Math.floor(intensity / 2);
    
    // Tableaux statiques pour React keys
    const photonArr = useMemo(() => Array.from({length: 50}), []); 
    const electronArr = useMemo(() => Array.from({length: 50}), []);

    return (
        <group>
            {/* Pluie de Photons */}
            <group ref={particles}>
                {photonArr.slice(0, photonCount).map((_, i) => (
                    <mesh key={i} position={[(Math.random()-0.5)*4, Math.random()*10, (Math.random()-0.5)*4]}>
                        <sphereGeometry args={[0.08]} />
                        <meshBasicMaterial color={photonColor} />
                    </mesh>
                ))}
            </group>

            {/* Électrons Éjectés */}
            <group ref={electronGroup}>
                {electronArr.slice(0, photonCount).map((_, i) => (
                    <mesh key={i} position={[0, 0, 0]} visible={false}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="#fbbf24" /> {/* Electron doré/jaune */}
                    </mesh>
                ))}
            </group>
        </group>
    );
};

export default function Photoelectric3D({ config, wavelength, intensity }: any) {
    const isEjected = config?.isEjected || false;
    const speed = parseFloat(config?.electronVelocity || "0");

    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 relative">
            <Canvas camera={{ position: [8, 5, 8], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Cathode (Plaque Métal) */}
                <Box args={[6, 0.2, 6]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                </Box>
                <Html position={[3.5, 0, 0]}><div className="text-gray-400 text-xs font-bold">CATHODE (Métal)</div></Html>

                {/* Anode (Collecteur) - CORRECTION ICI */}
                <group position={[0, 8, 0]}>
                    <Box args={[6, 0.2, 6]}>
                        {/* On met les props de transparence dans le matériel */}
                        <meshStandardMaterial color="#475569" transparent opacity={0.5} />
                    </Box>
                    <Html position={[3.5, 0, 0]}><div className="text-gray-400 text-xs font-bold">ANODE</div></Html>
                </group>

                {/* Particules */}
                <ParticleSystem 
                    lambda={wavelength} 
                    intensity={intensity} 
                    isEjected={isEjected} 
                    speed={speed} 
                />

                {/* Ampèremètre */}
                <group position={[-5, 4, 0]} rotation={[0, Math.PI/2, 0]}>
                    <Box args={[3, 3, 1]} material-color="#000" />
                    <Html position={[0, 0, 0.6]} transform center>
                        <div className={`font-mono text-2xl font-bold ${isEjected ? 'text-green-500' : 'text-red-500'}`}>
                            {isEjected ? (intensity * 0.5).toFixed(1) : "0.0"} µA
                        </div>
                    </Html>
                </group>

                <OrbitControls />
            </Canvas>
        </div>
    );
}