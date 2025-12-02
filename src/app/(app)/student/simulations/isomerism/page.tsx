"use client";
import React, { useState, useEffect } from 'react';
import Isomer3D from '@/components/simulations/Isomer3D';
import { simulateIsomer, IsomerConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { FlaskConical, Shuffle, ArrowLeftRight, Info } from 'lucide-react';

export default function IsomerPage() {
    const [type, setType] = useState('Z');
    const [data, setData] = useState<IsomerConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateIsomer(type, token).then(res => setData(res.data));
        }
    }, [type]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-pink-500">
                    <FlaskConical size={36} /> Isomérie Z / E
                </h1>
                <p className="text-gray-400 mt-2">Chimie Organique : Stéréoisomérie des alcènes (Ex: But-2-ène).</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* GAUCHE : CONTRÔLES */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-white"><Shuffle size={18}/> Configuration</h3>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => setType('Z')}
                                className={`p-4 rounded-xl border text-left transition-all group ${type === 'Z' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:border-pink-500'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black">Z</span>
                                    <span className="text-xs bg-black/20 px-2 py-1 rounded">Zusammen (Ensemble)</span>
                                </div>
                                <div className={`text-sm mt-1 ${type === 'Z' ? 'text-pink-100' : 'text-gray-600'}`}>Groupes du même côté</div>
                            </button>

                            <button 
                                onClick={() => setType('E')}
                                className={`p-4 rounded-xl border text-left transition-all group ${type === 'E' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:border-cyan-500'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black">E</span>
                                    <span className="text-xs bg-black/20 px-2 py-1 rounded">Entgegen (Opposé)</span>
                                </div>
                                <div className={`text-sm mt-1 ${type === 'E' ? 'text-cyan-100' : 'text-gray-600'}`}>Groupes opposés</div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-sm text-gray-300 flex gap-3">
                        <Info className="shrink-0 text-pink-500"/>
                        <p>La double liaison C=C empêche la libre rotation. C'est ce qui fige la molécule dans une configuration Z ou E distincte.</p>
                    </div>
                </div>

                {/* DROITE : 3D */}
                <div className="lg:col-span-2 relative">
                    <Isomer3D isZ={type === 'Z'} />
                    
                    {/* Légende Molécule */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur p-3 rounded-xl border border-white/10 text-white shadow-xl">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Molécule</div>
                        <div className="text-xl font-bold font-mono">{data?.moleculeName}</div>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500 italic bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        {data?.message}
                    </div>
                </div>

            </div>
        </div>
    );
}