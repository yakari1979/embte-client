// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { adminService } from '@/services/api';
// import { 
//   ArrowLeft, CheckCircle, XCircle, MapPin, Building, Ruler, 
//   DollarSign, Calendar, User, Phone, Loader2, FileText 
// } from 'lucide-react';
// import Link from 'next/link';

// export default function ProjectDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [project, setProject] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     adminService.getProjectDetails(id as string)
//       .then(setProject)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [id]);

//   const handleAction = async (status: 'PLANNED' | 'CANCELLED') => {
//     if(!confirm("Êtes-vous sûr de vouloir changer le statut de ce projet ?")) return;
//     setProcessing(true);
//     try {
//       await adminService.validateProject(id as string, status);
//       router.push('/dashboard/admin'); // Retour au dashboard après action
//     } catch (e) {
//       alert("Erreur");
//       setProcessing(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-10 h-10"/></div>;
//   if (!project) return <div className="text-nexus-text p-20 text-center">Projet introuvable</div>;

//   return (
//     <div className="max-w-5xl mx-auto pb-20 pt-28 px-4">
      
//       {/* HEADER NAVIGATION */}
//       <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-6 transition-colors">
//         <ArrowLeft size={18}/> Retour au Quartier Général
//       </Link>

//       {/* TITRE & STATUT */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
//         <div>
//             <div className="flex items-center gap-3 mb-2">
//                 <span className="px-3 py-1 rounded-md bg-nexus-orange text-black text-xs font-bold uppercase tracking-wider">
//                     {project.projectType}
//                 </span>
//                 <span className="text-nexus-concrete text-sm">Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
//             </div>
//             <h1 className="text-3xl md:text-4xl font-bold text-nexus-text">{project.name}</h1>
//         </div>
        
//         {/* BOUTONS D'ACTION */}
//         <div className="flex gap-3">
//             <button 
//                 disabled={processing || project.status !== 'PENDING'}
//                 onClick={() => handleAction('CANCELLED')}
//                 className="px-6 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all disabled:opacity-50"
//             >
//                 Rejeter
//             </button>
//             <button 
//                 disabled={processing || project.status !== 'PENDING'}
//                 onClick={() => handleAction('PLANNED')}
//                 className="px-6 py-3 rounded-xl bg-nexus-orange text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-nexus-orange/20"
//             >
//                 {processing ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20}/>}
//                 Valider le Projet
//             </button>
//         </div>
//       </div>

//       {/* GRILLE D'INFORMATION */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* 1. INFORMATIONS GÉNÉRALES */}
//         <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
//                 <Building className="text-nexus-orange"/> Détails Généraux
//             </h3>
//             <div className="space-y-4">
//                 <InfoRow label="Objectif" value={project.objective} />
//                 <InfoRow label="Urgence" value={project.urgency} />
//                 <InfoRow label="Type de Bâtiment" value={project.buildingType} />
//                 <InfoRow label="Nombre d'étages" value={`R+${project.floors}`} />
//                 <InfoRow label="Standing" value={project.standing} />
//             </div>
//         </div>

//         {/* 2. TERRAIN & LOCALISATION */}
//         <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
//                 <MapPin className="text-blue-500"/> Foncier
//             </h3>
//             <div className="space-y-4">
//                 <InfoRow label="Localisation" value={project.location} />
//                 <InfoRow label="Superficie" value={`${project.surface} m²`} />
//                 <InfoRow label="Statut Juridique" value={project.legalStatus} highlight />
//                 <InfoRow label="État du terrain" value={project.landStatus} />
//                 <InfoRow label="Propriétaire ?" value={project.isOwner ? "OUI" : "NON"} />
//             </div>
//         </div>

//         {/* 3. TECHNIQUE & URBANISME */}
//         <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
//                 <Ruler className="text-purple-500"/> Technique
//             </h3>
//             <div className="space-y-4">
//                 <InfoRow label="Type de Zone" value={project.zoneType} />
//                 <InfoRow label="Accès" value={project.accessType} />
//                 <InfoRow label="Étude de sol" value={project.soilStudy ? "Réalisée" : "Non réalisée"} />
//                 {/* Affichage des réseaux (JSON parse) */}
//                 <div className="flex justify-between py-2 border-b border-nexus-gray/30 last:border-0">
//                     <span className="text-nexus-concrete text-sm">Réseaux</span>
//                     <span className="text-nexus-text font-medium text-right">
//                         {tryParse(project.utilities).join(', ') || "Aucun"}
//                     </span>
//                 </div>
//             </div>
//         </div>

