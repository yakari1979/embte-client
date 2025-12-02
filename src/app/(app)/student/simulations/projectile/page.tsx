"use client";
import React, { useState } from 'react';
import Projectile3D from '@/components/simulations/Projectile3D';
import { simulateProjectile, ProjectileConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Rocket, Play, Settings2, ArrowUpRight, Timer, MoveHorizontal, RefreshCcw } from 'lucide-react';

export default function ProjectilePage() {
    const [params, setParams] = useState({ velocity: 25, angle: 45, height: 0 });
    const [data, setData] = useState<ProjectileConfig | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Données temps réel pour le HUD
    const [hud, setHud] = useState({ alt: "0.0", dist: "0.0", vx: 0, vy: 0 });

    const run = async () => {
        setIsAnimating(false);
        const token = Cookies.get('token');
        if(!token) return;
        const res = await simulateProjectile(params, token);
        setData(res.data);
        // Reset HUD
        setHud({ alt: "0.0", dist: "0.0", vx: 0, vy: 0 });
        setTimeout(() => setIsAnimating(true), 100);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-400">
                    <Rocket size={36} /> Cinématique : Tir de Projectile
                </h1>
                <p className="text-gray-400 mt-2">Analysez la trajectoire parabolique et la décomposition des vecteurs vitesse.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- CONTRÔLES (Gauche) --- */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-300"><Settings2 size={18}/> Paramètres de Tir</h3>
                        
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Vitesse Initiale (v₀)</span>
                                    <span className="text-white font-bold">{params.velocity} m/s</span>
                                </div>
                                <input type="range" min="10" max="100" value={params.velocity} onChange={e=>setParams({...params, velocity: Number(e.target.value)})} className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Angle de Tir (α)</span>
                                    <span className="text-white font-bold">{params.angle}°</span>
                                </div>
                                <input type="range" min="0" max="90" value={params.angle} onChange={e=>setParams({...params, angle: Number(e.target.value)})} className="w-full accent-green-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Hauteur (h₀)</span>
                                    <span className="text-white font-bold">{params.height} m</span>
                                </div>
                                <input type="range" min="0" max="50" value={params.height} onChange={e=>setParams({...params, height: Number(e.target.value)})} className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                        </div>

                        <button onClick={run} className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-white">
                            <Play size={20}/> LANCER LE TIR
                        </button>
                    </div>

                    {/* Résultats Finaux */}
                    {data && !isAnimating && (
                        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Rapport de Tir</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-600">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm"><MoveHorizontal size={16}/> Portée</div>
                                    <div className="text-xl font-bold text-green-400">{data.stats.range} m</div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-600">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm"><ArrowUpRight size={16}/> Flèche</div>
                                    <div className="text-xl font-bold text-blue-400">{data.stats.maxHeight} m</div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-600">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm"><Timer size={16}/> Durée</div>
                                    <div className="text-xl font-bold text-white">{data.stats.duration} s</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- VISUALISATION (Droite) --- */}
                <div className="lg:col-span-9 relative">
                    <Projectile3D 
                        config={data} 
                        angle={params.angle} 
                        isAnimating={isAnimating} 
                        onFinish={() => setIsAnimating(false)} 
                        setHudData={setHud}
                    />

                    {/* HUD (Heads-Up Display) - Superposé à la 3D */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-slate-600 p-4 rounded-xl text-xs font-mono text-blue-200 w-48 shadow-2xl">
                        <div className="mb-2 text-slate-400 font-bold border-b border-slate-600 pb-1">TÉLÉMETRIE</div>
                        <div className="grid grid-cols-2 gap-y-2">
                            <span>ALT:</span> <span className="text-white text-right">{hud.alt} m</span>
                            <span>DIST:</span> <span className="text-white text-right">{hud.dist} m</span>
                            <span className="text-green-400">Vx:</span> <span className="text-green-400 text-right">Const.</span>
                            <span className="text-yellow-400">Vy:</span> <span className="text-yellow-400 text-right">{hud.vy.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    {/* Légende Vecteurs */}
                    <div className="absolute bottom-4 left-4 flex gap-3 pointer-events-none">
                        <div className="bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur flex items-center gap-2"><div className="w-3 h-0.5 bg-green-500"></div> Vitesse Horizontale (Vx)</div>
                        <div className="bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur flex items-center gap-2"><div className="w-3 h-0.5 bg-yellow-500"></div> Vitesse Verticale (Vy)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}