"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// CORRECTION : Ajout de Cylinder
import { Box, Plane, Html, OrbitControls, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// --- SHADER D'INTERFÉRENCE ---
const InterferenceScreen = ({ lambda, slitDist, screenDist, color }: any) => {
    const uniforms = useMemo(() => ({
        uLambda: { value: lambda },
        uSlitDist: { value: slitDist },
        uColor: { value: new THREE.Color(color) },
        uScreenDist: { value: screenDist }
    }), [lambda, slitDist, screenDist, color]);

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uLambda;
            uniform float uSlitDist;
            uniform float uScreenDist;
            uniform vec3 uColor;
            varying vec2 vUv;

            void main() {
                float x = (vUv.x - 0.5) * 20.0;
                float k = (3.14159 * uSlitDist * x) / (uLambda * 0.05 * uScreenDist);
                float intensity = pow(cos(k), 2.0);
                float diffraction = exp(-0.1 * x * x);
                vec3 finalColor = uColor * intensity * diffraction;
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    }), [uniforms]);

    useFrame(() => {
        shaderMaterial.uniforms.uLambda.value = lambda;
        shaderMaterial.uniforms.uSlitDist.value = slitDist;
        shaderMaterial.uniforms.uColor.value.set(color);
        shaderMaterial.uniforms.uScreenDist.value = screenDist;
    });

    return (
        <mesh position={[0, 0, 0]}>
            <planeGeometry args={[10, 5]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

// --- DISPOSITIF COMPLET ---
export default function YoungSlits3D({ lambda, slitDistance, screenDistance }: any) {
    
    const getColor = (l: number) => {
        if (l < 450) return "#8b5cf6"; 
        if (l < 495) return "#3b82f6"; 
        if (l < 570) return "#22c55e"; 
        if (l < 590) return "#eab308"; 
        if (l < 620) return "#f97316"; 
        return "#ef4444"; 
    };
    const laserColor = getColor(lambda);

    return (
        <div className="w-full h-[600px] bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 relative">
            <Canvas camera={{ position: [-5, 2, 10], fov: 50 }}>
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.2} />

                {/* 1. SOURCE LASER */}
                <group position={[0, 0, 10]}>
                    <Box args={[1, 1, 2]} material-color="#333" />
                    <Cylinder args={[0.1, 0.1, 0.5]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -1.1]} material-color="#111" />
                    {/* Rayon */}
                    <mesh position={[0, 0, -5]} rotation={[Math.PI/2, 0, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 8]} />
                        <meshBasicMaterial color={laserColor} transparent opacity={0.5} />
                    </mesh>
                </group>

                {/* 2. PLAQUE FENTES (Double Fente) */}
                <group position={[0, 0, 2]}>
                    <Box args={[4, 3, 0.1]} material-color="#1f2937" />
                    {/* Trous visuels */}
                    <mesh position={[-slitDistance/4, 0, 0]}>
                        <planeGeometry args={[0.05, 1]} />
                        {/* CORRECTION : meshStandardMaterial pour l'emissive */}
                        <meshStandardMaterial color={laserColor} emissive={laserColor} emissiveIntensity={2} />
                    </mesh>
                    <mesh position={[slitDistance/4, 0, 0]}>
                        <planeGeometry args={[0.05, 1]} />
                        {/* CORRECTION : meshStandardMaterial pour l'emissive */}
                        <meshStandardMaterial color={laserColor} emissive={laserColor} emissiveIntensity={2} />
                    </mesh>
                    
                    {/* Cônes de diffraction (Lumière qui sort) */}
                    <mesh position={[0, 0, -screenDistance/2]} rotation={[Math.PI/2, 0, 0]}>
                         <cylinderGeometry args={[2, 0.1, screenDistance, 32, 1, true]} />
                         <meshBasicMaterial color={laserColor} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                </group>

                {/* 3. ÉCRAN */}
                <group position={[0, 0, -screenDistance + 2]}>
                    <InterferenceScreen 
                        lambda={lambda} 
                        slitDist={slitDistance} 
                        screenDist={screenDistance} 
                        color={laserColor} 
                    />
                    <Html position={[0, -3, 0]} center>
                        <div className="text-white text-xs font-mono bg-black/50 px-2 py-1 rounded border border-white/20">
                            ÉCRAN D'OBSERVATION
                        </div>
                    </Html>
                </group>

                <OrbitControls maxPolarAngle={Math.PI/2} minDistance={5} maxDistance={20} />
            </Canvas>
        </div>
    );
}