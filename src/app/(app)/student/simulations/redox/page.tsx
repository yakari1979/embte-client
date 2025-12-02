"use client";
import React, { useState, useEffect } from 'react';
import Redox3D from '@/components/simulations/Redox3D';
import { simulateRedox, RedoxConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { BatteryCharging, Power, ArrowRight, Zap } from 'lucide-react';

export default function RedoxPage() {
    const [connected, setConnected] = useState(false);
    const [data, setData] = useState<RedoxConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateRedox(connected, token).then(res => setData(res.data));
        }
    }, [connected]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-yellow-500">
                    <BatteryCharging size={36} /> Pile Électrochimique (Daniell)
                </h1>
                <p className="text-gray-400 mt-2">Oxydoréduction spontanée : transfert d'électrons entre les couples Zn²⁺/Zn et Cu²⁺/Cu.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* GAUCHE : CONTRÔLES (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Interrupteur */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center shadow-lg">
                        <button 
                            onClick={() => setConnected(!connected)}
                            className={`w-full py-6 rounded-xl font-black text-xl shadow-lg transform transition-all active:scale-95 flex flex-col items-center gap-2 border-b-4 ${connected ? 'bg-green-600 border-green-800 text-white' : 'bg-red-600 border-red-800 text-white'}`}
                        >
                            <Power size={32}/>
                            {connected ? 'CIRCUIT FERMÉ (ON)' : 'CIRCUIT OUVERT (OFF)'}
                        </button>
                    </div>

                    {/* Données de la réaction */}
                    {data && (
                        <div className="bg-black p-5 rounded-2xl border border-gray-700 space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Force Électromotrice</div>
                                <div className={`text-4xl font-bold font-mono ${connected ? 'text-yellow-400' : 'text-gray-600'}`}>
                                    {data.voltage} V
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">Demi-Équations</div>
                                <div className="space-y-2 font-mono text-sm">
                                    <div className="flex justify-between items-center text-red-300">
                                        <span>Anode (-)</span> <span>Zn ⟶ Zn²⁺ + 2e⁻</span>
                                    </div>
                                    <div className="flex justify-between items-center text-blue-300">
                                        <span>Cathode (+)</span> <span>Cu²⁺ + 2e⁻ ⟶ Cu</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">Bilan</div>
                                <div className="bg-slate-900 p-2 rounded text-center font-bold text-white border border-slate-700">
                                    {data.equation}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE : 3D (8 cols) */}
                <div className="lg:col-span-8 relative">
                    <Redox3D config={data} />
                    
                    {/* Flux d'électrons animé */}
                    {connected && (
                        <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur border border-yellow-500 text-yellow-200 px-4 py-2 rounded-xl animate-pulse flex items-center gap-2">
                            <Zap size={16}/> Courant en circulation
                        </div>
                    )}

                    <div className="mt-4 p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-gray-300 flex items-start gap-3">
                        <ArrowRight className="text-yellow-500 shrink-0 mt-1"/>
                        <p>{data?.message}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}