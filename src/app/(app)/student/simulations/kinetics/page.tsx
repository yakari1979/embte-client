"use client";
import React, { useState, useEffect } from 'react';
import Kinetics3D from '@/components/simulations/Kinetics3D';
import { simulateKinetics, KineticsConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Flame, Beaker, Zap, Thermometer } from 'lucide-react';

export default function KineticsPage() {
    const [temp, setTemp] = useState(25);
    const [conc, setConc] = useState(1);
    const [catalyst, setCatalyst] = useState(false);
    const [data, setData] = useState<KineticsConfig | null>(null);

    // Simulation continue
    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateKinetics({ temperature: temp, concentration: conc, catalyst }, token)
                .then(res => setData(res.data))
                .catch(console.error);
        }
    }, [temp, conc, catalyst]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-red-500">
                    <Flame size={36} /> Cinétique Chimique
                </h1>
                <p className="text-gray-400 mt-2">Facteurs cinétiques : Influence de la température, de la concentration et des catalyseurs.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Contrôles */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-6 text-gray-200">Facteurs Cinétiques</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-sm mb-2 text-red-400 font-bold">
                                    <span className="flex items-center gap-2"><Thermometer size={16}/> Température</span>
                                    <span>{temp}°C</span>
                                </label>
                                <input type="range" min="0" max="100" value={temp} onChange={e=>setTemp(Number(e.target.value))} className="w-full accent-red-500"/>
                            </div>

                            <div>
                                <label className="flex justify-between text-sm mb-2 text-blue-400 font-bold">
                                    <span className="flex items-center gap-2"><Beaker size={16}/> Concentration</span>
                                    <span>{conc} mol/L</span>
                                </label>
                                <input type="range" min="0.1" max="2.0" step="0.1" value={conc} onChange={e=>setConc(Number(e.target.value))} className="w-full accent-blue-500"/>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                                <span className="text-sm font-bold text-yellow-400 flex items-center gap-2"><Zap size={16}/> Catalyseur</span>
                                <button 
                                    onClick={() => setCatalyst(!catalyst)}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${catalyst ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-gray-400'}`}
                                >
                                    {catalyst ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    {data && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                                <div className="text-xs text-gray-500 uppercase">Probabilité Chocs Efficaces</div>
                                <div className="text-3xl font-bold text-green-400 mt-1">{data.collisionEfficiency}%</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                                <div className="text-xs text-gray-500 uppercase">Facteur Vitesse</div>
                                <div className="text-3xl font-bold text-white mt-1">x{data.speedFactor}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3D */}
                <div className="lg:col-span-8 relative">
                    <Kinetics3D config={data} />
                    {data && (
                        <div className="mt-4 p-3 text-center text-sm text-gray-400 italic">
                            {data.message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}