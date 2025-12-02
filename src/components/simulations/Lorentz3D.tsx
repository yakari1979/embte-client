"use client";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, OrbitControls, Html, Trail, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

// --- TRIÈDRE DE FRENET (Les vecteurs attachés) ---
const VectorTriad = ({ position, velocityDir, forceDir, bDir, show }: any) => {
    if (!show) return null;
    return (
        <group position={position}>
            {/* Vitesse (Bleu) */}
            <arrowHelper args={[velocityDir, new THREE.Vector3(0,0,0), 2, 0x3b82f6, 0.5, 0.3]} />
            <Html position={[velocityDir.x*2, velocityDir.y*2, 0]}>
                <div className="text-blue-500 font-bold text-xs bg-black/50 px-1 rounded">v</div>
            </Html>

            {/* Force (Rouge) */}
            <arrowHelper args={[forceDir, new THREE.Vector3(0,0,0), 2, 0xef4444, 0.5, 0.3]} />
            <Html position={[forceDir.x*2, forceDir.y*2, 0]}>
                <div className="text-red-500 font-bold text-xs bg-black/50 px-1 rounded">F</div>
            </Html>

            {/* Champ B (Vert) - Constant */}
            <arrowHelper args={[bDir, new THREE.Vector3(0,0,0), 2, 0x10b981, 0.5, 0.3]} />
            <Html position={[0, 0, 2]}>
                <div className="text-green-500 font-bold text-xs bg-black/50 px-1 rounded">B</div>
            </Html>
        </group>
    );
};

// --- PARTICULE ---
const ChargedParticle = ({ config, isAnimating }: any) => {
    const ref = useRef<THREE.Mesh>(null);
    const [time, setTime] = useState(0);
    
    // Vecteurs pour l'affichage
    const [vectors, setVectors] = useState({ v: new THREE.Vector3(1,0,0), f: new THREE.Vector3(0,1,0) });

    useFrame((state, delta) => {
        if (isAnimating && ref.current && config) {
            const t = time + delta;
            setTime(t);

            const R = config.radius;
            const w = (2 * Math.PI) / parseFloat(config.period);
            const direction = config.direction; 

            // Position (Cercle tangent à l'origine)
            // Centre du cercle à (0, -direction*R)
            const centerY = -direction * R;
            
            // Équations paramétriques décalées pour partir de (0,0) avec V0 = (v, 0)
            // Si t=0, x=0, y=0.
            const x = R * Math.sin(w * t);
            const y = centerY + (direction * R * Math.cos(w * t));

            ref.current.position.set(x, y, 0);

            // Calcul Vecteurs pour affichage
            // Vitesse est tangente au cercle
            const vx = Math.cos(w * t);
            const vy = -direction * Math.sin(w * t); // Dérivée
            const vDir = new THREE.Vector3(vx, vy, 0).normalize();

            // Force est centripète (vers le centre du cercle)
            // Centre est à (0, centerY, 0)
            const fDir = new THREE.Vector3(0 - x, centerY - y, 0).normalize();

            setVectors({ v: vDir, f: fDir });
        }
    });

    React.useEffect(() => { 
        setTime(0); 
        if(ref.current) ref.current.position.set(0,0,0); 
    }, [config]);

    const color = config?.direction === -1 ? "#ef4444" : "#3b82f6"; // Rouge (Proton) / Bleu (Electron)

    return (
        <group>
            <Trail width={0.6} length={30} color={color} attenuation={(t) => t}>
                <mesh ref={ref}>
                    <sphereGeometry args={[0.4]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
                </mesh>
            </Trail>
            
            {/* Affichage des vecteurs sur la particule */}
            {isAnimating && ref.current && (
                <VectorTriad 
                    position={ref.current.position} 
                    velocityDir={vectors.v} 
                    forceDir={vectors.f} 
                    bDir={new THREE.Vector3(0, 0, 1)} // B sortant
                    show={true}
                />
            )}
        </group>
    );
};

// --- DÉCOR (Chambre Magnétique) ---
const MagneticChamber = () => (
    <group>
        {/* Bobines de Helmholtz (Haut et Bas) */}
        <mesh position={[0, 0, -5]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[12, 0.5, 16, 64]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 5]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[12, 0.5, 16, 64]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        
        {/* Grille de fond */}
        <Grid position={[0, 0, -2]} args={[30, 30]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={5} sectionThickness={1} sectionColor="#0f766e" fadeDistance={30} rotation={[Math.PI/2, 0, 0]} />
    </group>
);

export default function Lorentz3D({ config, isAnimating }: any) {
    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <MagneticChamber />

                {config && <ChargedParticle config={config} isAnimating={isAnimating} />}

                {/* Canon à électrons */}
                <group position={[-2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
                    <Cylinder args={[0.3, 0.5, 1]} material-color="#64748b" />
                    <Cylinder args={[0.1, 0.1, 1.2]} material-color="#94a3b8" />
                </group>

                {/* Indication Champ B */}
                <Html position={[10, 8, 0]}>
                    <div className="flex flex-col items-center gap-1 opacity-50">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 font-bold">⊙</div>
                        <div className="text-emerald-500 text-xs font-bold">B (Sortant)</div>
                    </div>
                </Html>

                <OrbitControls enableRotate={true} enableZoom={true} />
            </Canvas>
        </div>
    );
}