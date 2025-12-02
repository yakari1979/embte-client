"use client";
import React, { useState, useEffect } from 'react';
import VSEPR3D from '@/components/simulations/VSEPR3D';
import { simulateVSEPR, VSEPRConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Network, Info, Shapes } from 'lucide-react';

export default function VSEPRPage() {
    const [type, setType] = useState('AX4');
    const [data, setData] = useState<VSEPRConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateVSEPR(type, token).then(res => setData(res.data));
        }
    }, [type]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-teal-400">
                    <Shapes size={36} /> Géométrie Moléculaire (VSEPR)
                </h1>
                <p className="text-gray-400 mt-2">Valence Shell Electron Pair Repulsion : Prédire la forme des molécules.</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-8">
                
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4">Formule Générale</h3>
                        <div className="space-y-2">
                            {['AX2', 'AX3', 'AX4', 'AX3E1', 'AX2E2'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`w-full p-3 rounded-lg text-left font-bold transition-all ${type === t ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-900 text-gray-400 hover:bg-slate-700'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {data && (
                        <div className="bg-black p-4 rounded-xl border border-gray-700 text-sm">
                            <div className="text-teal-400 font-bold mb-1">{data.shapeName}</div>
                            <div className="text-white mb-3">Angle : {data.angle}</div>
                            <p className="text-gray-500 italic">{data.message}</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <VSEPR3D config={data} />
                </div>

            </div>
        </div>
    );
}