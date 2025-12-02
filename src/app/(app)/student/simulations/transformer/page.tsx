"use client";
import React, { useState, useEffect } from 'react';
import Transformer3D from '@/components/simulations/Transformer3D';
import { simulateTransformer, TransformerConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Zap, Settings2, ArrowRight } from 'lucide-react';

export default function TransformerPage() {
    const [u1, setU1] = useState(220);
    const [n1, setN1] = useState(500);
    const [n2, setN2] = useState(100);
    const [data, setData] = useState<TransformerConfig | null>(null);

    // Calcul temps réel
    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateTransformer({ u1, n1, n2 }, token).then(res => setData(res.data)).catch(console.error);
        }
    }, [u1, n1, n2]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-400">
                    <Zap size={36} /> Le Transformateur
                </h1>
                <p className="text-gray-400 mt-2">Conversion de tension alternative et rapport de transformation.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Contrôles (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-200"><Settings2 size={18}/> Configuration</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-red-400 uppercase block mb-1">Tension Primaire (U1)</label>
                                <input type="number" value={u1} onChange={e=>setU1(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white font-mono"/>
                            </div>
                            
                            <div className="border-t border-slate-700 pt-4">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Spires Primaire (N1)</label>
                                <input type="range" min="100" max="1000" step="50" value={n1} onChange={e=>setN1(Number(e.target.value))} className="w-full accent-red-500"/>
                                <div className="text-right font-mono text-red-400">{n1}</div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Spires Secondaire (N2)</label>
                                <input type="range" min="100" max="1000" step="50" value={n2} onChange={e=>setN2(Number(e.target.value))} className="w-full accent-blue-500"/>
                                <div className="text-right font-mono text-blue-400">{n2}</div>
                            </div>
                        </div>
                    </div>

                    {/* Résultat */}
                    {data && (
                        <div className="bg-black p-5 rounded-2xl border border-slate-700 shadow-inner">
                            <div className="text-xs text-gray-500 font-bold mb-2">SORTIE SECONDAIRE</div>
                            <div className="text-4xl font-bold text-blue-400 mb-1">{data.u2} V</div>
                            <div className="text-sm text-gray-400 mb-4">Type : <span className="text-white font-bold">{data.type}</span></div>
                            
                            <div className="flex items-center justify-between bg-slate-900 p-2 rounded text-xs">
                                <span>Rapport m = N2/N1</span>
                                <span className="font-mono text-yellow-400 font-bold">{data.ratio}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3D (9 cols) */}
                <div className="lg:col-span-9">
                    <Transformer3D u1={u1} u2={parseFloat(data?.u2 || "0")} n1={n1} n2={n2} />
                    <div className="mt-4 text-center text-sm text-gray-500 italic">
                        {data?.message}
                    </div>
                </div>

            </div>
        </div>
    );
}