"use client";
import React, { useState, useEffect } from 'react';
import YoungSlits3D from '@/components/simulations/YoungSlits3D';
import { simulateYoung, YoungConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Waves, Ruler, Settings2 } from 'lucide-react';

export default function InterferencePage() {
    const [params, setParams] = useState({ lambda: 650, slitDistance: 0.5, screenDistance: 2 });
    const [data, setData] = useState<YoungConfig | null>(null);

    // Simulation temps réel
    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateYoung(params, token).then(res => setData(res.data)).catch(console.error);
        }
    }, [params]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-black text-white">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-500">
                    <Waves size={36} /> Interférences Lumineuses
                </h1>
                <p className="text-gray-400 mt-2">Expérience des Fentes de Young : dualité onde-particule.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Contrôles */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-200"><Settings2 size={18}/> Paramètres</h3>
                        
                        <div className="space-y-6">
                            {/* Lambda (Couleur) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Longueur d'onde (λ)</label>
                                <input type="range" min="400" max="700" value={params.lambda} onChange={e=>setParams({...params, lambda: Number(e.target.value)})} 
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                    style={{background: `linear-gradient(to right, #8b5cf6, #3b82f6, #22c55e, #eab308, #ef4444)`}}
                                />
                                <div className="text-right font-mono text-white mt-1">{params.lambda} nm</div>
                            </div>

                            {/* Distance Fentes (a) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Écartement Fentes (a)</label>
                                <input type="range" min="0.1" max="2.0" step="0.1" value={params.slitDistance} onChange={e=>setParams({...params, slitDistance: Number(e.target.value)})} className="w-full accent-blue-500"/>
                                <div className="text-right font-mono text-blue-400">{params.slitDistance} mm</div>
                            </div>

                            {/* Distance Ecran (D) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Distance Écran (D)</label>
                                <input type="range" min="1" max="5" step="0.5" value={params.screenDistance} onChange={e=>setParams({...params, screenDistance: Number(e.target.value)})} className="w-full accent-gray-500"/>
                                <div className="text-right font-mono text-gray-400">{params.screenDistance} m</div>
                            </div>
                        </div>
                    </div>

                    {/* Résultat Calculé */}
                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Ruler size={16}/> Interfrange (i)</div>
                        <div className="text-4xl font-bold text-white mb-2">{data?.interfringe || "--"} <span className="text-lg text-gray-500">mm</span></div>
                        <div className="text-xs text-gray-500 italic bg-black p-2 rounded">
                            i = (λ × D) / a
                        </div>
                    </div>
                </div>

                {/* 3D */}
                <div className="lg:col-span-9">
                    <YoungSlits3D 
                        lambda={params.lambda} 
                        slitDistance={params.slitDistance} 
                        screenDistance={params.screenDistance} 
                    />
                    <div className="mt-4 text-center text-gray-500 text-sm">
                        {data?.message}
                    </div>
                </div>

            </div>
        </div>
    );
}