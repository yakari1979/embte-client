"use client";
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Html, OrbitControls, Grid, Text, Float, Center } from '@react-three/drei';

const PopulationBar = ({ position, width, color, label, isLeft, onHover }: any) => {
    // Échelle : on divise par 100 pour que ça rentre dans l'écran
    const w = Math.max(0.1, width / 100); 
    const x = isLeft ? -w/2 - 0.1 : w/2 + 0.1;
    const [hovered, setHover] = useState(false);

    return (
        <group position={[x, position[1], position[2]]} 
               onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover(label, width); }} 
               onPointerOut={(e) => { e.stopPropagation(); setHover(false); onHover(null, null); }}>
            <Box args={[w, 0.4, 0.4]}>
                <meshStandardMaterial 
                    color={color} 
                    transparent 
                    opacity={hovered ? 1 : 0.8} 
                    emissive={color}
                    emissiveIntensity={hovered ? 0.5 : 0}
                />
            </Box>
        </group>
    );
};

export default function AgePyramid3D({ config }: { config: any }) {
    const data = config?.data || []; // Sécurité si config est null
    const [tooltip, setTooltip] = useState<{label: string, val: number} | null>(null);

    // Si pas de données, on n'affiche rien (ou un placeholder)
    if (data.length === 0) return null;

    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas camera={{ position: [0, 2, 20], fov: 45 }}>
                <color attach="background" args={['#0f172a']} />
                
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, 0, 10]} intensity={0.5} />

                <group position={[0, -5, 0]}>
                    {/* AXE CENTRAL */}
                    <Box args={[0.05, 11, 0.05]} position={[0, 5, 0]} material-color="white" />

                    {data.map((row: any, i: number) => (
                        <group key={i} position={[0, i * 0.5, 0]}>
                            {/* Hommes (Gauche - Bleu) */}
                            <PopulationBar 
                                position={[0, 0, 0]} 
                                width={row.men} 
                                color="#3b82f6" 
                                label={`Hommes (${row.age})`} 
                                isLeft={true} 
                                onHover={(l: string, v: number) => setTooltip(l ? {label:l, val:v} : null)} 
                            />
                            
                            {/* Femmes (Droite - Rose) */}
                            <PopulationBar 
                                position={[0, 0, 0]} 
                                width={row.women} 
                                color="#ec4899" 
                                label={`Femmes (${row.age})`} 
                                isLeft={false} 
                                onHover={(l: string, v: number) => setTooltip(l ? {label:l, val:v} : null)} 
                            />
                            
                            {/* Axe Age (Texte 3D - SANS FONT CUSTOM) */}
                            {i % 2 === 0 && (
                                <Text 
                                    position={[0, 0, 0.5]} 
                                    fontSize={0.2} 
                                    color="#94a3b8" 
                                    anchorX="center" 
                                    anchorY="middle"
                                >
                                    {row.age}
                                </Text>
                            )}
                        </group>
                    ))}
                </group>

                {/* Titres 3D Flottants */}
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                    <Text position={[-3, 6, 0]} fontSize={0.5} color="#3b82f6">HOMMES</Text>
                    <Text position={[3, 6, 0]} fontSize={0.5} color="#ec4899">FEMMES</Text>
                </Float>

                {/* Grille Sol */}
                <Grid position={[0, -5.5, 0]} args={[20, 20]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={5} sectionThickness={1} sectionColor="#334155" infiniteGrid fadeDistance={30} />

                <OrbitControls minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2} enablePan={true} />
            </Canvas>

            {/* TOOLTIP FLOTTANT (UI HTML) */}
            {tooltip && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-lg pointer-events-none animate-in fade-in zoom-in duration-200 z-10">
                    <div className="text-xs text-gray-400 uppercase font-bold">{tooltip.label}</div>
                    <div className="text-xl font-mono font-bold text-yellow-400">{tooltip.val.toLocaleString()} hab.</div>
                </div>
            )}
            
            <div className="absolute bottom-4 left-4 text-xs text-slate-500 bg-black/50 p-2 rounded">
                Axe Y : Âges (0 à 100+) • Axe X : Effectif
            </div>
        </div>
    );
}