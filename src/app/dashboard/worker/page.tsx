'use client';

import React, { useState, useEffect } from 'react';
import { workerService, authService } from '@/services/api';
import { HardHat, LogOut, MapPin, Phone, User, CheckCircle2, Loader2, Calendar } from 'lucide-react';

export default function WorkerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    workerService.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  // CAS 1 : PAS DE PROJET (Comme avant)
  if (data?.projects.length === 0) {
    return (
        <div className="min-h-screen bg-nexus-black text-nexus-text flex flex-col items-center justify-center p-4">
          <div className="bg-nexus-dark p-8 rounded-3xl border border-nexus-gray shadow-2xl max-w-md text-center w-full">
            <div className="w-20 h-20 bg-nexus-black border-2 border-nexus-gray rounded-full flex items-center justify-center mx-auto mb-6 text-nexus-concrete">
                <HardHat size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-nexus-text">Bonjour {data.profile.firstName}</h1>
            <p className="text-nexus-concrete mb-8">
                Votre compte est actif, mais vous n'avez pas encore été assigné à un chantier.
            </p>
            <button 
                onClick={() => authService.logout()}
                className="flex items-center justify-center gap-2 w-full py-3 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
            >
                <LogOut size={18} /> Se déconnecter
            </button>
          </div>
        </div>
    );
  }

  // CAS 2 : PROJET ASSIGNÉ (Dashboard Actif)
  return (
    <div className="min-h-screen bg-nexus-black text-nexus-text pb-20 pt-28 px-4">
      <div className="max-w-md mx-auto">
        
        {/* Header Profil */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Bonjour, {data.profile.firstName}</h1>
                <p className="text-nexus-concrete text-sm">{data.profile.jobTitle || "Ouvrier"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-nexus-orange text-black flex items-center justify-center font-bold">
                {data.profile.firstName[0]}{data.profile.lastName[0]}
            </div>
        </div>

        {/* Section Projets */}
        <h2 className="text-lg font-bold text-nexus-text mb-4 flex items-center gap-2">
            <HardHat className="text-nexus-orange" size={20}/> Mes Chantiers
        </h2>

        <div className="space-y-6">
            {data.projects.map((project: any) => (
                <div key={project.id} className="bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    {/* Indicateur Actif si c'est naicessaire on vas le faire pour les dynamique */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <HardHat size={80} />
                    </div>

                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 mb-3">
                            AFFECTÉ
                        </span>
                        
                        <h3 className="text-2xl font-bold text-white mb-1">{project.name}</h3>
                        <p className="text-nexus-concrete flex items-center gap-1 mb-6">
                            <MapPin size={16}/> {project.location}
                        </p>

                        {/* Chef de chantier */}
                        {project.manager && (
                            <div className="bg-nexus-black/50 p-4 rounded-xl border border-nexus-gray mb-6">
                                <p className="text-xs text-nexus-concrete uppercase font-bold mb-2">Chef de chantier</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-nexus-gray flex items-center justify-center text-nexus-concrete">
                                            <User size={16}/>
                                        </div>
                                        <span className="text-sm font-bold text-white">
                                            {project.manager.firstName} {project.manager.lastName}
                                        </span>
                                    </div>
                                    {project.manager.phone && (
                                        <a href={`tel:${project.manager.phone}`} className="p-2 bg-nexus-orange text-black rounded-full">
                                            <Phone size={16}/>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bouton Action (Simulation Pointage) */}
                        <button className="w-full py-4 bg-nexus-text text-nexus-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-nexus-orange transition-colors shadow-lg">
                            <CheckCircle2 size={20}/> Pointer ma présence
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}