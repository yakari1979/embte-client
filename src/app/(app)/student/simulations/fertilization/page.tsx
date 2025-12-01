"use client";
import React, { useState } from 'react';
import Fertilization3D from '@/components/simulations/Fertilization3D';
import { simulateFertilization, FertilizationConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Baby, Calendar, Microscope, Activity, Play } from 'lucide-react';

export default function FertilizationPage() {
    const [params, setParams] = useState({ 
        spermCount: 'NORMAL', 
        spermMobility: 'NORMAL', 
        timing: 'OVULATION' 
    });
    const [data, setData] = useState<FertilizationConfig | null>(null);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        const token = Cookies.get('token');
        if(!token) return;
        const res = await simulateFertilization(params, token);
        setData(res.data);
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-pink-400">
                    <Baby size={32} /> Reproduction Humaine : La Fécondation
                </h1>
                <p className="text-gray-400 mt-2">Simulez la rencontre des gamètes selon différents paramètres physiologiques.</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-6">
                
                {/* CONTRÔLES */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Spermogramme */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Microscope className="text-blue-400"/> Spermogramme</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Numération (Nb)</label>
                                <select 
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm"
                                    value={params.spermCount} onChange={(e) => setParams({...params, spermCount: e.target.value})}
                                >
                                    <option value="NORMAL">Normospermie ({'>'} 15M/ml)</option>
                                    <option value="LOW">Oligospermie ({'<'} 15M/ml)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Mobilité</label>
                                <select 
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm"
                                    value={params.spermMobility} onChange={(e) => setParams({...params, spermMobility: e.target.value})}
                                >
                                    <option value="NORMAL">Normale (Progressive)</option>
                                    <option value="LOW">Asthénospermie (Faible)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Cycle Ovarien */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="text-pink-400"/> Cycle Féminin</h3>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm"
                            value={params.timing} onChange={(e) => setParams({...params, timing: e.target.value})}
                        >
                            <option value="FOLLICULAR">Phase Folliculaire (J1-J13)</option>
                            <option value="OVULATION">Ovulation (J14)</option>
                            <option value="LUTEAL">Phase Lutéale (J15-J28)</option>
                        </select>
                    </div>

                    <button 
                        onClick={run}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-pink-500/20"
                    >
                        {loading ? "Simulation..." : <><Play size={18}/> Lancer la rencontre</>}
                    </button>

                    {data && (
                        <div className={`p-4 rounded-lg text-sm border ${data.success ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'}`}>
                            {data.message}
                        </div>
                    )}
                </div>

                {/* VUE 3D */}
                <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                    <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs text-white backdrop-blur">
                        Vue microscopique (Trompe de Fallope)
                    </div>
                    <Fertilization3D config={data} />
                </div>

            </div>
        </div>
    );
}