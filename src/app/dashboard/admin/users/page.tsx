// 'use client';

// import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import { adminService } from '@/services/api';
// import { gsap } from 'gsap';
// import { Users, Briefcase, Search, Phone, Mail, MoreVertical, HardHat, User } from 'lucide-react';

// export default function UsersPage() {
//   const [activeTab, setActiveTab] = useState<'CLIENT' | 'MANAGER'>('CLIENT');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const container = useRef(null);

//   // Charger les utilisateurs quand l'onglet change
//   useEffect(() => {
//     setLoading(true);
//     adminService.getUsersByRole(activeTab)
//       .then(setUsers)
//       .finally(() => setLoading(false));
//   }, [activeTab]);

//   // Animation à chaque changement de liste
//   useLayoutEffect(() => {
//     if (loading) return;
//     const ctx = gsap.context(() => {
//       gsap.from(".user-card", { y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
//     }, container);
//     return () => ctx.revert();
//   }, [users, loading]);

//   return (
//     <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
//         <div>
//             <h1 className="text-3xl font-bold text-nexus-text mb-1">Gestion des Utilisateurs</h1>
//             <p className="text-nexus-concrete">Gérez vos clients et vos équipes techniques.</p>
//         </div>
        
//         {/* Onglets Intelligents */}
//         <div className="flex bg-nexus-dark p-1 rounded-xl border border-nexus-gray">
//             <TabButton label="Clients" icon={User} isActive={activeTab === 'CLIENT'} onClick={() => setActiveTab('CLIENT')} />
//             <TabButton label="Managers" icon={HardHat} isActive={activeTab === 'MANAGER'} onClick={() => setActiveTab('MANAGER')} />
//         </div>
//       </div>

//       {/* BARRE DE RECHERCHE (Visuelle pour l'instant) */}
//       <div className="relative mb-8">
//         <Search className="absolute left-4 top-3.5 text-nexus-concrete" size={20} />
//         <input 
//             type="text" placeholder={`Rechercher un ${activeTab.toLowerCase()}...`}
//             className="w-full bg-nexus-dark border border-nexus-gray rounded-xl pl-12 pr-4 py-3 text-nexus-text focus:border-nexus-orange outline-none transition-colors"
//         />
//       </div>

//       {/* LISTE GRILLE */}
//       {loading ? (
//         <div className="text-center py-20 text-nexus-concrete">Chargement...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {users.map((user: any) => (
//                 <div key={user.id} className="user-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange/50 transition-all group relative">
//                     <div className="flex items-start justify-between mb-4">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-gray to-nexus-black border border-nexus-gray flex items-center justify-center text-nexus-text font-bold text-lg">
//                             {user.firstName[0]}{user.lastName[0]}
//                         </div>
//                         <span className={`px-2 py-1 rounded text-xs font-bold ${user.isSuspended ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
//                             {user.isSuspended ? 'Suspendu' : 'Actif'}
//                         </span>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-nexus-text">{user.firstName} {user.lastName}</h3>
//                     <p className="text-nexus-concrete text-sm mb-4">{user.jobTitle || "Utilisateur"}</p>
                    
