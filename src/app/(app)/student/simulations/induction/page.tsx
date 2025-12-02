"use client";
import React, { useState, useEffect, useRef } from 'react';
import Induction3D from '@/components/simulations/Induction3D';
import { simulateInduction, InductionConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Magnet, ArrowRightLeft, History, Trash2, Zap, Activity } from 'lucide-react';

export default function InductionPage() {
    const [magnetPos, setMagnetPos] = useState(-5); 
    const [lastPos, setLastPos] = useState(-5);
    const [data, setData] = useState<InductionConfig | null>(null);

    // --- LOGIQUE D'HISTORIQUE ---
    const [records, setRecords] = useState<{ id: number, voltage: string, time: string }[]>([]);
    
    // On utilise useRef pour suivre le pic actuel sans déclencher de re-rendus inutiles dans la boucle
    const currentPeakRef = useRef(0); 
    const isRecordingRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            const velocity = magnetPos - lastPos;
            setLastPos(magnetPos); 

            const token = Cookies.get('token');
            if(token) {
                const res = await simulateInduction({ magnetVelocity: velocity, magnetPosition: magnetPos }, token);
                setData(res.data);

                // --- ALGORITHME DE DÉTECTION DE PIC ---
                const currentVolts = Math.abs(parseFloat(res.data.voltage));

                if (currentVolts > 0.1) {
                    // L'élève est en train de bouger l'aimant
                    isRecordingRef.current = true;
                    // On garde la valeur la plus haute de ce mouvement
                    if (currentVolts > currentPeakRef.current) {
                        currentPeakRef.current = currentVolts;
                    }
                } else {
                    // L'élève s'est arrêté (Tension ~ 0)
                    if (isRecordingRef.current && currentPeakRef.current > 0.5) {
                        // Le mouvement vient de finir, on sauvegarde le record
                        const newRecord = {
                            id: Date.now(),
                            voltage: currentPeakRef.current.toFixed(2),
                            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        };
                        // On ajoute au début de la liste
                        setRecords(prev => [newRecord, ...prev]);
                    }
                    
                    // Reset pour le prochain mouvement
                    isRecordingRef.current = false;
                    currentPeakRef.current = 0;
                }
            }
        }, 100); 

        return () => clearInterval(interval);
    }, [magnetPos, lastPos]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-amber-500">
                    <Magnet size={36} /> Induction Électromagnétique
                </h1>
                <p className="text-gray-400 mt-2">Déplacez l'aimant pour créer du courant. Observez la Loi de Lenz.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- COLONNE GAUCHE : CONTRÔLES (4 cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Contrôle Aimant */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-white"><ArrowRightLeft/> Déplacer l'Aimant</h3>
                        
                        {/* Slider personnalisé */}
                        <div className="relative h-12 flex items-center">
                            <div className="absolute w-full h-2 bg-slate-600 rounded-full"></div>
                            {/* Repères */}
                            <div className="absolute left-0 w-1 h-4 bg-slate-500 rounded"></div>
                            <div className="absolute left-1/2 w-1 h-4 bg-amber-500 rounded"></div>
                            <div className="absolute right-0 w-1 h-4 bg-slate-500 rounded"></div>
                            
                            <input 
                                type="range" 
                                min="-5" max="5" step="0.1" 
                                value={magnetPos} 
                                onChange={(e) => setMagnetPos(parseFloat(e.target.value))}
                                className="relative w-full h-8 opacity-0 cursor-pointer z-10"
                            />
                            
                            {/* Curseur visuel qui suit */}
                            <div 
                                className="absolute h-6 w-4 bg-white border-2 border-amber-500 rounded shadow-lg pointer-events-none transition-transform duration-75"
                                style={{ left: `${((magnetPos + 5) / 10) * 100}%`, transform: 'translateX(-50%)' }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
                            <span>-5 (Gauche)</span>
                            <span className="text-amber-500">0 (Bobine)</span>
                            <span>+5 (Droite)</span>
                        </div>
                        
                        <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-900/50 flex gap-3 items-start">
                            <Zap className="text-amber-500 shrink-0 mt-1" size={16}/>
                            <p className="text-xs text-amber-200">
                                <strong>Challenge :</strong> Bougez le curseur très vite pour générer un pic de tension maximum !
                            </p>
                        </div>
                    </div>

                    {/* Cadran Multimètre Digital */}
                    <div className="bg-black p-6 rounded-2xl border-4 border-slate-700 font-mono text-center shadow-xl relative overflow-hidden">
                        <div className="text-gray-500 text-xs absolute top-3 left-3 font-bold tracking-widest">VOLTMÈTRE</div>
                        
                        {/* Valeur */}
                        <div className={`text-6xl font-black tracking-tighter my-2 transition-colors duration-100 ${parseFloat(data?.voltage || "0") !== 0 ? (parseFloat(data?.voltage || "0") > 0 ? 'text-green-500' : 'text-red-500') : 'text-gray-700'}`}>
                            {data?.voltage || "0.00"}
                        </div>
                        <div className="text-xl text-gray-500 font-bold">VOLTS</div>

                        {/* Barre graphe en bas */}
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-75" 
                                style={{ width: `${Math.min(Math.abs(parseFloat(data?.voltage || "0")) * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* --- HISTORIQUE DES MESURES (NOUVEAU) --- */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[300px]">
                        <div className="p-4 bg-slate-750 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-gray-300">
                                <History size={16}/> Vos Records
                            </h3>
                            {records.length > 0 && (
                                <button 
                                    onClick={() => setRecords([])}
                                    className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-900/30"
                                >
                                    <Trash2 size={12}/> Effacer
                                </button>
                            )}
                        </div>
                        
                        <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {records.length === 0 ? (
                                <div className="text-center text-gray-500 text-xs py-8 italic">
                                    Aucune mesure enregistrée.<br/>Faites bouger l'aimant !
                                </div>
                            ) : (
                                records.map((rec, index) => (
                                    <div key={rec.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700 animate-in slide-in-from-left-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 font-mono">#{records.length - index}</span>
                                            <span className={`font-mono font-bold ${parseFloat(rec.voltage) > 5 ? 'text-amber-400' : 'text-white'}`}>
                                                {rec.voltage} V
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-600">{rec.time}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* --- VISUALISATION 3D (Droite - 8 cols) --- */}
                <div className="lg:col-span-8 relative">
                    <Induction3D magnetPosition={magnetPos} config={data} />
                    
                    {/* Explication Flottante */}
                    {data && Math.abs(parseFloat(data.voltage)) > 0.1 && (
                        <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-amber-500/30 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                            <h4 className="text-xs font-bold text-amber-500 uppercase mb-1 flex items-center gap-2">
                                <Activity size={14}/> Analyse Temps Réel
                            </h4>
                            <p className="text-white text-sm leading-relaxed">
                                {data.message}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}