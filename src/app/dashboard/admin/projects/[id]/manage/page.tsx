'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/api';
import { ArrowLeft, HardHat, Save, Users, Calendar, CheckCircle2, Phone, User, Box, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ManageProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 1. Charger le projet (qui inclut maintenant les workers grâce à la modif backend)
    adminService.getProjectDetails(id as string).then(p => {
        setProject(p);
        setSelectedManager(p.managerId || '');
    });
    // 2. Charger la liste des managers
    adminService.getUsersByRole('MANAGER').then(setManagers);
  }, [id]);

  const handleAssign = async () => {
    setSaving(true);
    try {
        await adminService.assignManager(id as string, selectedManager);
        alert("Manager assigné avec succès ! Le chantier est maintenant actif.");
        // On recharge la page pour voir le changement de statut
        window.location.reload(); 
    } catch (e) {
        alert("Erreur lors de l'assignation");
    } finally {
        setSaving(false);
    }
  };

  if (!project) return <div className="min-h-screen flex items-center justify-center text-nexus-text">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <Link href="/dashboard/admin/projects" className="inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-6 transition-colors">
        <ArrowLeft size={18}/> Retour aux chantiers
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-nexus-text mb-2">Gestion : {project.name}</h1>
            <p className="text-nexus-concrete">Assignation des ressources et suivi d'équipe.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-bold font-mono ${
            project.status === 'IN_PROGRESS' 
            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
            : 'bg-nexus-dark border-nexus-gray text-nexus-text'
        }`}>
            STATUS: {project.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. CARTE ASSIGNATION MANAGER */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-8 shadow-xl h-fit">
            <h2 className="text-xl font-bold text-nexus-text mb-6 flex items-center gap-2">
                <HardHat className="text-nexus-orange"/> Chef de Chantier
            </h2>
            
            <div className="space-y-4">
                <label className="text-sm font-bold text-nexus-concrete uppercase">Responsable du projet</label>
                <div className="relative">
                    <select 
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                        className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none appearance-none cursor-pointer"
                    >
                        <option value="">-- Non assigné --</option>
                        {managers.map((m: any) => (
                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.jobTitle})</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl text-sm text-nexus-text mt-4">
                    <p>Assigner un manager passera automatiquement le statut du projet à <strong>IN_PROGRESS</strong>.</p>
                </div>

                <button 
                    onClick={handleAssign}
                    disabled={saving || !selectedManager}
                    className="w-full bg-nexus-orange text-black font-bold py-3.5 rounded-xl mt-4 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-nexus-orange/20"
                >
                    {saving ? "Enregistrement..." : <><Save size={18}/> Enregistrer l'affectation</>}
                </button>
            </div>
        </div>

        {/* 2. CARTE ÉQUIPE TECHNIQUE (Dynamique) */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-8 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-nexus-text flex items-center gap-2">
                    <Users className="text-purple-500"/> Équipe Technique
                </h2>
                <span className="bg-nexus-black px-3 py-1 rounded-full text-xs font-bold text-nexus-text border border-nexus-gray">
                    {project.workers?.length || 0} Membres
                </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2 custom-scrollbar">
                {project.workers && project.workers.length > 0 ? (
                    project.workers.map((worker: any) => (
                        <div key={worker.id} className="flex items-center justify-between p-3 rounded-xl bg-nexus-black border border-nexus-gray hover:border-nexus-orange/30 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-nexus-dark border border-nexus-gray flex items-center justify-center text-nexus-text font-bold text-sm">
                                    {worker.firstName[0]}{worker.lastName[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-nexus-text group-hover:text-nexus-orange transition-colors">
                                        {worker.firstName} {worker.lastName}
                                    </p>
                                    <p className="text-xs text-nexus-concrete">{worker.jobTitle || "Ouvrier"}</p>
                                </div>
                            </div>
                            {worker.phone && (
                                <a href={`tel:${worker.phone}`} className="p-2 text-nexus-concrete hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Phone size={16}/>
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-nexus-black/30 rounded-xl border border-nexus-gray/50 border-dashed">
                        <Users size={32} className="mx-auto text-nexus-concrete/50 mb-3"/>
                        <p className="text-nexus-concrete text-sm">Aucun ouvrier assigné.</p>
                        <p className="text-xs text-nexus-concrete/50 mt-1">C'est au Manager d'ajouter son équipe.</p>
                    </div>
                )}
            </div>
        </div>

         {/* BOUTON AUDIT STOCK */}
         <div className="anim-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-nexus-text mb-4 flex items-center gap-2">
                <Box className="text-blue-500"/> Gestion des Stocks
            </h3>
            <p className="text-nexus-concrete text-sm mb-6">
                Vérifiez les niveaux de stock et l'historique des consommations sur ce chantier.
            </p>
            <Link 
                href={`/dashboard/admin/projects/${id}/inventory`} 
                className="w-full py-3 bg-nexus-black border border-nexus-gray text-nexus-text font-bold rounded-xl hover:bg-nexus-dark hover:border-blue-500 transition-all flex items-center justify-center gap-2"
            >
                <ShieldCheck size={18}/> Auditer l'Inventaire
            </Link>
        </div>

      </div>
    </div>
  );
}