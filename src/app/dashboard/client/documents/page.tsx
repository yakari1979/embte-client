'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { clientService, SERVER_URL } from '@/services/api';
import { gsap } from 'gsap';
import { 
  FileText, CheckCircle2, Clock, Image as ImageIcon, 
  Download, Film, LayoutList, ClipboardList, Ruler, MapPin, Loader2 
} from 'lucide-react';

export default function ClientDocumentsPage() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'FILES' | 'TASKS' | 'SPECS'>('FILES');
  const container = useRef(null);

  useEffect(() => {
    clientService.getMyProject()
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Animation au changement d'onglet
  useLayoutEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".content-anim", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [activeTab, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;
  if (!project) return <div className="p-20 text-center text-nexus-text">Aucun projet actif.</div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div className="w-full lg:w-auto">
            <h1 className="text-3xl font-bold text-nexus-text mb-2">Documents & Suivi</h1>
            <p className="text-nexus-concrete">
                Retrouvez ici tous les fichiers, le planning et les détails techniques de votre chantier.
            </p>
        </div>

        {/* NAVIGATION ONGLETS (RESPONSIVE) */}
        {/* Sur mobile: Colonne (vertical), Sur grand écran: Ligne (horizontal) */}
        <div className="flex flex-col sm:flex-row bg-nexus-dark p-1 rounded-xl border border-nexus-gray w-full lg:w-auto gap-1 sm:gap-0">
            <TabButton 
                label="Fichiers & Médias" 
                icon={FileText} 
                isActive={activeTab === 'FILES'} 
                onClick={() => setActiveTab('FILES')} 
            />
            <TabButton 
                label="Suivi Tâches" 
                icon={ClipboardList} 
                isActive={activeTab === 'TASKS'} 
                onClick={() => setActiveTab('TASKS')} 
            />
            <TabButton 
                label="Cahier des Charges" 
                icon={LayoutList} 
                isActive={activeTab === 'SPECS'} 
                onClick={() => setActiveTab('SPECS')} 
            />
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      <div className="min-h-[500px]">
        
        {/* --- ONGLET 1 : FICHIERS (Extraits des rapports) --- */}
        {activeTab === 'FILES' && (
            <FilesGallery reports={project.reports} />
        )}

        {/* --- ONGLET 2 : TÂCHES (Kanban simplifié) --- */}
        {activeTab === 'TASKS' && (
            <TasksList tasks={project.tasks} />
        )}

        {/* --- ONGLET 3 : SPECS (Détails création) --- */}
        {activeTab === 'SPECS' && (
            <ProjectSpecs project={project} />
        )}

      </div>
    </div>
  );
}

// ============================================================================
// SOUS-COMPOSANTS
// ============================================================================

// 1. GALERIE DE FICHIERS
function FilesGallery({ reports }: any) {
    const allFiles = reports.flatMap((r: any) => {
        const media = JSON.parse(r.media || "[]");
        return media.map((file: any) => ({
            ...file,
            date: r.createdAt,
            context: r.content
        }));
    });

    if (allFiles.length === 0) return (
        <div className="content-anim text-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl border-dashed">
            <ImageIcon size={48} className="text-nexus-concrete opacity-50 mx-auto mb-4"/>
            <p className="text-nexus-concrete">Aucun document ou photo partagé pour le moment.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allFiles.map((file: any, index: number) => (
                <a 
                    key={index} 
                    href={`${SERVER_URL}${file.url}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="content-anim group bg-nexus-dark border border-nexus-gray rounded-2xl overflow-hidden hover:border-nexus-orange transition-all"
                >
                    <div className="aspect-video bg-nexus-black relative flex items-center justify-center overflow-hidden">
                        {file.type === 'IMAGE' ? (
                            <img src={`${SERVER_URL}${file.url}`} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        ) : file.type === 'VIDEO' ? (
                            <Film size={40} className="text-nexus-concrete"/>
                        ) : (
                            <FileText size={40} className="text-nexus-concrete"/>
                        )}
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Download className="text-white" size={24}/>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase bg-nexus-black px-2 py-1 rounded text-nexus-text border border-nexus-gray">
                                {file.type}
                            </span>
                            <span className="text-[10px] text-nexus-concrete">
                                {new Date(file.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-nexus-text truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-nexus-concrete truncate mt-1">{file.context}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

// 2. LISTE DES TÂCHES
function TasksList({ tasks }: any) {
    if (!tasks || tasks.length === 0) return (
        <div className="content-anim text-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl border-dashed">
            <ClipboardList size={48} className="text-nexus-concrete opacity-50 mx-auto mb-4"/>
            <p className="text-nexus-concrete">Planning non défini pour le moment.</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {tasks.map((task: any) => (
                <div key={task.id} className="content-anim flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-nexus-dark border border-nexus-gray rounded-2xl hover:bg-nexus-black transition-colors gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                            task.status === 'DONE' ? 'border-green-500 bg-green-500/20 text-green-500' :
                            task.status === 'IN_PROGRESS' ? 'border-blue-500 bg-blue-500/20 text-blue-500' :
                            'border-nexus-concrete text-nexus-concrete'
                        }`}>
                            {task.status === 'DONE' ? <CheckCircle2 size={14}/> : task.status === 'IN_PROGRESS' ? <Clock size={14}/> : <div className="w-2 h-2 bg-nexus-concrete rounded-full"/>}
                        </div>

                        <div>
                            <h3 className={`text-lg font-bold ${task.status === 'DONE' ? 'text-nexus-concrete line-through' : 'text-nexus-text'}`}>
                                {task.title}
                            </h3>
                            <p className="text-sm text-nexus-concrete">{task.description}</p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto pl-10 sm:pl-0">
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase inline-block ${
                            task.status === 'DONE' ? 'text-green-500 bg-green-500/10' :
                            task.status === 'IN_PROGRESS' ? 'text-blue-500 bg-blue-500/10' :
                            'text-nexus-concrete bg-nexus-black'
                        }`}>
                            {task.status === 'DONE' ? 'Terminé' : task.status === 'IN_PROGRESS' ? 'En Cours' : 'À Faire'}
                        </span>
                        {task.dueDate && (
                            <p className="text-xs text-nexus-concrete mt-2">
                                Prévu : {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// 3. CAHIER DES CHARGES
function ProjectSpecs({ project }: any) {
    return (
        <div className="content-anim grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                        <MapPin className="text-blue-500"/> Foncier & Localisation
                    </h3>
                    <div className="space-y-4">
                        <SpecRow label="Localisation" value={project.location} />
                        <SpecRow label="Surface Terrain" value={`${project.surface} m²`} />
                        <SpecRow label="Statut Juridique" value={project.legalStatus} />
                        <SpecRow label="État initial" value={project.landStatus} />
                        <SpecRow label="Propriétaire" value={project.isOwner ? "Oui" : "Non"} />
                    </div>
                </div>

                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                        <Ruler className="text-purple-500"/> Technique
                    </h3>
                    <div className="space-y-4">
                        <SpecRow label="Type Bâtiment" value={project.buildingType} />
                        <SpecRow label="Niveaux" value={`R+${project.floors}`} />
                        <SpecRow label="Standing" value={project.standing} />
                        <SpecRow label="Étude de sol" value={project.soilStudy ? "Réalisée" : "Non réalisée"} />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                        <LayoutList className="text-nexus-orange"/> Informations Générales
                    </h3>
                    <div className="space-y-4">
                        <SpecRow label="Type Projet" value={project.projectType} />
                        <SpecRow label="Objectif" value={project.objective} />
                        <SpecRow label="Urgence" value={project.urgency} />
                        <SpecRow label="Budget Initial" value={`${project.budget.toLocaleString()} FCFA`} />
                    </div>
                </div>

                <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-nexus-text mb-4">Description Initiale</h3>
                    <div className="bg-nexus-black p-6 rounded-xl border border-nexus-gray/50">
                        <p className="text-nexus-concrete leading-relaxed whitespace-pre-wrap italic">
                            "{project.description}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- BOUTON D'ONGLET RESPONSIVE ---
const TabButton = ({ label, icon: Icon, isActive, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all whitespace-nowrap ${
            isActive 
            ? 'bg-nexus-orange text-black shadow-lg' 
            : 'text-nexus-concrete hover:text-nexus-text hover:bg-white/5'
        }`}
    >
        <Icon size={18} /> {label}
    </button>
);

const SpecRow = ({ label, value }: any) => (
    <div className="flex justify-between py-2 border-b border-nexus-gray/30 last:border-0">
        <span className="text-nexus-concrete text-sm">{label}</span>
        <span className="text-nexus-text font-medium text-right">{value || "N/A"}</span>
    </div>
);