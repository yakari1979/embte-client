"use client";
import React, { useState, useEffect } from 'react';
import Photoelectric3D from '@/components/simulations/Photoelectric3D';
import { simulatePhotoelectric, PhotoelectricConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Zap, Sun, Gauge } from 'lucide-react';

export default function PhotoelectricPage() {
    const [params, setParams] = useState({ wavelength: 400, intensity: 50, workFunction: 2.3 }); // 2.3eV = Potassium approx
    const [data, setData] = useState<PhotoelectricConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulatePhotoelectric(params, token).then(res => setData(res.data)).catch(console.error);
        }
    }, [params]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-yellow-400">
                    <Sun size={36} /> Effet Photoélectrique
                </h1>
                <p className="text-gray-400 mt-2">Mise en évidence de la nature corpusculaire de la lumière (Photons).</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Contrôles */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        
                        {/* Métal */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Métal Cible (Cathode)</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white"
                                value={params.workFunction}
                                onChange={e => setParams({...params, workFunction: parseFloat(e.target.value)})}
                            >
                                <option value="1.9">Césium (Ws = 1.9 eV)</option>
                                <option value="2.3">Potassium (Ws = 2.3 eV)</option>
                                <option value="4.3">Zinc (Ws = 4.3 eV)</option>
                                <option value="4.7">Cuivre (Ws = 4.7 eV)</option>
                            </select>
                        </div>

                        {/* Lumière */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Longueur d'onde (Couleur)</label>
                                <input type="range" min="200" max="800" value={params.wavelength} onChange={e=>setParams({...params, wavelength: Number(e.target.value)})} 
                                    className="w-full h-2 rounded-lg cursor-pointer"
                                    style={{background: `linear-gradient(to right, #a855f7, #3b82f6, #22c55e, #eab308, #ef4444)`}}
                                />
                                <div className="text-right font-mono text-white mt-1">{params.wavelength} nm</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Intensité (Nombre de photons)</label>
                                <input type="range" min="10" max="100" value={params.intensity} onChange={e=>setParams({...params, intensity: Number(e.target.value)})} className="w-full accent-yellow-500"/>
                            </div>
                        </div>
                    </div>

                    {/* Énergies */}
                    <div className="bg-black p-4 rounded-xl border border-slate-700 font-mono text-sm space-y-3">
                        <div className="flex justify-between items-center text-yellow-400">
                            <span>E (Photon)</span>
                            <span className="font-bold">{data?.photonEnergy || "0.00"} eV</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400 border-b border-gray-800 pb-2">
                            <span>W (Extraction)</span>
                            <span>{params.workFunction} eV</span>
                        </div>
                        <div className={`flex justify-between items-center pt-1 ${data?.isEjected ? 'text-green-500' : 'text-red-500'}`}>
                            <span>Ec (Cinétique)</span>
                            <span className="font-bold">{data?.kineticEnergy || "0.00"} eV</span>
                        </div>
                        {data?.isEjected && (
                            <div className="text-xs text-center text-green-700 mt-2 flex items-center justify-center gap-1">
                                <Gauge size={12}/> Vitesse: {data.electronVelocity} km/s
                            </div>
                        )}
                    </div>
                </div>

                {/* 3D */}
                <div className="lg:col-span-9">
                    <Photoelectric3D 
                        config={data} 
                        wavelength={params.wavelength} 
                        intensity={params.intensity} 
                    />
                    {data && (
                        <div className={`mt-4 p-3 rounded-lg border text-sm text-center ${data.isEjected ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'}`}>
                            {data.message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}