//         {/* 4. BUDGET & CLIENT */}
//         <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
//                 <DollarSign className="text-green-500"/> Budget & Contact
//             </h3>
//             <div className="space-y-4">
//                 <InfoRow label="Budget Estimatif" value={`${project.budget.toLocaleString()} FCFA`} highlight />
//                 <InfoRow label="Démarrage souhaité" value={new Date(project.startDate).toLocaleDateString()} />
//                 <div className="mt-6 pt-4 border-t border-nexus-gray">
//                     <p className="text-xs font-bold text-nexus-concrete uppercase mb-2">Contact Client</p>
//                     <div className="flex items-center gap-3 text-nexus-text">
//                         <Phone size={18} className="text-nexus-orange"/>
//                         <span className="font-bold">{project.clientPhone}</span>
//                         <span className="text-xs bg-nexus-gray px-2 py-1 rounded text-nexus-text">Pref: {project.contactPref}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {/* 5. DESCRIPTION COMPLÈTE */}
//         <div className="col-span-1 md:col-span-2 bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-nexus-text mb-4 flex items-center gap-2">
//                 <FileText className="text-nexus-concrete"/> Description Libre
//             </h3>
//             <p className="text-nexus-text leading-relaxed whitespace-pre-wrap">
//                 {project.description}
//             </p>
//         </div>

//       </div>
//     </div>
//   );
// }

// // Helpers
// const InfoRow = ({ label, value, highlight }: any) => (
//     <div className="flex justify-between py-2 border-b border-nexus-gray/30 last:border-0">
//         <span className="text-nexus-concrete text-sm">{label}</span>
//         <span className={`font-medium text-right ${highlight ? 'text-nexus-orange font-bold' : 'text-nexus-text'}`}>
//             {value || "N/A"}
//         </span>
//     </div>
// );

// const tryParse = (str: string) => {
//     try { return JSON.parse(str); } catch { return []; }
// };



