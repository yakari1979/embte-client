"use client";
import React, { useState } from 'react';
import BohrAtom3D from '@/components/simulations/BohrAtom3D';
import { simulateBohr, BohrConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Atom, ArrowDown, ArrowUp, Ruler } from 'lucide-react';

export default function BohrPage() {
    const [n1, setN1] = useState(1);
    const [n2, setN2] = useState(1);
    const [data, setData] = useState<BohrConfig | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const jump = async (targetN: number) => {
        setIsAnimating(true);
        const startN = n2; // On part du niveau actuel
        setN1(startN);
        setN2(targetN);

        const token = Cookies.get('token');
        if(token) {
            try {
                const res = await simulateBohr({ n1: startN, n2: targetN }, token);
                setData(res.data);
            } catch (error) {
                console.error("Erreur API", error);
            }
        }
        
        setTimeout(() => setIsAnimating(false), 2000);
    };

    // Énergies théoriques pour le diagramme (En = -13.6/n^2)
    const levels = [1, 2, 3, 4, 5].map(n => ({ n, E: -13.6 / (n * n) }));

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-black text-white">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-purple-500">
                    <Atom size={36} /> Quantique : Atome de Bohr
                </h1>
                <p className="text-gray-400 mt-2">Niveaux d'énergie quantifiés et spectres d'émission/absorption de l'Hydrogène.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* GAUCHE : DIAGRAMME ÉNERGÉTIQUE (3 cols) */}
                <div className="lg:col-span-3 h-[600px] bg-gray-900 rounded-2xl border border-gray-800 p-6 relative">
                    <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><Ruler size={16}/> Diagramme Énergétique</h3>
                    
                    <div className="absolute left-10 top-16 bottom-10 w-0.5 bg-gray-600"></div> {/* Axe Y */}
                    <div className="absolute left-6 top-10 text-xs text-gray-500">E (eV)</div>

                    {levels.map((lvl) => (
                        <div 
                            key={lvl.n} 
                            className="absolute left-10 w-full pr-6 group"
                            style={{ bottom: `${(1 - (lvl.E / -13.6)) * 90}%` }} // Mapping approximatif pour l'affichage
                        >
                            <button 
                                onClick={() => jump(lvl.n)}
                                disabled={lvl.n === n2}
                                className={`relative w-full border-t-2 transition-all hover:pl-2 flex items-center justify-between text-xs ${lvl.n === n2 ? 'border-purple-500 text-purple-400' : 'border-gray-600 text-gray-500 hover:border-gray-400 hover:text-white'}`}
                            >
                                <span className="font-bold bg-gray-900 pr-2 -mt-2">n={lvl.n}</span>
                                <span className="font-mono bg-gray-900 pl-2 -mt-2">{lvl.E.toFixed(2)} eV</span>
                            </button>
                        </div>
                    ))}
                    
                    {/* Flèche de transition */}
                    {data && !isAnimating && (
                        <div className="absolute left-1/2 bottom-10 text-center animate-pulse">
                            <div className="text-xs text-purple-400 font-bold mb-1">ΔE = {data.deltaE} eV</div>
                        </div>
                    )}
                </div>

                {/* DROITE : 3D & SPECTRE (9 cols) */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="relative">
                        <BohrAtom3D n1={n1} n2={n2} color={data?.color || "#fff"} isAnimating={isAnimating} />
                        
                        {/* Indicateur État */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs">
                            État actuel : <span className="font-bold text-white">{n2 === 1 ? 'Fondamental (Stable)' : `Excité (n=${n2})`}</span>
                        </div>
                    </div>

                    {/* Analyseur Spectral */}
                    {data && (
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 animate-in fade-in">
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${data.type === 'EMISSION' ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'}`}>
                                        {data.type === 'EMISSION' ? <ArrowDown size={24}/> : <ArrowUp size={24}/>}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">{data.type} DE PHOTON</div>
                                        <div className="text-2xl font-bold text-white" style={{textShadow: `0 0 10px ${data.color}`}}>
                                            {data.lambda} nm
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Série spectrale</div>
                                    <div className="text-sm font-bold text-gray-300">
                                        {parseInt(data.lambda) < 400 ? 'Lyman (UV)' : parseInt(data.lambda) < 800 ? 'Balmer (Visible)' : 'Paschen (IR)'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Barre de Spectre Réaliste */}
                            <div className="relative h-12 w-full rounded-lg overflow-hidden border border-gray-700 bg-black">
                                {/* Fond arc-en-ciel sombre */}
                                <div className="absolute inset-0 opacity-30" style={{background: 'linear-gradient(90deg, #330033 0%, #000033 20%, #003300 50%, #333300 70%, #330000 100%)'}}></div>
                                
                                {/* La raie spectrale */}
                                <div 
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white,0_0_30px_white] z-10 transition-all duration-1000"
                                    style={{ 
                                        left: `${Math.min(Math.max((parseFloat(data.lambda) - 380) / (780 - 380) * 100, 0), 100)}%`,
                                        backgroundColor: data.color,
                                        boxShadow: `0 0 15px ${data.color}, 0 0 30px ${data.color}`
                                    }}
                                ></div>
                                
                                {/* Graduations */}
                                <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-gray-500 px-2">
                                    <span>380nm</span><span>500nm</span><span>600nm</span><span>700nm</span><span>780nm</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 text-sm text-gray-400 italic bg-black/30 p-3 rounded-lg border border-white/5">
                                "{data.message}"
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}