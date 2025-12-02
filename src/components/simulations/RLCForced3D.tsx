"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, Html, OrbitControls } from '@react-three/drei';

// --- ÉCRAN OSCILLOSCOPE (SVG 2D) ---
const OscilloscopeScreen = ({ i_amp, phi_deg }: { i_amp: number, phi_deg: number }) => {
    // i_amp est l'amplitude du courant (hauteur de la courbe jaune)
    // phi_deg est le déphasage (décalage horizontal)
    
    // On normalise l'amplitude pour l'affichage (max visuel ~40px)
    const scaleI = Math.min(i_amp / 10, 1) * 40; 
    const scaleU = 40; // Tension u(t) fixe en amplitude pour référence

    // Conversion déphasage degrés -> pixels (360° = 1 période = 200px)
    const shift = (phi_deg / 360) * 200;

    // Génération des paths SVG
    const width = 300;
    let pathU = "M 0,50"; // Courbe Verte (Tension)
    let pathI = `M 0,50`; // Courbe Jaune (Courant)

    for (let x = 0; x <= width; x += 5) {
        // u(t) = Umax sin(wt)
        const yU = 50 - Math.sin(x * 0.05) * scaleU;
        pathU += ` L ${x},${yU}`;

        // i(t) = Imax sin(wt - phi)
        // Le déphasage est soustrait (retard)
        const yI = 50 - Math.sin(x * 0.05 - (phi_deg * Math.PI / 180)) * scaleI;
        pathI += ` L ${x},${yI}`;
    }

    return (
        <div className="w-[300px] h-[100px] bg-black border border-gray-700 relative overflow-hidden rounded">
            {/* Grille */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-2 pointer-events-none opacity-20">
                {[...Array(12)].map((_,i) => <div key={i} className="border border-green-500"></div>)}
            </div>
            
            {/* SVG */}
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path d={pathU} fill="none" stroke="#22c55e" strokeWidth="2" /> {/* Vert (u) */}
                <path d={pathI} fill="none" stroke="#eab308" strokeWidth="2" /> {/* Jaune (i) */}
            </svg>

            {/* Légende */}
            <div className="absolute top-1 right-1 text-[9px] text-gray-400 flex gap-2">
                <span className="text-green-500">CH1: u(t)</span>
                <span className="text-yellow-500">CH2: i(t)</span>
            </div>
        </div>
    );
};

// --- COMPOSANT 3D ---
export default function RLCForced3D({ config, f, f0 }: { config: any, f: number, f0: number }) {
    const iVal = parseFloat(config?.i || "0");
    const phiVal = parseFloat(config?.phi || "0");

    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Circuit sur table */}
                <group position={[0, -1, 0]}>
                    {/* Breadboard */}
                    <Box args={[8, 0.2, 5]} material-color="#cbd5e1" />
                    
                    {/* Composants (Symboliques 3D) */}
                    <group position={[-2, 0.5, 0]}>
                        <Box args={[1, 0.5, 0.5]} material-color="#3b82f6" /> {/* C */}
                        <Html position={[0, 1, 0]} center><div className="text-xs font-bold text-blue-500">C</div></Html>
                    </group>
                    <group position={[0, 0.5, 0]}>
                        <Cylinder args={[0.3, 0.3, 1]} rotation={[0,0,Math.PI/2]} material-color="#b45309" /> {/* L */}
                        <Html position={[0, 1, 0]} center><div className="text-xs font-bold text-orange-700">L</div></Html>
                    </group>
                    <group position={[2, 0.5, 0]}>
                        <Box args={[1, 0.5, 0.5]} material-color="#eab308" /> {/* R */}
                        <Html position={[0, 1, 0]} center><div className="text-xs font-bold text-yellow-600">R</div></Html>
                    </group>

                    {/* GBF (Générateur) */}
                    <group position={[0, 0, -3]}>
                        <Box args={[4, 2, 2]} material-color="#333" />
                        <Html position={[0, 0, 1.1]} transform center scale={0.5}>
                            <div className="bg-black text-green-500 font-mono px-2 py-1 border border-gray-600">
                                f = {f} Hz
                            </div>
                        </Html>
                        <Html position={[0, 1.5, 0]} center><div className="text-xs text-gray-400">Générateur BF</div></Html>
                    </group>
                </group>

                <OrbitControls enableZoom={false} />
            </Canvas>

            {/* OVERLAY: OSCILLOSCOPE (En haut à droite) */}
            <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-xl shadow-2xl border border-gray-600">
                <OscilloscopeScreen i_amp={iVal} phi_deg={phiVal} />
                <div className="mt-2 text-center text-xs text-gray-400">
                    Déphasage φ = {phiVal}°
                </div>
            </div>

            {/* Indicateur Résonance */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-bold border ${f === f0 ? 'bg-green-600 text-white border-green-400 animate-pulse' : 'bg-black/50 text-gray-400 border-gray-600'}`}>
                    RÉSONANCE (f0 = {f0.toFixed(1)} Hz)
                </div>
            </div>
        </div>
    );
}