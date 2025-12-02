"use client";
import React, { useState, useEffect } from 'react';
import AtomConfig3D from '@/components/simulations/AtomConfig3D';
import { simulateAtom, AtomConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Atom, Layers, Orbit, Hexagon } from 'lucide-react';

export default function AtomConfigPage() {
    const [element, setElement] = useState('C');
    const [data, setData] = useState<AtomConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateAtom(element, token).then(res => setData(res.data));
        }
    }, [element]);

    const elementsList = [
        { id: 'H', name: 'Hydrogène', z: 1 },
        { id: 'C', name: 'Carbone', z: 6 },
        { id: 'O', name: 'Oxygène', z: 8 },
        { id: 'Na', name: 'Sodium', z: 11 },
        { id: 'Cl', name: 'Chlore', z: 17 },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-500">
                    <Atom size={36} /> Structure de la Matière
                </h1>
                <p className="text-gray-400 mt-2">Visualisez la répartition des électrons sur les couches électroniques (K, L, M).</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-8">
                
                {/* GAUCHE : SÉLECTION */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-200">Tableau Périodique</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {elementsList.map((el) => (
                                <button 
                                    key={el.id}
                                    onClick={() => setElement(el.id)}
                                    className={`p-3 rounded-xl border flex flex-col items-center transition-all ${element === el.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-gray-400 hover:bg-slate-700'}`}
                                >
                                    <span className="text-xl font-bold font-mono">{el.id}</span>
                                    <span className="text-[10px] uppercase">{el.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fiche d'identité */}
                    {data && (
                        <div className="bg-black p-5 rounded-2xl border border-slate-700 font-mono text-sm space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Hexagon size={100} />
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-500">Numéro Z</span>
                                <span className="text-xl font-bold text-white">{data.z}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-500">Nom</span>
                                <span className="text-xl font-bold text-blue-400">{data.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Configuration</span>
                                <span className="text-lg font-bold text-yellow-400 bg-slate-900 px-2 py-1 rounded">
                                    {data.electronicConfig}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE : 3D */}
                <div className="lg:col-span-3 space-y-4">
                    <AtomConfig3D config={data} />
                    
                    {data && (
                        <div className="grid grid-cols-3 gap-4">
                            {data.shells.map((count, i) => (
                                <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Couche {['K','L','M'][i]}</div>
                                    <div className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                                        <Layers size={18} className="text-blue-500"/> {count} e⁻
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-center text-gray-500 text-sm italic mt-4">{data?.message}</p>
                </div>

            </div>
        </div>
    );
}