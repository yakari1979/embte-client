'use client';

import React, { useState, useEffect } from 'react';
import { workerService } from '@/services/api';
import { ArrowLeft, Camera, UploadCloud, CloudSun, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewReportPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [projectId, setProjectId] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    // On récupère les projets pour le select
    workerService.getDashboard().then(data => {
        setProjects(data.projects);
        if (data.projects.length > 0) setProjectId(data.projects[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('content', content);
    formData.append('weather', weather);
    
    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
    }

    try {
        await workerService.sendReport(formData);
        alert("Rapport envoyé avec succès !");
        router.push('/dashboard/worker/reports');
    } catch (error) {
        alert("Erreur lors de l'envoi.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-black text-nexus-text p-4 pt-24 pb-24">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard/worker/reports" className="flex items-center gap-2 text-nexus-concrete mb-6">
            <ArrowLeft size={20}/> Annuler
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-white">Rapport de Chantier</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Sélection Projet */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase">Chantier Concerné</label>
                <select 
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-nexus-dark border border-nexus-gray rounded-xl p-4 text-white outline-none focus:border-nexus-orange"
                >
                    {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* 2. Météo */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase">Météo sur site</label>
                <div className="relative">
                    <CloudSun className="absolute left-4 top-4 text-nexus-concrete" size={20}/>
                    <input 
                        placeholder="Ex: Ensoleillé, Pluie..." 
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="w-full bg-nexus-dark border border-nexus-gray rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-nexus-orange"
                    />
                </div>
            </div>

            {/* 3. Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase">Avancement & Remarques</label>
                <textarea 
                    required
                    rows={5}
                    placeholder="Qu'avez-vous fait aujourd'hui ? Problèmes rencontrés ?" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-nexus-dark border border-nexus-gray rounded-xl p-4 text-white outline-none focus:border-nexus-orange"
                />
            </div>

            {/* 4. Upload Fichiers */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase">Photos / Vidéos (Max 5)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-nexus-gray rounded-xl bg-nexus-dark/50 hover:bg-nexus-dark hover:border-nexus-orange cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 text-nexus-concrete mb-2" />
                        <p className="text-sm text-nexus-concrete">
                            <span className="font-bold text-nexus-orange">Cliquez pour ajouter</span> ou prendre une photo
                        </p>
                        {files && <p className="text-xs text-green-500 mt-2">{files.length} fichier(s) sélectionné(s)</p>}
                    </div>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*,application/pdf"
                        className="hidden" 
                        onChange={(e) => setFiles(e.target.files)}
                    />
                </label>
            </div>

            <button 
                disabled={loading}
                className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                {loading ? "Envoi en cours..." : <>Envoyer le rapport <Send size={20}/></>}
            </button>

        </form>
      </div>
    </div>
  );
}