//                     <div className="space-y-2 text-sm text-nexus-concrete border-t border-nexus-gray pt-4">
//                         <div className="flex items-center gap-2"><Mail size={14}/> {user.email}</div>
//                         <div className="flex items-center gap-2"><Phone size={14}/> {user.phone || "N/A"}</div>
//                         {activeTab === 'MANAGER' && (
//                             <div className="flex items-center gap-2 text-nexus-orange font-bold mt-2">
//                                 <Briefcase size={14}/> {user._count.managedProjects} Chantiers gérés
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const TabButton = ({ label, icon: Icon, isActive, onClick }: any) => (
//     <button 
//         onClick={onClick}
//         className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isActive ? 'bg-nexus-orange text-black shadow-lg' : 'text-nexus-concrete hover:text-nexus-text'}`}
//     >
//         <Icon size={18} /> {label}
//     </button>
// );



'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  Users, Briefcase, Search, Phone, Mail, HardHat, User, 
  Plus, X, Copy, CheckCircle, MapPin, Calendar, Building 
} from 'lucide-react';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'MANAGER'>('CLIENT');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // États pour les Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Pour la popup détails
  
  const container = useRef(null);

  // 1. Chargement des utilisateurs
  const loadUsers = () => {
    setLoading(true);
    adminService.getUsersByRole(activeTab)
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [activeTab]);

  // 2. Filtrage Recherche (Temps réel)
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter((u: any) => 
      u.firstName.toLowerCase().includes(lowerQuery) || 
      u.lastName.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Animation Entrée
  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".user-card", { y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [loading, activeTab]);

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Gestion des Utilisateurs</h1>
            <p className="text-nexus-concrete">Gérez vos clients et vos équipes techniques.</p>
        </div>
        
        <div className="flex gap-4">
            {/* Bouton Ajouter Manager (Visible seulement si onglet Manager) */}
            {activeTab === 'MANAGER' && (
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-nexus-orange text-black px-5 py-2 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-nexus-orange/20"
                >
                    <Plus size={20} /> Nouveau Manager
                </button>
            )}

            <div className="flex bg-nexus-dark p-1 rounded-xl border border-nexus-gray">
                <TabButton label="Clients" icon={User} isActive={activeTab === 'CLIENT'} onClick={() => setActiveTab('CLIENT')} />
                <TabButton label="Managers" icon={HardHat} isActive={activeTab === 'MANAGER'} onClick={() => setActiveTab('MANAGER')} />
            </div>
        </div>
      </div>

      {/* BARRE DE RECHERCHE FONCTIONNELLE */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-nexus-concrete" size={20} />
        <input 
            type="text" 
            placeholder={`Rechercher un ${activeTab.toLowerCase()} par nom ou email...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-dark border border-nexus-gray rounded-xl pl-12 pr-4 py-3 text-nexus-text focus:border-nexus-orange outline-none transition-colors"
        />
      </div>

      {/* LISTE GRILLE */}
      {loading ? (
        <div className="text-center py-20 text-nexus-concrete">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user: any) => (
                <div 
                    key={user.id} 
                    onClick={() => {
                        // Ouvrir la popup détails (on recharge les détails complets)
                        adminService.getUserDetails(user.id).then(setSelectedUser);
                    }}
                    className="user-card bg-nexus-dark border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange/50 hover:bg-nexus-dark/80 cursor-pointer transition-all group relative"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-gray to-nexus-black border border-nexus-gray flex items-center justify-center text-nexus-text font-bold text-lg">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.isSuspended ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {user.isSuspended ? 'Suspendu' : 'Actif'}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-nexus-text group-hover:text-nexus-orange transition-colors">{user.firstName} {user.lastName}</h3>
                    <p className="text-nexus-concrete text-sm mb-4">{user.jobTitle || (activeTab === 'CLIENT' ? "Client Particulier" : "Chef de Chantier")}</p>
                    
                    <div className="space-y-2 text-sm text-nexus-concrete border-t border-nexus-gray pt-4">
                        <div className="flex items-center gap-2"><Mail size={14}/> {user.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14}/> {user.phone || "Non renseigné"}</div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* --- MODAL CRÉATION MANAGER --- */}
      {showCreateModal && (
        <CreateManagerModal onClose={() => setShowCreateModal(false)} onSuccess={loadUsers} />
      )}

      {/* --- MODAL DÉTAILS UTILISATEUR --- */}
      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

    </div>
  );
}

// // ============================================================================
// // MODAL CRÉATION MANAGER
// // ============================================================================
// function CreateManagerModal({ onClose, onSuccess }: any) {
//     const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', jobTitle: '' });
//     const [generatedCreds, setGeneratedCreds] = useState<any>(null); // Pour stocker le mot de passe reçu
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await adminService.createManager(formData);
//             setGeneratedCreds(res); // Affiche l'écran de succès avec le mot de passe
//             onSuccess(); // Recharge la liste derrière
//         } catch (error) {
//             alert("Erreur lors de la création");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
//             <div className="bg-nexus-dark border border-nexus-gray w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
//                 <button onClick={onClose} className="absolute top-4 right-4 text-nexus-concrete hover:text-white"><X size={24}/></button>
                
//                 {!generatedCreds ? (
//                     <>
//                         <h2 className="text-2xl font-bold text-nexus-text mb-1">Nouveau Manager</h2>
//                         <p className="text-nexus-concrete mb-6 text-sm">Créez un compte pour un chef de chantier. Un mot de passe sera généré.</p>
                        
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <input required placeholder="Prénom" className="input-modal" onChange={e => setFormData({...formData, firstName: e.target.value})} />
//                                 <input required placeholder="Nom" className="input-modal" onChange={e => setFormData({...formData, lastName: e.target.value})} />
//                             </div>
//                             <input required type="email" placeholder="Email professionnel" className="input-modal" onChange={e => setFormData({...formData, email: e.target.value})} />
//                             <input required placeholder="Téléphone" className="input-modal" onChange={e => setFormData({...formData, phone: e.target.value})} />
//                             <input placeholder="Poste (ex: Ingénieur Béton)" className="input-modal" onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                            
//                             <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-3 rounded-xl mt-4 hover:scale-[1.02] transition-transform">
//                                 {loading ? "Création..." : "Créer et Générer Accès"}
//                             </button>
//                         </form>
//                     </>
//                 ) : (
//                     <div className="text-center">
//                         <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <CheckCircle size={32} />
//                         </div>
//                         <h2 className="text-2xl font-bold text-white mb-2">Compte Créé !</h2>
//                         <p className="text-nexus-concrete mb-6 text-sm">Transmettez ces informations au manager. Le mot de passe ne sera plus affiché.</p>
                        
//                         <div className="bg-nexus-black p-4 rounded-xl border border-nexus-gray text-left space-y-3 mb-6">
//                             <div>
//                                 <p className="text-xs text-nexus-concrete uppercase font-bold">Identifiant</p>
//                                 <p className="text-white font-mono">{generatedCreds.user.email}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-nexus-concrete uppercase font-bold">Mot de passe provisoire</p>
//                                 <div className="flex justify-between items-center">
//                                     <p className="text-nexus-orange font-mono text-lg tracking-widest">{generatedCreds.generatedPassword}</p>
//                                     <button onClick={() => navigator.clipboard.writeText(generatedCreds.generatedPassword)} className="text-nexus-concrete hover:text-white" title="Copier">
//                                         <Copy size={18}/>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         <button onClick={onClose} className="w-full border border-nexus-gray text-white font-bold py-3 rounded-xl hover:bg-white/10">Fermer</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// ============================================================================
// MODAL CRÉATION MANAGER (VERSION AMÉLIORÉE)
// ============================================================================
function CreateManagerModal({ onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', jobTitle: '' });
    const [generatedCreds, setGeneratedCreds] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await adminService.createManager(formData);
            setGeneratedCreds(res);
            onSuccess();
        } catch (error) {
            alert("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-5 right-5 text-nexus-concrete hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X size={24}/>
                </button>
                
                {!generatedCreds ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-nexus-text mb-2">Nouveau Manager</h2>
                            <p className="text-nexus-concrete text-sm">Créez un accès pour un chef de chantier ou un ingénieur.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Ligne Prénom / Nom */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input 
                                            required 
                                            placeholder="Jean" 
                                            className="w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/50"
                                            onChange={e => setFormData({...formData, firstName: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Nom</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input 
                                            required 
                                            placeholder="Dupont" 
                                            className="w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/50"
                                            onChange={e => setFormData({...formData, lastName: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Email Professionnel</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                    <input 
                                        required 
                                        type="email" 
                                        placeholder="jean.dupont@nexusbtp.sn" 
                                        className="w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/50"
                                        onChange={e => setFormData({...formData, email: e.target.value})} 
                                    />
                                </div>
                            </div>

                            {/* Téléphone & Poste */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input 
                                            required 
                                            placeholder="77 000 00 00" 
                                            className="w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/50"
                                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Poste / Rôle</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                        <input 
                                            placeholder="Ingénieur Béton" 
                                            className="w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/50"
                                            onChange={e => setFormData({...formData, jobTitle: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl mt-6 hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 text-lg flex items-center justify-center gap-2">
                                {loading ? "Création en cours..." : "Générer les accès"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Compte Créé !</h2>
                        <p className="text-nexus-concrete mb-8 text-sm max-w-xs mx-auto">
                            Copiez ces informations et transmettez-les au manager. Le mot de passe ne sera plus visible après la fermeture.
                        </p>
                        
                        <div className="bg-nexus-black p-6 rounded-2xl border border-nexus-gray text-left space-y-6 mb-8 relative overflow-hidden">
                            {/* Petite déco de fond */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-nexus-orange/5 rounded-full blur-xl pointer-events-none"></div>

                            <div>
                                <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Identifiant</p>
                                <p className="text-nexus-text font-mono text-lg">{generatedCreds.user.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Mot de passe provisoire</p>
                                <div className="flex justify-between items-center bg-nexus-dark p-3 rounded-lg border border-nexus-gray/50">
                                    <p className="text-nexus-orange font-mono text-xl tracking-widest font-bold">{generatedCreds.generatedPassword}</p>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedCreds.generatedPassword);
                                            alert("Mot de passe copié !");
                                        }} 
                                        className="text-nexus-concrete hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors" 
                                        title="Copier"
                                    >
                                        <Copy size={20}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-full border border-nexus-gray text-nexus-text font-bold py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                            Fermer la fenêtre
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MODAL DÉTAILS UTILISATEUR
// ============================================================================
function UserDetailsModal({ user, onClose }: any) {
    const isClient = user.role === 'CLIENT';
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-2xl rounded-3xl p-0 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                
                {/* Header Modal */}
                <div className="p-6 bg-nexus-black/50 border-b border-nexus-gray flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-nexus-orange text-black flex items-center justify-center font-bold text-2xl">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-nexus-text">{user.firstName} {user.lastName}</h2>
                            <p className="text-nexus-concrete">{isClient ? "Client Particulier" : user.jobTitle}</p>
                            <div className="flex gap-4 mt-2 text-sm text-nexus-concrete">
                                <span className="flex items-center gap-1"><Mail size={14}/> {user.email}</span>
                                <span className="flex items-center gap-1"><Phone size={14}/> {user.phone || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-nexus-concrete hover:text-white p-1 bg-nexus-gray/20 rounded-full"><X size={20}/></button>
                </div>

                {/* Contenu Scrollable */}
                <div className="p-6 overflow-y-auto">
                    <h3 className="text-lg font-bold text-nexus-text mb-4 flex items-center gap-2">
                        <Briefcase size={20} className="text-nexus-orange"/> 
                        {isClient ? "Commandes & Projets" : "Chantiers Gérés"}
                    </h3>

                    <div className="space-y-3">
                        {/* Liste des projets liés */}
                        {user.clientProjects?.length > 0 || user.managedProjects?.length > 0 ? (
                            (user.clientProjects || user.managedProjects).map((proj: any) => (
                                <div key={proj.id} className="bg-nexus-black border border-nexus-gray rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-nexus-text">{proj.name}</h4>
                                        <div className="flex gap-3 text-xs text-nexus-concrete mt-1">
                                            <span className="flex items-center gap-1"><MapPin size={12}/> {proj.location}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(proj.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                                        proj.status === 'IN_PROGRESS' ? 'bg-green-500/10 text-green-500' :
                                        proj.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {proj.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-nexus-concrete italic">Aucun projet associé pour le moment.</p>
                        )}
                    </div>

                    {!isClient && (
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-800">
                            <p>ℹ️ Ce manager a accès à l'application pour faire ses rapports.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helpers
const TabButton = ({ label, icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isActive ? 'bg-nexus-orange text-black shadow-lg' : 'text-nexus-concrete hover:text-nexus-text'}`}>
        <Icon size={18} /> {label}
    </button>
);

const style = `
  .input-modal {
    @apply w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3 text-nexus-text focus:border-nexus-orange outline-none transition-colors;
  }
`;