'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { managerService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  Users, MapPin, HardHat, Phone, Mail, Calendar, 
  Search, User, X, Briefcase, PlusCircle, Loader2, Copy, CheckCircle, Hammer 
} from 'lucide-react';

export default function TeamsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  
  // États pour les Modals
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // <-- Pour ouvrir la création
  
  const container = useRef(null);

  // Fonction de chargement
  const loadTeams = () => {
    setLoading(true);
    managerService.getTeams()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTeams(); }, []);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".team-card", { y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Mes Équipes</h1>
            <p className="text-nexus-concrete">Gestion du personnel sur vos chantiers actifs.</p>
        </div>
        
        {/* BOUTON D'AJOUT CONNECTÉ */}
        <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-nexus-orange text-black px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-nexus-orange/20"
        >
            <PlusCircle size={20}/> Ajouter un ouvrier
        </button>
      </div>

      {/* CONTENU PRINCIPAL */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl text-center team-card">
            <Users size={48} className="text-nexus-concrete opacity-50 mb-4"/>
            <h2 className="text-2xl font-bold text-nexus-text mb-2">Aucune équipe active</h2>
            <p className="text-nexus-concrete">En attente d'affectation de chantier.</p>
        </div>
      ) : (
        <div className="grid gap-8">
            {projects.map((project) => (
                <div key={project.id} className="team-card bg-nexus-dark border border-nexus-gray rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-nexus-gray bg-nexus-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-nexus-text mb-1">{project.name}</h2>
                            <p className="text-sm text-nexus-concrete flex items-center gap-1"><MapPin size={14}/> {project.location}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-nexus-text bg-nexus-black px-3 py-1.5 rounded-lg border border-nexus-gray">
                            <Users size={16} className="text-nexus-orange"/> 
                            <span className="font-bold">{project.workers.length}</span> Membres
                        </div>
                    </div>

                    <div className="p-6">
                        {project.workers.length === 0 ? (
                            <p className="text-nexus-concrete italic text-sm">Aucun ouvrier assigné.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.workers.map((worker: any) => (
                                    <div 
                                        key={worker.id} 
                                        onClick={() => setSelectedWorker(worker)}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-nexus-black border border-nexus-gray hover:border-nexus-orange/50 hover:bg-nexus-black/80 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-gray to-nexus-dark flex items-center justify-center text-nexus-text font-bold text-lg border border-nexus-gray group-hover:border-nexus-orange transition-colors">
                                            {worker.firstName[0]}{worker.lastName[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-nexus-text group-hover:text-nexus-orange transition-colors">
                                                {worker.firstName} {worker.lastName}
                                            </h3>
                                            <p className="text-xs text-nexus-concrete">{worker.jobTitle || "Ouvrier"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* --- MODAL CRÉATION OUVRIER --- */}
      {/* {showCreateModal && (
        <CreateWorkerModal onClose={() => setShowCreateModal(false)} onSuccess={loadTeams} />
      )} */}

      {/* On passe la liste des projets à la modal */}
        {showCreateModal && (
        <CreateWorkerModal 
            projects={projects} // <--- AJOUT ICI
            onClose={() => setShowCreateModal(false)} 
            onSuccess={loadTeams} 
        />
        )}

      {/* --- MODAL DÉTAILS --- */}
      {selectedWorker && (
        <WorkerDetailsModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
      )}

    </div>
  );
}


// ============================================================================
// MODAL : CRÉER UN OUVRIER + ASSIGNATION
// ============================================================================
function CreateWorkerModal({ onClose, onSuccess, projects }: any) {
    // On ajoute projectId dans le state, sélectionné par défaut sur le 1er projet
    const [formData, setFormData] = useState({ 
        firstName: '', lastName: '', email: '', phone: '', jobTitle: '', 
        projectId: projects[0]?.id || '' 
    });
    
    const [generatedCreds, setGeneratedCreds] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Styles communs
    const inputClasses = "w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/60";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await managerService.createWorker(formData);
            setGeneratedCreds(res);
        } catch (error: any) {
            console.error(error);
            // On affiche le message précis envoyé par le serveur (ex: "Email déjà utilisé")
            const message = error.response?.data?.message || "Erreur inconnue lors de la création.";
            alert("Erreur : " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-5 right-5 text-nexus-concrete hover:text-nexus-text p-2 rounded-full hover:bg-white/5 transition-colors">
                    <X size={24}/>
                </button>
                
                {!generatedCreds ? (
                    <>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-nexus-text mb-2">Recruter un Ouvrier</h2>
                            <p className="text-nexus-concrete text-sm">Créez un compte et assignez-le à un chantier.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* NOUVEAU : SÉLECTION DU PROJET */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Affecter au chantier</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3.5 text-nexus-orange" size={18} />
                                    <select 
                                        className={inputClasses}
                                        onChange={e => setFormData({...formData, projectId: e.target.value})}
                                        value={formData.projectId}
                                    >
                                        {projects.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input required placeholder="Moussa" className={inputClasses} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Nom</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input required placeholder="Diop" className={inputClasses} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input required placeholder="77 ..." className={inputClasses} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Métier</label>
                                    <div className="relative">
                                        <Hammer className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input placeholder="Maçon" className={inputClasses} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Email (Connexion)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                    <input required type="email" placeholder="moussa@chantier.sn" className={inputClasses} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            
                            <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl mt-4 hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading ? "Création en cours..." : "Créer et Assigner"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Ouvrier Assigné !</h2>
                        <p className="text-nexus-concrete mb-8 text-sm max-w-xs mx-auto">
                            L'ouvrier a été créé et ajouté au chantier. Transmettez-lui ses accès.
                        </p>
                        
                        <div className="bg-nexus-black p-6 rounded-2xl border border-nexus-gray text-left space-y-6 mb-8 relative">
                            <div>
                                <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Identifiant</p>
                                <p className="text-nexus-text font-mono text-lg">{generatedCreds.user.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Mot de passe</p>
                                <div className="flex justify-between items-center bg-nexus-dark p-3 rounded-lg border border-nexus-gray/50">
                                    <p className="text-nexus-orange font-mono text-xl tracking-widest font-bold">{generatedCreds.generatedPassword}</p>
                                    <button onClick={() => navigator.clipboard.writeText(generatedCreds.generatedPassword)} className="text-nexus-concrete hover:text-nexus-text p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <Copy size={20}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => { onSuccess(); onClose(); }} className="w-full border border-nexus-gray text-nexus-text font-bold py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                            Terminer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MODAL DÉTAILS (Déjà existante)
// ============================================================================
function WorkerDetailsModal({ worker, onClose }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-md rounded-3xl p-0 relative shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-nexus-orange to-yellow-600 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm"><X size={20}/></button>
                </div>
                <div className="px-8 pb-8 -mt-12 relative">
                    <div className="w-24 h-24 rounded-full bg-nexus-black border-4 border-nexus-dark flex items-center justify-center text-3xl font-bold text-nexus-text shadow-xl mb-4">
                        {worker.firstName[0]}{worker.lastName[0]}
                    </div>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-nexus-text">{worker.firstName} {worker.lastName}</h2>
                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-nexus-orange/10 text-nexus-orange text-xs font-bold border border-nexus-orange/20 uppercase tracking-wide">
                            {worker.jobTitle || "Ouvrier"}
                        </span>
                    </div>
                    <div className="space-y-4">
                        <InfoCard icon={Mail} label="Email" value={worker.email} />
                        <InfoCard icon={Phone} label="Téléphone" value={worker.phone || "Non renseigné"} />
                        <InfoCard icon={Calendar} label="Recruté le" value={new Date(worker.createdAt).toLocaleDateString()} />
                    </div>
                    <div className="mt-8 flex gap-3">
                        <a href={`tel:${worker.phone}`} className="flex-1 bg-nexus-text text-nexus-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-nexus-orange transition-colors"><Phone size={18}/> Appeler</a>
                        <button onClick={onClose} className="flex-1 border border-nexus-gray text-nexus-text font-bold py-3 rounded-xl hover:bg-white/5 transition-colors">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const InfoCard = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-nexus-black border border-nexus-gray">
        <div className="w-10 h-10 rounded-lg bg-nexus-dark flex items-center justify-center text-nexus-concrete"><Icon size={20}/></div>
        <div>
            <p className="text-xs text-nexus-concrete uppercase font-bold">{label}</p>
            <p className="text-nexus-text text-sm">{value}</p>
        </div>
    </div>
);