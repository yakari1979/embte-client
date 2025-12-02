"use client";
import React, { useState, useEffect } from 'react';
import Titration3D from '@/components/simulations/Titration3D';
import { simulateTitration, TitrationConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { FlaskConical, Beaker, Pipette, Plus, RefreshCcw } from 'lucide-react';

export default function TitrationPage() {
    const [volumeAdded, setVolumeAdded] = useState(0);
    const [data, setData] = useState<TitrationConfig | null>(null);
    const [history, setHistory] = useState<{v: number, ph: number}[]>([]); // Pour le graphe

    const acidConc = 0.1;
    const acidVol = 20;
    const baseConc = 0.1;

    const addDrop = async (amount: number) => {
        const newVol = Math.min(50, volumeAdded + amount);
        setVolumeAdded(newVol);
        
        const token = Cookies.get('token');
        if(token) {
            const res = await simulateTitration({ 
                volumeAdded: newVol, 
                acidConcentration: acidConc, 
                baseConcentration: baseConc, 
                volumeAcid: acidVol 
            }, token);
            setData(res.data);
            setHistory(prev => [...prev, { v: newVol, ph: parseFloat(res.data.ph) }]);
        }
    };

    const reset = () => {
        setVolumeAdded(0);
        setHistory([]);
        setData(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-teal-400">
                    <FlaskConical size={36} /> Titrage pH-métrique
                </h1>
                <p className="text-gray-400 mt-2">Dosage d'un Acide Fort par une Base Forte. Suivi du pH et indicateurs colorés.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* GAUCHE : Contrôles (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Pipette/> Burette (Base NaOH)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => addDrop(0.5)} className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 font-bold text-sm">+0.5 mL</button>
                            <button onClick={() => addDrop(1)} className="p-3 bg-blue-700 rounded-lg hover:bg-blue-600 font-bold text-sm">+1 mL</button>
                            <button onClick={() => addDrop(5)} className="p-3 bg-blue-800 rounded-lg hover:bg-blue-700 font-bold text-sm">+5 mL</button>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-300">
                            <span>Versé : <span className="font-bold text-white">{volumeAdded} mL</span></span>
                            <button onClick={reset} className="text-gray-500 hover:text-white flex items-center gap-1 text-xs"><RefreshCcw size={12}/> Reset</button>
                        </div>
                    </div>

                    {/* pH Mètre Digital */}
                    <div className="bg-black p-6 rounded-2xl border-4 border-slate-700 font-mono text-center shadow-lg relative">
                        <div className="text-gray-500 text-xs absolute top-2 left-3">pH-MÈTRE</div>
                        <div className="text-6xl font-bold text-green-500">{data?.ph || "---"}</div>
                        {data && (
                            <div className="mt-2 text-xs font-sans text-gray-400">
                                Équivalence à {data.equivalenceVolume} mL
                            </div>
                        )}
                    </div>

                    {/* GRAPHE pH = f(V) */}
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 h-48 relative overflow-hidden">
                        <div className="text-xs text-gray-400 absolute top-2 left-2">pH = f(V_base)</div>
                        {/* Axes */}
                        <div className="absolute left-8 bottom-8 top-8 w-0.5 bg-gray-600"></div>
                        <div className="absolute left-8 bottom-8 right-8 h-0.5 bg-gray-600"></div>
                        
                        <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 50 14" preserveAspectRatio="none">
                            {/* Ligne Equivalence */}
                            <line x1="20" y1="0" x2="20" y2="14" stroke="gray" strokeDasharray="2" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                            {/* Courbe */}
                            <path 
                                d={`M 0,${14 - (-Math.log10(0.1))} ${history.map(p => `L ${p.v},${14 - p.ph}`).join(' ')}`}
                                fill="none" 
                                stroke="#14b8a6" 
                                strokeWidth="0.5"
                            />
                        </svg>
                    </div>
                </div>

                {/* DROITE : 3D (8 cols) */}
                <div className="lg:col-span-8 relative">
                    <Titration3D config={data} volumeAdded={volumeAdded} />
                    
                    {data && (
                        <div className={`mt-4 p-4 rounded-xl border text-sm ${parseFloat(data.ph) === 7 ? 'bg-green-900/30 border-green-500 text-green-300' : 'bg-slate-800 border-slate-600 text-gray-300'}`}>
                            {data.message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}