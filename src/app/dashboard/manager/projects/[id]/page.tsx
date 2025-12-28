'use client';

import React, { useState, useEffect } from 'react';
import { managerService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, TrendingUp, CheckCircle2, Loader2, 
  MapPin, Phone, Mail, User, Ruler, Building, Calendar, Users, 
  ClipboardList, ArrowRight, Package // <-- AJOUT DE L'ICÔNE PACKAGE
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerProjectControl() {
  const { id } = useParams();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    managerService.getProjectDetails(id as string)
        .then(data => {
            setProject(data);
            setProgress(data.progress || 0);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            // alert("Erreur chargement projet."); 
        });
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
        await managerService.updateProgress(id as string, progress);
        alert("✅ Avancement publié ! Le client a été notifié.");
    } catch (e) {
        alert("Erreur lors de la mise à jour");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-28 px-4">
        
        {/* HEADER NAV */}
        <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard/manager" className="flex items-center gap-2 text-nexus-concrete hover:text-nexus-text transition-colors">
                <ArrowLeft size={18}/> Retour au Tableau de bord
            </Link>
            <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                Projet Actif
            </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- COLONNE GAUCHE : CONTRÔLE PRINCIPAL --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. CARTE DE CONTRÔLE (AVANCEMENT) */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <TrendingUp size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-nexus-orange rounded-xl flex items-center justify-center text-black shadow-lg shadow-nexus-orange/20">
                                <TrendingUp size={28}/>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-nexus-text">{project.name}</h1>
                                <p className="text-nexus-concrete text-sm flex items-center gap-1">
                                    <MapPin size={14}/> {project.location}
                                </p>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-nexus-concrete uppercase tracking-wider">Progression Chantier</label>
                                <span className="text-6xl font-black text-nexus-orange">{progress}%</span>
                            </div>

                            <div className="relative h-14 flex items-center group">
                                <div className="absolute w-full h-4 bg-nexus-black rounded-full overflow-hidden border border-nexus-gray">
                                    <div 
                                        className="h-full bg-gradient-to-r from-nexus-orange to-yellow-500 transition-all duration-100 ease-out" 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <input 
                                    type="range" min="0" max="100" value={progress}
                                    onChange={(e) => setProgress(parseInt(e.target.value))}
                                    className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                                />
                                <div 
                                    className="absolute w-8 h-8 bg-nexus-text rounded-full shadow-xl border-4 border-nexus-orange z-10 pointer-events-none transition-all duration-100 ease-out group-hover:scale-125"
                                    style={{ left: `calc(${progress}% - 16px)` }}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-nexus-text text-nexus-black font-bold py-4 rounded-xl text-lg hover:bg-nexus-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
                        >
                            {saving ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                            {saving ? "Mise à jour..." : "Publier l'avancement"}
                        </button>
                    </div>
                </div>

                {/* 2. DONNÉES TECHNIQUES */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                        <Ruler className="text-purple-500"/> Fiche Technique
                    </h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <InfoItem label="Type" value={project.projectType} />
                        <InfoItem label="Surface" value={`${project.surface} m²`} />
                        <InfoItem label="Structure" value={project.buildingType} />
                        <InfoItem label="Étages" value={`R+${project.floors}`} />
                        <InfoItem label="Standing" value={project.standing || "Standard"} />
                        <InfoItem label="Début" value={new Date(project.startDate).toLocaleDateString()} />
                    </div>
                    <div className="mt-6 pt-4 border-t border-nexus-gray">
                        <p className="text-xs font-bold text-nexus-concrete uppercase mb-2">Description Client</p>
                        <p className="text-nexus-text text-sm leading-relaxed bg-nexus-black p-4 rounded-xl border border-nexus-gray/50">
                            {project.description}
                        </p>
                    </div>
                </div>

            </div>

            {/* --- COLONNE DROITE : INFO PRATIQUES --- */}
            <div className="space-y-8">
                
                {/* 3. FICHE CLIENT */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                        <User className="text-blue-500"/> Client Propriétaire
                    </h3>
                    {project.client ? (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-nexus-black border-2 border-nexus-gray rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-nexus-text">
                                {project.client.firstName[0]}{project.client.lastName[0]}
                            </div>
                            <h4 className="text-xl font-bold text-nexus-text">{project.client.firstName} {project.client.lastName}</h4>
                            <div className="mt-6 space-y-3">
                                <a href={`tel:${project.client.phone}`} className="flex items-center justify-center gap-2 w-full py-3 bg-nexus-black border border-nexus-gray rounded-xl text-nexus-text hover:border-nexus-orange transition-colors">
                                    <Phone size={16} className="text-nexus-orange"/> 
                                    {project.client.phone || "N/A"}
                                </a>
                                <a href={`mailto:${project.client.email}`} className="flex items-center justify-center gap-2 w-full py-3 bg-nexus-black border border-nexus-gray rounded-xl text-nexus-text hover:border-nexus-orange transition-colors">
                                    <Mail size={16} className="text-nexus-orange"/> 
                                    Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="text-nexus-concrete text-sm italic text-center">Info client non disponible.</p>
                    )}
                </div>

                {/* 4. APERÇU ÉQUIPE */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-nexus-text flex items-center gap-2">
                            <Users className="text-green-500"/> Équipe
                        </h3>
                        <Link href="/dashboard/manager/teams" className="text-xs text-nexus-orange hover:underline">Gérer</Link>
                    </div>
                    
                    {project.workers && project.workers.length > 0 ? (
                        <div className="space-y-3">
                            {project.workers.slice(0, 3).map((w: any) => (
                                <div key={w.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-nexus-black transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-nexus-gray flex items-center justify-center text-xs font-bold text-nexus-black">
                                        {w.firstName[0]}{w.lastName[0]}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-nexus-text truncate">{w.firstName} {w.lastName}</p>
                                        <p className="text-[10px] text-nexus-concrete uppercase truncate">{w.jobTitle}</p>
                                    </div>
                                </div>
                            ))}
                            {project.workers.length > 3 && (
                                <p className="text-xs text-nexus-concrete text-center pt-2">
                                    + {project.workers.length - 3} autres ouvriers
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6 border border-dashed border-nexus-gray rounded-xl">
                            <p className="text-xs text-nexus-concrete">Aucun ouvrier assigné</p>
                            <Link href="/dashboard/manager/teams" className="text-nexus-orange text-xs font-bold mt-2 inline-block">
                                + Ajouter
                            </Link>
                        </div>
                    )}
                </div>

                {/* 5. GESTION DES TÂCHES */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-nexus-text flex items-center gap-2">
                            <ClipboardList className="text-blue-500"/> Tâches & Planning
                        </h3>
                    </div>
                    <p className="text-nexus-concrete text-sm mb-6">
                        Organisez le travail de l'équipe et suivez l'avancement étape par étape.
                    </p>
                    <Link 
                        href={`/dashboard/manager/projects/${id}/tasks`} 
                        className="w-full py-3 bg-nexus-black border border-nexus-gray text-nexus-text font-bold rounded-xl hover:border-nexus-orange transition-all flex items-center justify-center gap-2"
                    >
                        Voir le Planning <ArrowRight size={18}/>
                    </Link>
                </div>

                {/* 6. LOGISTIQUE & MATÉRIAUX (LE NOUVEAU BLOC) */}
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-nexus-text flex items-center gap-2">
                            <Package className="text-nexus-orange"/> Logistique
                        </h3>
                    </div>
                    <p className="text-nexus-concrete text-sm mb-6">
                        Gestion des stocks, commandes fournisseurs et réapprovisionnement.
                    </p>
                    <Link 
                        href={`/dashboard/manager/projects/${id}/logistics`} 
                        className="w-full py-3 bg-nexus-black border border-nexus-gray text-nexus-text font-bold rounded-xl hover:border-nexus-orange transition-all flex items-center justify-center gap-2"
                    >
                        Gérer le Stock <ArrowRight size={18}/>
                    </Link>
                </div>

                <Link 
                href={`/dashboard/manager/projects/${id}/inventory`} 
                className="
                    group w-full py-3
                    bg-nexus-black
                    border border-nexus-gray
                    text-nexus-text font-bold
                    rounded-xl
                    hover:border-nexus-orange
                    hover:bg-nexus-orange/10
                    transition-all duration-300
                    flex items-center justify-center gap-2
                "
                >
                <Package
                    size={18}
                    className="text-nexus-orange transition-transform duration-300 group-hover:scale-110"
                />
                Gérer l’Inventaire
                <ArrowRight size={18} className="opacity-70"/>
                </Link>


            </div>

        </div>
    </div>
  );
}

const InfoItem = ({ label, value }: any) => (
    <div>
        <p className="text-xs font-bold text-nexus-concrete uppercase mb-1">{label}</p>
        <p className="text-nexus-text font-medium">{value || "N/A"}</p>
    </div>
);