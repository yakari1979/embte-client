"use client";
import React, { useState, useEffect } from 'react';
import CarbonDating3D from '@/components/simulations/CarbonDating3D';
import { simulateCarbon14, CarbonConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Clock, Bone, Activity, History, Calculator, Info } from 'lucide-react';

export default function CarbonPage() {
    const [years, setYears] = useState(0);
    const [data, setData] = useState<CarbonConfig | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            simulateCarbon14(years, token).then(res => setData(res.data)).catch(console.error);
        }
    }, [years]);

    // Repères historiques pour la frise
    const milestones = [
        { year: 0, label: "Présent", icon: "📍" },
        { year: 2000, label: "Jésus-Christ", icon: "✝️" },
        { year: 4500, label: "Pyramides", icon: "🔺" },
        { year: 5730, label: "1 Demi-vie", icon: "☢️" },
        { year: 11460, label: "2 Demi-vies", icon: "📉" },
        { year: 17000, label: "Lascaux", icon: "🎨" },
        { year: 25000, label: "Néandertal", icon: "🦴" },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-black text-white">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-green-500">
                    <Bone size={36} /> Datation au Carbone 14
                </h1>
                <p className="text-gray-400 mt-2">Utilisez la loi de décroissance radioactive pour déterminer l'âge d'un fossile.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- COLONNE GAUCHE : CONTRÔLES (4 Cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Contrôleur Temporel */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-200"><Clock size={18}/> Machine Temporelle</h3>
                        
                        <div className="mb-4">
                            <input 
                                type="range" 
                                min="0" max="30000" step="100" 
                                value={years} onChange={e=>setYears(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>

                        <div className="text-center p-4 bg-black rounded-xl border border-gray-700 mb-6">
                            <span className="text-xs text-gray-500 uppercase block mb-1">Âge de l'échantillon</span>
                            <span className="text-4xl font-black text-green-400 font-mono">{years.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 ml-2">ans</span>
                        </div>

                        {/* Frise Historique Verticale */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {milestones.map((m) => (
                                <button 
                                    key={m.year}
                                    onClick={() => setYears(m.year)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs transition-all ${Math.abs(years - m.year) < 500 ? 'bg-green-900/30 border border-green-600 text-white' : 'bg-gray-800 border border-transparent text-gray-400 hover:bg-gray-700'}`}
                                >
                                    <span className="text-lg">{m.icon}</span>
                                    <span className="flex-1 text-left font-bold">{m.label}</span>
                                    <span className="font-mono opacity-70">{m.year} ans</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panneau Scientifique */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><Calculator size={18}/> Loi Mathématique</h3>
                        <div className="text-sm text-gray-300 mb-3">
                            La décroissance suit une loi exponentielle :
                        </div>
                        <div className="bg-black p-3 rounded-lg text-center font-mono text-yellow-400 text-sm border border-gray-700 mb-3">
                            N(t) = N₀ × e<sup>-λt</sup>
                        </div>
                        <div className="text-xs text-gray-500">
                            Avec <strong>λ</strong> (constante radioactive) liée à la demi-vie : <br/>
                            T<sub>1/2</sub> = 5730 ans.
                        </div>
                    </div>
                </div>

                {/* --- COLONNE DROITE : VISUALISATION (8 Cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Scène 3D */}
                    <CarbonDating3D config={data} />

                    {/* Graphique & Analyse */}
                    {data && (
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Graphique de Décroissance */}
                            <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 relative h-48 overflow-hidden">
                                <div className="absolute top-2 left-2 text-xs font-bold text-gray-500 flex items-center gap-1">
                                    <Activity size={12}/> Courbe de Décroissance
                                </div>
                                {/* Grille */}
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                                    {[...Array(24)].map((_,i) => <div key={i} className="border border-gray-800/30"></div>)}
                                </div>
                                
                                {/* SVG Courbe */}
                                <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Courbe théorique C14 (start at 100, end at 0) */}
                                    {/* y = 100 * (0.5)^(x/5730) mappé sur 0-100 */}
                                    <path 
                                        d="M 0,0 Q 20,50 100,95" // Approximation de courbe exp
                                        fill="none" 
                                        stroke="#334155" 
                                        strokeWidth="2" 
                                        strokeDasharray="4"
                                    />
                                    {/* Point actuel */}
                                    <circle 
                                        cx={(years / 30000) * 100} 
                                        cy={100 - parseFloat(data.c14)} 
                                        r="3" 
                                        fill="#22c55e"
                                        className="animate-pulse"
                                    />
                                    {/* Lignes de rappel */}
                                    <line x1={(years / 30000) * 100} y1="100" x2={(years / 30000) * 100} y2={100 - parseFloat(data.c14)} stroke="#22c55e" strokeWidth="1" />
                                    <line x1="0" y1={100 - parseFloat(data.c14)} x2={(years / 30000) * 100} y2={100 - parseFloat(data.c14)} stroke="#22c55e" strokeWidth="1" />
                                </svg>

                                <div className="absolute bottom-2 right-2 text-xs text-gray-600">Temps (t)</div>
                                <div className="absolute top-2 left-10 text-xs text-gray-600">N(t)</div>
                            </div>

                            {/* Interprétation */}
                            <div className="bg-green-900/10 p-5 rounded-2xl border border-green-900/50 flex flex-col justify-center">
                                <h4 className="text-green-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                    <Info size={14}/> Rapport d'Analyse
                                </h4>
                                <p className="text-sm text-green-200 leading-relaxed">
                                    {data.message}
                                </p>
                                <div className="mt-4 flex justify-between items-center text-xs text-gray-400 border-t border-green-900/30 pt-2">
                                    <span>Taux initial : 100%</span>
                                    <span>Taux actuel : <span className="text-white font-bold">{data.c14}%</span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}