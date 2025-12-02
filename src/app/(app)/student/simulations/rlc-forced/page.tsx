"use client";
import React, { useState, useEffect } from 'react';
import RLCForced3D from '@/components/simulations/RLCForced3D';
import { simulateRLCForced, RLCForcedConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Activity, Radio, Play } from 'lucide-react';

export default function RLCForcedPage() {
    const [params, setParams] = useState({ r: 10, l: 0.1, c: 100, f: 50, uMax: 10 });
    const [data, setData] = useState<RLCForcedConfig | null>(null);

    // Calcul f0 pour l'interface
    const f0 = 1 / (2 * Math.PI * Math.sqrt(params.l * (params.c * 1e-6)));

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateRLCForced(params, token).then(res => setData(res.data)).catch(console.error);
        }
    }, [params]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-yellow-500">
                    <Radio size={36} /> Circuit RLC Forcé (Résonance)
                </h1>
                <p className="text-gray-400 mt-2">Étude de l'impédance et du phénomène de résonance d'intensité.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Contrôles */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4 text-gray-200">Générateur (GBF)</h3>
                        
                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-400 block mb-1">Fréquence N ({params.f} Hz)</label>
                            {/* Slider centré autour de f0 pour faciliter la recherche de résonance */}
                            <input 
                                type="range" 
                                min={Math.floor(f0 * 0.1)} 
                                max={Math.ceil(f0 * 2)} 
                                value={params.f} 
                                onChange={e=>setParams({...params, f: Number(e.target.value)})} 
                                className="w-full accent-yellow-500"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                <span>Basse Fréq.</span>
                                <span className="text-green-500 font-bold">f0 ≈ {f0.toFixed(0)}</span>
                                <span>Haute Fréq.</span>
                            </div>
                        </div>

                        <h3 className="font-bold mb-4 mt-6 text-gray-200">Composants</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-gray-400"><span>R (Ohm)</span> <span>{params.r}</span></div>
                            <input type="range" min="1" max="100" value={params.r} onChange={e=>setParams({...params, r: Number(e.target.value)})} className="w-full accent-yellow-600 h-1 bg-slate-600"/>
                            
                            <div className="flex justify-between text-xs text-gray-400"><span>L (Henry)</span> <span>{params.l}</span></div>
                            <input type="range" min="0.01" max="1" step="0.01" value={params.l} onChange={e=>setParams({...params, l: Number(e.target.value)})} className="w-full accent-orange-600 h-1 bg-slate-600"/>
                            
                            <div className="flex justify-between text-xs text-gray-400"><span>C (µF)</span> <span>{params.c}</span></div>
                            <input type="range" min="10" max="500" step="10" value={params.c} onChange={e=>setParams({...params, c: Number(e.target.value)})} className="w-full accent-blue-600 h-1 bg-slate-600"/>
                        </div>
                    </div>

                    {/* Résultats */}
                    {data && (
                        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400 text-sm">Impédance Z</span>
                                <span className="font-bold font-mono">{data.z} Ω</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-yellow-400 text-sm font-bold">Intensité Ieff</span>
                                <span className="font-bold font-mono text-xl text-yellow-400">{data.i} mA</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-center text-gray-400">
                                {data.message}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3D */}
                <div className="lg:col-span-9">
                    <RLCForced3D config={data} f={params.f} f0={f0} />
                </div>

            </div>
        </div>
    );
}