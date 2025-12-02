"use client";
import React, { useState } from 'react';
import Lorentz3D from '@/components/simulations/Lorentz3D';
import { simulateLorentz, LorentzConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Magnet, Play, Plus, Minus, Zap, Info } from 'lucide-react';

export default function LorentzPage() {
    const [params, setParams] = useState({ chargeType: 'POSITIVE', velocity: 20, bField: 5 });
    const [data, setData] = useState<LorentzConfig | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const run = async () => {
        setIsAnimating(false);
        const token = Cookies.get('token');
        if(!token) return;
        const res = await simulateLorentz(params, token);
        setData(res.data);
        setTimeout(() => setIsAnimating(true), 100);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-emerald-400">
                    <Magnet size={36} /> Force de Lorentz
                </h1>
                <p className="text-gray-400 mt-2">Étude de la déviation d'une particule chargée dans un champ magnétique uniforme.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- CONTRÔLES (Gauche) --- */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-emerald-300"><Zap size={18}/> Configuration</h3>
                        
                        {/* Choix Particule */}
                        <label className="text-xs text-gray-400 block mb-2 font-bold">TYPE DE CHARGE (q)</label>
                        <div className="flex gap-2 mb-6">
                            <button onClick={()=>setParams({...params, chargeType: 'POSITIVE'})} className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${params.chargeType==='POSITIVE'?'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20':'bg-slate-900 border-slate-600 text-gray-500'}`}>
                                <Plus size={20}/> <span>Proton</span>
                            </button>
                            <button onClick={()=>setParams({...params, chargeType: 'NEGATIVE'})} className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${params.chargeType==='NEGATIVE'?'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20':'bg-slate-900 border-slate-600 text-gray-500'}`}>
                                <Minus size={20}/> <span>Électron</span>
                            </button>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Vitesse Initiale (v)</span>
                                    <span className="text-white font-bold">{params.velocity} u.a.</span>
                                </div>
                                <input type="range" min="10" max="50" value={params.velocity} onChange={e=>setParams({...params, velocity: Number(e.target.value)})} className="w-full accent-blue-400 h-2 bg-slate-700 rounded-lg"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Champ Magnétique (B)</span>
                                    <span className="text-white font-bold">{params.bField} T</span>
                                </div>
                                <input type="range" min="1" max="10" value={params.bField} onChange={e=>setParams({...params, bField: Number(e.target.value)})} className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg"/>
                            </div>
                        </div>

                        <button onClick={run} className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-white">
                            <Play size={20}/> INJECTER LA PARTICULE
                        </button>
                    </div>

                    {/* Carte Formule */}
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2 uppercase"><Info size={14}/> La Règle des 3 Doigts</div>
                        <div className="text-center font-mono text-lg text-white bg-slate-900 p-3 rounded-lg border border-slate-600">
                            <span className="text-red-500">F</span> = q (<span className="text-blue-500">v</span> ∧ <span className="text-emerald-500">B</span>)
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            La force F est toujours perpendiculaire à la vitesse v et au champ B.
                        </p>
                    </div>
                </div>

                {/* --- VISUALISATION (Droite) --- */}
                <div className="lg:col-span-9 relative">
                    <Lorentz3D config={data} isAnimating={isAnimating} />
                    
                    {/* Légende Flottante */}
                    <div className="absolute bottom-4 left-4 flex gap-4 pointer-events-none">
                        <div className="bg-black/70 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold backdrop-blur">Force (F)</div>
                        <div className="bg-black/70 px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 text-xs font-bold backdrop-blur">Vitesse (v)</div>
                        <div className="bg-black/70 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-bold backdrop-blur">Champ (B)</div>
                    </div>

                    {data && (
                        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-600 p-4 rounded-xl shadow-2xl w-64 animate-in fade-in slide-in-from-right-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Trajectoire</h4>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="text-gray-300">Rayon (R)</span>
                                <span className="font-mono font-bold text-white">{data.radius.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">Période (T)</span>
                                <span className="font-mono font-bold text-white">{data.period} s</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700 text-xs italic text-emerald-300">
                                {data.message}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}