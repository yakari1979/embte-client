"use client";

import React, { useState, useEffect } from 'react';
import Transcription3D from '@/components/simulations/Transcription3D';
// Vérifie bien le nom ici (singulier ou pluriel selon ton fichier api.ts)
// J'utilise ici le singulier comme dans mes exemples précédents
import { getTranscriptionSimulations } from '@/services/api'; 
import Cookies from 'js-cookie';
import { Play, Pause, RotateCcw, FileText } from 'lucide-react';

export default function TranscriptionPage() {
  const [data, setData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger une nouvelle séquence au démarrage
  const loadData = async () => {
    setLoading(true);
    setIsPlaying(false);
    const token = Cookies.get('token');
    if (!token) return;
    try {
        // Appel API corrigé
        const res = await getTranscriptionSimulations(token);
        setData(res.data);
    } catch (err) {
        console.error("Erreur chargement simulation:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="text-blue-500" size={32}/> 
          Transcription ADN → ARNm
        </h1>
        <p className="text-gray-500">
            Observez comment l'ARN Polymérase lit le brin modèle et assemble les nucléotides libres.
            Notez le remplacement de la Thymine (T) par l'Uracile (U).
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
         
         {/* Zone 3D */}
    {data && !loading ? (
        <Transcription3D 
            data={data} 
            isPlaying={isPlaying} 
            // C'EST ICI : Quand la 3D finit, on met isPlaying à false
            onFinish={() => setIsPlaying(false)} 
        />
    ) : (
        <div className="h-[500px] flex items-center justify-center text-gray-400 bg-gray-900 rounded-xl">
            {loading ? "Chargement du génome..." : "Erreur de chargement"}
        </div>
    )}


         {/* Barre de Contrôle */}
         <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-between">
             <div className="flex gap-4">
                 <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                 >
                    {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Lire</>}
                 </button>

                 <button 
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                 >
                    <RotateCcw size={18}/> Nouvelle Séquence
                 </button>
             </div>

             <div className="text-sm text-gray-500 hidden sm:block">
                 Séquence générée par l'IA du serveur
             </div>
         </div>
      </div>

      {/* Explication Pédagogique */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Rappel de Cours</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  La transcription se déroule dans le <strong>noyau</strong>. L'enzyme ARN Polymérase ouvre la double hélice d'ADN et utilise un brin comme modèle pour synthétiser un brin d'ARN messager complémentaire.
              </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Le saviez-vous ?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                  L'ARNm est une copie "jetable" de l'information génétique. Une fois utilisé par les ribosomes pour créer des protéines, il est détruit par la cellule.
              </p>
          </div>
      </div>

    </div>
  );
}