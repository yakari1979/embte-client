"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- SYSTÈME DE PARTICULES ---
const ReactionBox = ({ config }: { config: any }) => {
    const particleCount = config?.particleCount || 20;
    const speed = config?.particleSpeed || 0.5;
    const efficiency = parseInt(config?.collisionEfficiency || "0");

    // Création des molécules avec position et vecteur vitesse aléatoires
    const particles = useMemo(() => Array.from({ length: 50 }).map(() => ({
        pos: new THREE.Vector3((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8),
        vel: new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize(),
        type: Math.random() > 0.5 ? 'A' : 'B', // Réactifs initiaux
        id: Math.random()
    })), []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Mise à jour positions (Physique simple)
            groupRef.current.children.forEach((mesh: any, i) => {
                if (i >= particleCount) { mesh.visible = false; return; }
                mesh.visible = true;

                const p = particles[i];
                const velocity = p.vel.clone().multiplyScalar(speed * 10 * delta); // Vitesse selon température
                p.pos.add(velocity);

                // Rebond sur les murs (Boite 10x10x10)
                if (p.pos.x > 4 || p.pos.x < -4) p.vel.x *= -1;
                if (p.pos.y > 4 || p.pos.y < -4) p.vel.y *= -1;
                if (p.pos.z > 4 || p.pos.z < -4) p.vel.z *= -1;

                mesh.position.copy(p.pos);

                // CHOCS EFFICACES (Simulation visuelle)
                // Si la vitesse (température) est haute, on change de couleur aléatoirement pour simuler la réaction
                if (Math.random() < (efficiency / 5000)) { // Probabilité faible par frame
                    // Changement de couleur (Réaction A+B -> C)
                    (mesh.material as THREE.MeshStandardMaterial).color.set('#22c55e'); // Vert (Produit)
                }
            });
        }
    });

    // Reset des couleurs si config change radicalement
    React.useEffect(() => {
        if(groupRef.current) {
            groupRef.current.children.forEach((mesh: any, i) => {
                const p = particles[i];
                const color = p.type === 'A' ? '#ef4444' : '#3b82f6';
                (mesh.material as THREE.MeshStandardMaterial).color.set(color);
            });
        }
    }, [config]);

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={p.id}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={p.type === 'A' ? '#ef4444' : '#3b82f6'} />
                </mesh>
            ))}
        </group>
    );
};

export default function Kinetics3D({ config }: { config: any }) {
    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Boîte de réaction (Transparente) */}
                <Box args={[8.5, 8.5, 8.5]}>
                    <meshStandardMaterial color="white" wireframe transparent opacity={0.1} />
                </Box>

                <ReactionBox config={config} />

                {/* Légende */}
                <Html position={[-3, -3.5, 0]}>
                    <div className="flex gap-4 bg-black/60 p-2 rounded backdrop-blur border border-white/10 text-xs text-white">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> A</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> B</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> C (Produit)</div>
                    </div>
                </Html>

                <OrbitControls autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}