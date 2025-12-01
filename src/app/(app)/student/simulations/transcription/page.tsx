"use client";

import React, { useState, useEffect } from 'react';
import Transcription3D from '@/components/simulations/Transcription3D';
import { getTranscriptionSimulations } from '@/services/api';
import Cookies from 'js-cookie';
import { Play, Pause, RotateCcw, FileText, ArrowRight } from 'lucide-react';

export default function TranscriptionPage() {
  const [data, setData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setIsPlaying(false);
    const token = Cookies.get('token');
    if (!token) return;
    try {
        const res = await getTranscriptionSimulations(token);
        setData(res.data);
    } catch (err) {
        console.error("Erreur chargement:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="text-blue-600" size={36}/> 
          Transcription : Du Gène à l'ARNm
        </h1>
        <p className="text-gray-500 mt-2">
            Observez le travail de l'ARN Polymérase dans le noyau cellulaire.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
         
         {/* ZONE PRINCIPALE (Simulation) */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Cadre 3D */}
            {data && !loading ? (
                <Transcription3D 
                    data={data} 
                    isPlaying={isPlaying} 
                    onFinish={() => setIsPlaying(false)} 
                />
            ) : (
                <div className="h-[500px] flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-xl border border-gray-700 animate-pulse">
                    <FileText size={48} className="mb-4 opacity-50"/>
                    <p>{loading ? "Séquençage du génome en cours..." : "Erreur de chargement"}</p>
                </div>
            )}

            {/* Barre de Contrôle */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                 <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all shadow-lg ${isPlaying ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                 >
                    {isPlaying ? <><Pause size={20}/> PAUSE</> : <><Play size={20}/> DÉMARRER</>}
                 </button>

                 <button 
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 >
                    <RotateCcw size={16}/> Générer nouvelle séquence
                 </button>
            </div>
         </div>

         {/* ZONE LATÉRALE (Analyse Séquence) */}
         <div className="lg:col-span-4 space-y-6">
             
             {/* Séquenceur */}
             <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 font-mono text-sm h-fit">
                 <h3 className="text-gray-400 text-xs uppercase font-bold mb-4 tracking-widest border-b border-gray-800 pb-2">Analyseur de Séquence</h3>
                 
                 <div className="space-y-6">
                     <div>
                         <div className="text-blue-400 mb-1 flex justify-between">
                             <span>BRIN MODÈLE (ADN)</span>
                             <span className="text-[10px] bg-blue-900/50 px-1 rounded">3' → 5'</span>
                         </div>
                         <div className="break-all tracking-widest text-gray-300 leading-relaxed">
                             {data?.templateStrand?.join('') || "..."}
                         </div>
                     </div>

                     <div className="flex justify-center">
                         <ArrowRight className="text-gray-600 rotate-90" size={24}/>
                     </div>

                     <div>
                         <div className="text-pink-400 mb-1 flex justify-between">
                             <span>TRANSCRIT (ARNm)</span>
                             <span className="text-[10px] bg-pink-900/50 px-1 rounded">5' → 3'</span>
                         </div>
                         <div className="break-all tracking-widest text-white font-bold leading-relaxed bg-gray-800/50 p-3 rounded border border-gray-700">
                             {data?.mrnaStrand?.join('') || "..."}
                         </div>
                     </div>
                 </div>
                 
                 <div className="mt-6 text-xs text-gray-500 italic">
                     * Notez la complémentarité : A→U, T→A, C→G, G→C
                 </div>
             </div>

             {/* Carte Info */}
             <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                 <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                     <FileText size={16}/> Rôle Clé
                 </h4>
                 <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                     L'ARN Polymérase ne fait pas que copier. Elle déroule l'ADN, apparie les bases, et ré-enroule l'ADN derrière elle. C'est une usine moléculaire autonome.
                 </p>
             </div>

         </div>

      </div>
    </div>
  );
}