'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/api';
import { 
  ArrowLeft, CheckCircle, MapPin, Building, Ruler, 
  DollarSign, Phone, Loader2, FileText, User, Mail
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const container = useRef(null);
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    if (!id) return;
    adminService.getProjectDetails(id as string)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 2. Animations GSAP (Se lance quand 'project' est chargé)
  useLayoutEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      // Header
      gsap.from(".anim-header", { y: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
      // Carte Client
      gsap.from(".anim-client", { x: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
      // Grille détails
      gsap.from(".anim-card", { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [project]);

  const handleAction = async (status: 'PLANNED' | 'CANCELLED') => {
    const actionName = status === 'PLANNED' ? 'Valider' : 'Rejeter';
    if(!confirm(`Êtes-vous sûr de vouloir ${actionName} ce projet ?`)) return;
    
    setProcessing(true);
    try {
      await adminService.validateProject(id as string, status);
      router.push('/dashboard/admin');
    } catch (e) {
      alert("Erreur lors de l'action");
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-10 h-10"/></div>;
  if (!project) return <div className="text-nexus-text p-20 text-center">Projet introuvable</div>;

  return (
    <div ref={container} className="max-w-6xl mx-auto pb-20 pt-28 px-4">
      
      {/* BOUTON RETOUR */}
      <Link href="/dashboard/admin" className="anim-header inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-8 transition-colors group font-medium">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Retour au Quartier Général
      </Link>

      {/* EN-TÊTE PRINCIPAL + CARTE CLIENT */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        
        {/* Titre & Statut */}
        <div className="flex-1 anim-header">
            <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-md bg-nexus-orange text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-nexus-orange/20">
                    {project.projectType}
                </span>
                <span className="text-nexus-concrete text-sm flex items-center gap-1">
                    <CalendarIcon/> Créé le {new Date(project.createdAt).toLocaleDateString()}
                </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-nexus-text mb-2 tracking-tight">{project.name}</h1>
            <p className="text-nexus-concrete text-lg flex items-center gap-2">
                <MapPin size={18} className="text-nexus-orange"/> {project.location}
            </p>
        </div>

        {/* CARTE CLIENT (Nouvelle section) */}
        <div className="anim-client w-full lg:w-auto bg-nexus-dark/50 border border-nexus-gray p-5 rounded-2xl flex items-center gap-4 min-w-[300px] shadow-xl backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {project.client?.firstName?.[0]}{project.client?.lastName?.[0]}
            </div>
            <div>
                <p className="text-xs font-bold text-nexus-concrete uppercase tracking-wider mb-0.5">Demandé par</p>
                <h3 className="text-lg font-bold text-nexus-text">
                    {project.client ? `${project.client.firstName} ${project.client.lastName}` : "Client Inconnu"}
                </h3>
                <a href={`mailto:${project.client?.email}`} className="text-sm text-nexus-orange hover:underline flex items-center gap-1">
                    <Mail size={12}/> {project.client?.email || "Pas d'email"}
                </a>
            </div>
        </div>
      </div>

      {/* BARRE D'ACTIONS */}
      <div className="anim-header flex flex-wrap gap-4 border-b border-nexus-gray pb-8 mb-8">
        <button 
            disabled={processing || project.status !== 'PENDING'}
            onClick={() => handleAction('PLANNED')}
            className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-nexus-orange text-black font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale shadow-lg shadow-nexus-orange/10"
        >
            {processing ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle size={20}/>}
            Valider le Projet
        </button>
        <button 
            disabled={processing || project.status !== 'PENDING'}
            onClick={() => handleAction('CANCELLED')}
            className="flex-1 sm:flex-none px-8 py-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all disabled:opacity-50"
        >
            Rejeter
        </button>
      </div>

      {/* GRILLE D'INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. INFORMATIONS GÉNÉRALES */}
        <div className="anim-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg hover:border-nexus-orange/30 transition-colors">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                <Building className="text-nexus-orange"/> Détails Généraux
            </h3>
            <div className="space-y-4">
                <InfoRow label="Objectif" value={project.objective} />
                <InfoRow label="Urgence" value={project.urgency} />
                <InfoRow label="Type de Bâtiment" value={project.buildingType} />
                <InfoRow label="Nombre d'étages" value={`R+${project.floors}`} />
                <InfoRow label="Standing" value={project.standing} />
            </div>
        </div>

        {/* 2. TERRAIN & LOCALISATION */}
        <div className="anim-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg hover:border-blue-500/30 transition-colors">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                <MapPin className="text-blue-500"/> Foncier
            </h3>
            <div className="space-y-4">
                <InfoRow label="Localisation" value={project.location} />
                <InfoRow label="Superficie" value={`${project.surface} m²`} />
                <InfoRow label="Statut Juridique" value={project.legalStatus} highlight />
                <InfoRow label="État du terrain" value={project.landStatus} />
                <InfoRow label="Propriétaire ?" value={project.isOwner ? "OUI" : "NON"} />
            </div>
        </div>

        {/* 3. TECHNIQUE & URBANISME */}
        <div className="anim-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg hover:border-purple-500/30 transition-colors">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                <Ruler className="text-purple-500"/> Technique
            </h3>
            <div className="space-y-4">
                <InfoRow label="Type de Zone" value={project.zoneType} />
                <InfoRow label="Accès" value={project.accessType} />
                <InfoRow label="Étude de sol" value={project.soilStudy ? "Réalisée" : "Non réalisée"} />
                <div className="flex justify-between py-2 border-b border-nexus-gray/30 last:border-0">
                    <span className="text-nexus-concrete text-sm">Réseaux</span>
                    <span className="text-nexus-text font-medium text-right">
                        {tryParse(project.utilities).join(', ') || "Aucun"}
                    </span>
                </div>
            </div>
        </div>

        {/* 4. BUDGET & CONTACT RAPIDE */}
        <div className="anim-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg hover:border-green-500/30 transition-colors">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2 border-b border-nexus-gray pb-4">
                <DollarSign className="text-green-500"/> Budget & Contact
            </h3>
            <div className="space-y-4">
                <InfoRow label="Budget Estimatif" value={`${project.budget.toLocaleString()} FCFA`} highlight />
                <InfoRow label="Démarrage souhaité" value={new Date(project.startDate).toLocaleDateString()} />
                <div className="mt-6 pt-4 border-t border-nexus-gray bg-nexus-black/20 p-4 rounded-xl">
                    <p className="text-xs font-bold text-nexus-concrete uppercase mb-2">Numéro saisi dans le formulaire</p>
                    <div className="flex items-center gap-3 text-nexus-text">
                        <Phone size={18} className="text-nexus-orange"/>
                        <span className="font-bold text-lg">{project.clientPhone}</span>
                        <span className="text-xs bg-nexus-gray px-2 py-1 rounded text-nexus-text">Via {project.contactPref}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 5. DESCRIPTION COMPLÈTE */}
        <div className="anim-card col-span-1 md:col-span-2 bg-nexus-dark border border-nexus-gray rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-nexus-text mb-4 flex items-center gap-2">
                <FileText className="text-nexus-concrete"/> Description Libre
            </h3>
            <div className="bg-nexus-black/30 p-6 rounded-xl border border-nexus-gray/30">
                <p className="text-nexus-text leading-relaxed whitespace-pre-wrap italic">
                    "{project.description}"
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

const InfoRow = ({ label, value, highlight }: any) => (
    <div className="flex justify-between items-center py-3 border-b border-nexus-gray/30 last:border-0 group">
        <span className="text-nexus-concrete text-sm group-hover:text-nexus-text transition-colors">{label}</span>
        <span className={`font-medium text-right ${highlight ? 'text-nexus-orange font-bold text-lg' : 'text-nexus-text'}`}>
            {value || "N/A"}
        </span>
    </div>
);

// Petite icône calendrier SVG inline
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const tryParse = (str: string) => {
    try { return JSON.parse(str); } catch { return []; }
};