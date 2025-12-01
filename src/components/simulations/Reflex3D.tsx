"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, OrbitControls, ContactShadows, Html } from '@react-three/drei'; // J'ai retiré 'Environment'
import * as THREE from 'three';

// --- COMPOSANTS DE DÉCOR ---

const MedicalTable = () => (
    <group position={[0, 0.2, 0]}>
        {/* Assise */}
        <Box args={[2.5, 0.2, 3]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1e293b" roughness={0.5} /> {/* Cuir bleu nuit */}
        </Box>
        {/* Pieds de la table */}
        <Cylinder args={[0.1, 0.1, 3]} position={[-1, -1.5, -1.2]} material-color="#94a3b8" />
        <Cylinder args={[0.1, 0.1, 3]} position={[1, -1.5, -1.2]} material-color="#94a3b8" />
        <Cylinder args={[0.1, 0.1, 3]} position={[-1, -1.5, 1.2]} material-color="#94a3b8" />
        <Cylinder args={[0.1, 0.1, 3]} position={[1, -1.5, 1.2]} material-color="#94a3b8" />
    </group>
);

const ReflexHammer = ({ trigger }: { trigger: boolean }) => {
    const hammerRef = useRef<THREE.Group>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Animation du coup de marteau
    useFrame((state, delta) => {
        if (!hammerRef.current) return;
        
        if (trigger && !isAnimating) {
            setIsAnimating(true);
        }

        if (isAnimating) {
            hammerRef.current.rotation.z = THREE.MathUtils.lerp(hammerRef.current.rotation.z, -Math.PI / 4, 0.2);
            if (Math.abs(hammerRef.current.rotation.z - (-Math.PI/4)) < 0.1) {
                setTimeout(() => setIsAnimating(false), 200);
            }
        } else {
            hammerRef.current.rotation.z = THREE.MathUtils.lerp(hammerRef.current.rotation.z, 0, 0.1);
        }
    });

    return (
        <group position={[0.8, 0.5, 0.8]} rotation={[0, -0.5, 0]}>
            <group ref={hammerRef} rotation={[0, 0, 0]}>
                {/* Manche */}
                <Cylinder args={[0.02, 0.03, 1.5]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
                </Cylinder>
                {/* Tête du marteau */}
                <group position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                     <mesh>
                        <cylinderGeometry args={[0.15, 0.05, 0.4, 3]} />
                        <meshStandardMaterial color="#ef4444" />
                     </mesh>
                </group>
            </group>
        </group>
    );
};

// --- LE CŒUR DE LA SIMULATION : LA JAMBE ---

const Leg = ({ angle, showNerves }: { angle: number, showNerves: boolean }) => {
    const targetRotation = THREE.MathUtils.degToRad(-angle);
    const calfRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (calfRef.current) {
            calfRef.current.rotation.x = THREE.MathUtils.lerp(calfRef.current.rotation.x, targetRotation, 0.15);
        }
    });

    const skinColor = "#eecfb4"; 

    return (
        <group position={[0, 0.3, 0]}>
            {/* CUISSE */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
                    <capsuleGeometry args={[0.35, 2, 4, 16]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
                {showNerves && (
                    <mesh position={[0, 0, 1]} rotation={[Math.PI/2, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 2]} />
                        <meshBasicMaterial color="#ffff00" toneMapped={false} />
                    </mesh>
                )}
            </group>

            {/* GENOU */}
            <group position={[0, 0, 2.2]}>
                <Sphere args={[0.32]} >
                    <meshStandardMaterial color={skinColor} />
                </Sphere>
            </group>

            {/* MOLLET + PIED */}
            <group ref={calfRef} position={[0, 0, 2.2]}>
                <group position={[0, -1.2, 0]}> 
                    <mesh>
                        <capsuleGeometry args={[0.28, 1.8, 4, 16]} />
                        <meshStandardMaterial color={skinColor} />
                    </mesh>
                    {showNerves && (
                        <mesh>
                            <cylinderGeometry args={[0.02, 0.02, 1.8]} />
                            <meshBasicMaterial color="#ffff00" toneMapped={false} />
                        </mesh>
                    )}
                </group>

                {/* Chaussette */}
                <Cylinder args={[0.29, 0.26, 0.5]} position={[0, -2.2, 0]}>
                    <meshStandardMaterial color="white" />
                </Cylinder>

                {/* Chaussure */}
                <group position={[0, -2.6, 0.2]}>
                    <Box args={[0.35, 0.3, 0.8]}>
                        <meshStandardMaterial color="#3b82f6" />
                    </Box>
                    <Box args={[0.36, 0.1, 0.82]} position={[0, -0.15, 0]}>
                        <meshStandardMaterial color="white" />
                    </Box>
                </group>
            </group>
        </group>
    );
};


export default function Reflex3D({ angle }: { angle: number }) {
    const [triggerHammer, setTriggerHammer] = useState(false);

    useEffect(() => {
        if (angle > 0) {
            setTriggerHammer(true);
            const timer = setTimeout(() => setTriggerHammer(false), 500);
            return () => clearTimeout(timer);
        }
    }, [angle]);

    return (
        <Canvas camera={{ position: [4, 1, 4], fov: 45 }} shadows>
            
            {/* --- ÉCLAIRAGE CORRIGÉ (Fonctionne hors-ligne) --- */}
            {/* Lumière ambiante douce pour ne rien avoir de noir */}
            <ambientLight intensity={0.6} />
            
            {/* Lumière principale (Soleil) qui fait les ombres */}
            <directionalLight 
                position={[5, 10, 5]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize={[1024, 1024]} 
            />
            
            {/* Lumière de rebond (Bleutée) pour faire "Médical/Propre" */}
            <hemisphereLight args={['#ffffff', '#bbbbbb']} intensity={0.5} />
            
            {/* Lumière d'accentuation sur le côté */}
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a5f3fc" />

            {/* SCÈNE */}
            <group position={[0, -0.5, 0]}>
                <MedicalTable />
                
                {/* Jambe Droite */}
                <group position={[0.4, 0.3, 0]}>
                    <Leg angle={angle} showNerves={angle > 0} />
                </group>

                {/* Jambe Gauche */}
                <group position={[-0.4, 0.3, 0]}>
                    <Leg angle={0} showNerves={false} />
                </group>

                <ReflexHammer trigger={triggerHammer} />
            </group>

            <Html position={[0, 2.5, 0]} center>
                <div className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none select-none">
                    Vue Latérale
                </div>
            </Html>

            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Canvas>
    );
}