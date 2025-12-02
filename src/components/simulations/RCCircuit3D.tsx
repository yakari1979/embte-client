"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- COMPOSANTS ÉLECTRONIQUES ---

const Resistor = ({ position }: any) => (
    <group position={position} rotation={[0, 0, Math.PI/2]}>
        <Cylinder args={[0.3, 0.3, 2]} material-color="#e5e7eb" />
        {/* Bandes de couleur (Résistance 1kOhm : Marron, Noir, Rouge, Or) */}
        <Cylinder args={[0.31, 0.31, 0.2]} position={[0, 0.5, 0]} material-color="#854d0e" />
        <Cylinder args={[0.31, 0.31, 0.2]} position={[0, 0.2, 0]} material-color="black" />
        <Cylinder args={[0.31, 0.31, 0.2]} position={[0, -0.1, 0]} material-color="#dc2626" />
        <Cylinder args={[0.31, 0.31, 0.2]} position={[0, -0.6, 0]} material-color="#fbbf24" />
        {/* Fils */}
        <Cylinder args={[0.05, 0.05, 1]} position={[0, 1.5, 0]} material-color="silver" />
        <Cylinder args={[0.05, 0.05, 1]} position={[0, -1.5, 0]} material-color="silver" />
        <Html position={[0, 1, 0]} distanceFactor={8}>
            <div className="text-xs bg-white px-1 rounded border border-gray-400">R</div>
        </Html>
    </group>
);

const Capacitor = ({ position, chargePercent, mode }: any) => {
    // Couleur change selon la charge : Bleu (Vide) -> Rouge (Plein)
    const color = new THREE.Color("#3b82f6").lerp(new THREE.Color("#ef4444"), chargePercent / 100);
    
    return (
        <group position={position}>
            {/* Corps du condensateur chimique */}
            <Cylinder args={[0.6, 0.6, 2]} material-color="#1f2937" />
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 1.9]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            {/* Fils */}
            <Cylinder args={[0.05, 0.05, 1]} position={[0, -1.5, 0]} material-color="silver" />
            <Cylinder args={[0.05, 0.05, 1]} position={[0, 1.5, 0]} material-color="silver" />
            
            <Html position={[0, 0, 0]} distanceFactor={8}>
                <div className="text-white font-bold text-xs">{chargePercent}%</div>
            </Html>
            <Html position={[1, 0, 0]} distanceFactor={8}>
                <div className="text-xs bg-white px-1 rounded border border-gray-400">C</div>
            </Html>
        </group>
    );
};

const Generator = ({ position, voltage }: any) => (
    <group position={position}>
        <Box args={[2, 2, 2]} material-color="#374151" />
        <Text position={[0, 0, 1.1]} fontSize={0.5} color="white">E = {voltage}V</Text>
    </group>
);

// --- ÉLECTRONS (Particules qui circulent) ---
const Electrons = ({ speed, mode }: { speed: number, mode: string }) => {
    // Si speed est très faible (condensateur plein/vide), les électrons s'arrêtent
    // En décharge, ils vont dans l'autre sens
    
    const count = 30;
    const particles = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (particles.current && speed > 0.1) {
            particles.current.children.forEach((mesh, i) => {
                // Circuit rectangulaire simple
                // On triche un peu pour l'animation : ils tournent autour du centre
                const r = 4;
                const angleSpeed = (speed / 1000) * (mode === 'CHARGE' ? -1 : 1); // Sens inverse si décharge
                mesh.rotation.z += angleSpeed;
            });
        }
    });

    // On place les électrons sur un cercle pour simplifier le circuit visuel
    const electrons = useMemo(() => Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
            <group key={i} rotation={[0, 0, angle]}>
                <mesh position={[4, 0, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
            </group>
        );
    }), []);

    return (
        <group ref={particles}>
            {electrons}
        </group>
    );
};

// --- FILS DU CIRCUIT ---
// const Wires = () => (
//     <group rotation={[Math.PI/2, 0, 0]}>
//         <mesh>
//             <torusGeometry args={[4, 0.05, 8, 4]} rotation={[0,0,Math.PI/4]} /> {/* Carré arrondi */}
//             <meshStandardMaterial color="silver" />
//         </mesh>
//     </group>
// );

// --- FILS DU CIRCUIT ---
const Wires = () => (
    <group rotation={[Math.PI/2, 0, 0]}>
        {/* CORRECTION ICI : La rotation est sur le mesh, pas sur la géométrie */}
        <mesh rotation={[0, 0, Math.PI/4]}>
            <torusGeometry args={[4, 0.05, 8, 4]} /> {/* Carré arrondi */}
            <meshStandardMaterial color="silver" />
        </mesh>
    </group>
);

export default function RCCircuit3D({ config, params }: { config: any, params: any }) {
    const i_mA = parseFloat(config?.i || "0");
    const charge = parseFloat(config?.percentCharge || "0");

    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Circuit */}
                <group>
                    <Wires />
                    <Electrons speed={Math.abs(i_mA)} mode={params.mode} />
                    
                    {/* Composants placés sur le circuit */}
                    <Generator position={[-4, 0, 0]} voltage={params.voltageE} />
                    <Resistor position={[0, 4, 0]} />
                    <Capacitor position={[4, 0, 0]} chargePercent={charge} mode={params.mode} />
                    
                    {/* Interrupteur (Visuel) */}
                    <group position={[0, -4, 0]}>
                        <Box args={[1, 0.5, 0.5]} material-color="black" />
                        <Html position={[0, -1, 0]} center>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${params.mode === 'CHARGE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {params.mode === 'CHARGE' ? 'Pos. 1 (Géné)' : 'Pos. 2 (Masse)'}
                            </div>
                        </Html>
                    </group>
                </group>

                <OrbitControls enableZoom={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}