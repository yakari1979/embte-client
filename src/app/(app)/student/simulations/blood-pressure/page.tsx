"use client";
import React, { useState } from 'react';
import HeartRate3D from '@/components/simulations/HeartRate3D';
import { simulateBloodPressure, BloodPressureConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { HeartPulse, Scissors, Syringe, Activity, AlertTriangle } from 'lucide-react';

export default function BloodPressurePage() {
    const [situation, setSituation] = useState('NORMAL');
    const [nerveCut, setNerveCut] = useState('NONE');
    const [data, setData] = useState<BloodPressureConfig>({
        heartRate: 70,
        vesselDiameter: 10,
        nerveActivity: { hering: 'NORMAL', para: 'NORMAL', ortho: 'NORMAL' },
        message: "État physiologique normal."
    });

    const run = async (sit: string, cut: string) => {
        setSituation(sit);
        setNerveCut(cut);
        
        const token = Cookies.get('token');
        if(!token) return;

        try {
            const res = await simulateBloodPressure({ situation: sit, nerveCut: cut }, token);
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-red-500">
                    <HeartPulse size={36} /> Régulation Pression Artérielle
                </h1>
                <p className="text-gray-400 mt-2">Le Baroréflexe : Interactions Cœur / Bulbe Rachid / Vaisseaux.</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-6">
                
                {/* --- CONTRÔLES --- */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Situations */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-300"><Syringe size={18}/> Situations</h3>
                        <div className="space-y-2">
                            <button onClick={() => run('NORMAL', nerveCut)} className={`w-full p-2 rounded text-sm border ${situation === 'NORMAL' ? 'bg-green-600 border-green-500' : 'border-gray-600 hover:bg-gray-700'}`}>
                                Repos
                            </button>
                            <button onClick={() => run('HYPERTENSION', nerveCut)} className={`w-full p-2 rounded text-sm border ${situation === 'HYPERTENSION' ? 'bg-red-600 border-red-500' : 'border-gray-600 hover:bg-gray-700'}`}>
                                Hypertension (Adrénaline)
                            </button>
                            <button onClick={() => run('HYPOTENSION', nerveCut)} className={`w-full p-2 rounded text-sm border ${situation === 'HYPOTENSION' ? 'bg-orange-600 border-orange-500' : 'border-gray-600 hover:bg-gray-700'}`}>
                                Hypotension (Hémorragie)
                            </button>
                        </div>
                    </div>

                    {/* Sections Nerveuses */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-300"><Scissors size={18}/> Sections Expérimentales</h3>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm"
                            value={nerveCut} onChange={(e) => run(situation, e.target.value)}
                        >
                            <option value="NONE">Aucune (Nerfs Intacts)</option>
                            <option value="HERING">Section Nerfs de Hering/Cyon</option>
                            <option value="PNEUMOGASTRIC">Section Nerfs X (Vagues)</option>
                        </select>
                    </div>

                    {/* Moniteur */}
                    <div className="bg-black p-4 rounded-xl border border-green-900 font-mono text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-green-700">ECG</span>
                            <Activity className="animate-pulse"/>
                        </div>
                        <div className="text-4xl font-bold">{data.heartRate} <span className="text-sm">BPM</span></div>
                        <div className="text-xs mt-2 opacity-70">Diamètre Vaisseaux: {data.vesselDiameter}mm</div>
                    </div>

                </div>

                {/* --- VISUALISATION 3D --- */}
                <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                    <HeartRate3D config={data} />
                    
                    {/* Message d'analyse */}
                    <div className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur border border-gray-600 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-1">Analyse Physiologique</h4>
                        <p className="text-white text-sm leading-relaxed">{data.message}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}