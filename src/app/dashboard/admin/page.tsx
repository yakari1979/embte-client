'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Users, HardHat, FileText, CheckCircle, 
  Clock, MapPin, Building2, TrendingUp, Loader2, ArrowRight,
  MessageSquare, BellRing, X, ChevronRight, Phone, Mail,
  Truck, Package
} from 'lucide-react';
import { adminService,SERVER_URL } from '@/services/api';
import Link from 'next/link';
import { io } from 'socket.io-client'; // Pour le temps réel

export default function AdminDashboard() {
  const container = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // État pour les notifications temps réel
  const [liveNotification, setLiveNotification] = useState<any>(null);

  // État pour la Popup Statistique
  const [selectedStat, setSelectedStat] = useState<{ type: string, label: string, color: string, icon: any } | null>(null);

  // 1. Chargement initial
  const fetchData = async () => {
    try {
      const res = await adminService.getDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 

    // 2. CONNEXION SOCKET.IO (TEMPS RÉEL)
    // const socket = io('http://localhost:3001');
    const socket = io(SERVER_URL);  

    socket.on('connect', () => {
        console.log("Connecté au QG Nexus");
    });

    // Écouter les alertes
    socket.on('admin_notification', (notif) => {
        // Afficher la notification visuelle
        setLiveNotification(notif);

        // Mettre à jour les compteurs en temps réel sans recharger la page
        if (notif.type === 'LOGISTICS') {
            setData((prev: any) => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    pendingLogistics: (prev.stats.pendingLogistics || 0) + 1
                }
            }));
        }

        // Cacher la notif après 6 secondes
        setTimeout(() => setLiveNotification(null), 6000);
    });

    return () => { socket.disconnect(); };
  }, []);

  // Animation d'entrée
  useLayoutEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".admin-card", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
      gsap.fromTo(".order-row", 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [data]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-10 h-10"/></div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* --- TOAST DE NOTIFICATION LIVE --- */}
      {liveNotification && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-4 max-w-sm backdrop-blur-md ${
                liveNotification.urgency === 'CRITICAL' 
                ? 'bg-red-900/90 border-red-500 text-white' 
                : 'bg-nexus-dark/90 border-nexus-orange text-nexus-text'
            }`}>
                <div className={`p-2 rounded-full ${liveNotification.urgency === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-nexus-orange text-black'}`}>
                    <Truck size={24} className="animate-pulse"/>
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">
                        {liveNotification.title}
                    </h4>
                    <p className="text-sm opacity-90 leading-relaxed">
                        {liveNotification.message}
                    </p>
                    <Link href="/dashboard/admin/logistics" className="text-xs font-bold underline mt-2 block hover:opacity-80">
                        Voir la demande →
                    </Link>
                </div>
                <button onClick={() => setLiveNotification(null)} className="text-white/50 hover:text-white"><X size={16}/></button>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-nexus-text mb-1">Quartier Général</h1>
            <p className="text-nexus-concrete">Supervision globale et validation des commandes.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-nexus-dark border border-nexus-gray rounded-full text-sm text-nexus-concrete shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Système opérationnel
        </div>
      </div>

      {/* STATS (KPI) + CARTES ALERTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        
        {/* Carte MESSAGES (Alerte Rouge) */}
        <NotificationCard count={data?.stats.newContacts} />

        {/* Carte LOGISTIQUE (Alerte Jaune/Camion) - CORRIGÉE */}
        <LogisticsCard count={data?.stats.pendingLogistics} />

        {/* Autres Stats Cliquables */}
        <StatCard 
            icon={TrendingUp} label="Total Projets" value={data?.stats.totalProjects} color="text-blue-500" borderColor="border-blue-500"
            onClick={() => setSelectedStat({ type: 'TOTAL', label: 'Tous les Projets', color: 'blue', icon: TrendingUp })}
        />
        <StatCard 
            icon={Clock} label="En Attente" value={data?.stats.pendingProjects} color="text-nexus-orange" borderColor="border-nexus-orange" highlight
            onClick={() => setSelectedStat({ type: 'PENDING', label: 'Projets en Attente', color: 'orange', icon: Clock })}
        />
        <StatCard 
            icon={HardHat} label="Chantiers Actifs" value={data?.stats.activeProjects} color="text-green-500" borderColor="border-green-500"
            onClick={() => setSelectedStat({ type: 'ACTIVE', label: 'Chantiers en Cours', color: 'green', icon: HardHat })}
        />
      </div>

      {/* LISTE DES COMMANDES RECENTES */}
      <div className="bg-nexus-dark border border-nexus-gray rounded-3xl overflow-hidden shadow-xl">
         <div className="p-8 border-b border-nexus-gray flex justify-between items-center bg-nexus-black/20">
            <div>
                <h2 className="text-2xl font-bold text-nexus-text flex items-center gap-3">
                    <FileText className="text-nexus-orange"/> Commandes Entrantes
                </h2>
                <p className="text-nexus-concrete text-sm mt-1">Dernières demandes reçues nécessitant validation.</p>
            </div>
            <div className="px-4 py-1 rounded-full bg-nexus-orange/10 text-nexus-orange text-xs font-bold border border-nexus-orange/20">
                {data?.stats.pendingProjects} en attente
            </div>
        </div>

        <div className="p-6 space-y-4">
            {data?.recentOrders.length === 0 ? (
                <div className="text-center py-20 text-nexus-concrete flex flex-col items-center">
                    <CheckCircle size={48} className="mb-4 opacity-20"/>
                    <p>Aucune nouvelle commande pour le moment.</p>
                </div>
            ) : (
                data?.recentOrders.map((project: any) => (
                    <Link 
                        href={`/dashboard/admin/projects/${project.id}`} 
                        key={project.id} 
                        className="order-row opacity-0 block bg-nexus-black border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange transition-all group hover:bg-nexus-dark/80 cursor-pointer shadow-md"
                    >
                        <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
                                        {project.projectType}
                                    </span>
                                    <span className="text-nexus-concrete text-xs flex items-center gap-1">
                                        <Clock size={12}/> {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-nexus-text mb-1 group-hover:text-nexus-orange transition-colors">
                                    {project.name}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-nexus-concrete mt-3">
                                    <span className="flex items-center gap-1"><MapPin size={14}/> {project.location}</span>
                                    <span className="flex items-center gap-1"><Building2 size={14}/> {project.surface} m²</span>
                                    <span className="flex items-center gap-1 font-bold text-nexus-text border px-2 py-0.5 rounded border-nexus-gray bg-nexus-dark">
                                        {project.budget.toLocaleString()} FCFA
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center bg-nexus-dark w-12 h-12 rounded-full border border-nexus-gray group-hover:bg-nexus-orange group-hover:text-black transition-colors shrink-0">
                                <ArrowRight size={20}/>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
      </div>

      {/* POPUP STATS (Utilisateurs / Projets) */}
      {selectedStat && (
        <StatDetailsModal 
            type={selectedStat.type} 
            label={selectedStat.label} 
            color={selectedStat.color} 
            Icon={selectedStat.icon}
            onClose={() => setSelectedStat(null)} 
        />
      )}

    </div>
  );
}

// ============================================================================
// COMPOSANTS CARTES & MODALES
// ============================================================================

// 1. MESSAGES (ROUGE)
function NotificationCard({ count }: { count: number }) {
    const hasMessages = count > 0;
    return (
        <Link 
            href="/dashboard/admin/contacts"
            className={`admin-card opacity-0 relative p-6 rounded-2xl border shadow-lg flex flex-col justify-between group overflow-hidden transition-all duration-300 ${
                hasMessages 
                ? 'bg-gradient-to-br from-red-600/20 to-nexus-dark border-red-500/50 hover:border-red-500 hover:shadow-red-500/20' 
                : 'bg-nexus-dark border-nexus-gray hover:border-nexus-concrete'
            }`}
        >
            {hasMessages && <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 blur-xl rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>}
            <div className="flex justify-between items-start mb-2 relative z-10">
                <p className={`text-xs uppercase tracking-wider font-bold ${hasMessages ? 'text-red-400' : 'text-nexus-concrete'}`}>Messagerie</p>
                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${hasMessages ? 'bg-red-500 text-nexus-text animate-bounce-slow' : 'bg-nexus-black/50 text-nexus-concrete'}`}>
                    {hasMessages ? <BellRing size={20} /> : <MessageSquare size={20} />}
                </div>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-2">
                <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className={`text-4xl font-black ${hasMessages ? 'text-nexus-text' : 'text-nexus-text'}`}>{count || 0}</h3>
                    <p className="text-[10px] text-nexus-concrete uppercase">Non lus</p>
                </div>
                <div className="opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-nexus-text">
                    <ArrowRight size={24} />
                </div>
            </div>
        </Link>
    );
}

// 2. LOGISTIQUE (JAUNE - CORRIGÉ)
// function LogisticsCard({ count }: { count: number }) {
//     const safeCount = count || 0;
//     const hasRequests = safeCount > 0;
//     return (
//         <Link 
//             href="/dashboard/admin/logistics"
//             className={`admin-card opacity-0 relative p-6 rounded-2xl border shadow-lg flex flex-col justify-between group overflow-hidden transition-all duration-300 ${
//                 hasRequests 
//                 ? 'bg-gradient-to-br from-yellow-500/20 to-nexus-dark border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/20' 
//                 : 'bg-nexus-dark border-nexus-gray hover:border-nexus-concrete'
//             }`}
//         >
//             {hasRequests && <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>}
            
//             <div className="flex justify-between items-start mb-2 relative z-10">
//                 <p className={`text-xs uppercase tracking-wider font-bold ${hasRequests ? 'text-yellow-500' : 'text-nexus-concrete'}`}>Logistique</p>
//                 <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${hasRequests ? 'bg-yellow-500 text-black' : 'bg-nexus-black/50 text-nexus-concrete'}`}>
//                     <Truck size={20} />
//                 </div>
//             </div>

//             <div className="relative z-10 flex items-center justify-between mt-2">
//                 <div className="transform transition-transform duration-300 group-hover:translate-x-2">
//                     <h3 className={`text-4xl font-black ${hasRequests ? 'text-white' : 'text-nexus-text'}`}>{safeCount}</h3>
//                     <p className="text-[10px] text-nexus-concrete uppercase">Demandes</p>
//                 </div>
//                 <div className={`opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${hasRequests ? 'text-yellow-500' : 'text-nexus-text'}`}>
//                     <ArrowRight size={24} />
//                 </div>
//             </div>
//         </Link>
//     );
// }

// 2. LOGISTIQUE (JAUNE - CORRIGÉ)
function LogisticsCard({ count }: { count: number }) {
    // Si count est undefined ou null, on met 0. Sinon on garde la valeur.
    const safeCount = (count === undefined || count === null) ? 0 : count;
    const hasRequests = safeCount > 0;

    return (
        <Link 
            href="/dashboard/admin/logistics"
            className={`admin-card opacity-0 relative p-6 rounded-2xl border shadow-lg flex flex-col justify-between group overflow-hidden transition-all duration-300 cursor-pointer ${
                hasRequests 
                ? 'bg-gradient-to-br from-yellow-500/20 to-nexus-dark border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/20' 
                : 'bg-nexus-dark border-nexus-gray hover:border-nexus-concrete'
            }`}
        >
            {hasRequests && <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>}
            
            <div className="flex justify-between items-start mb-2 relative z-10">
                <p className={`text-xs uppercase tracking-wider font-bold ${hasRequests ? 'text-yellow-500' : 'text-nexus-concrete'}`}>
                    Logistique
                </p>
                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${hasRequests ? 'bg-yellow-500 text-black' : 'bg-nexus-black/50 text-nexus-concrete'}`}>
                    <Truck size={20} />
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-2">
                <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className={`text-4xl font-black ${hasRequests ? 'text-white' : 'text-nexus-text'}`}>
                        {safeCount}
                    </h3>
                    <p className="text-[10px] text-nexus-concrete uppercase">Demandes en attente</p>
                </div>
                
                <div className={`opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${hasRequests ? 'text-yellow-500' : 'text-nexus-text'}`}>
                    <ArrowRight size={24} />
                </div>
            </div>
        </Link>
    );
}

// 3. STATS CLASSIQUES
function StatCard({ icon: Icon, label, value, color, borderColor, highlight, onClick }: any) {
    return (
        <div 
            onClick={onClick}
            className={`admin-card opacity-0 p-6 rounded-2xl border shadow-lg flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${
                highlight ? 'bg-nexus-orange/10 border-nexus-orange/50 hover:bg-nexus-orange/20' : 'bg-nexus-dark border-nexus-gray hover:border-nexus-concrete'
            } ${borderColor ? `hover:${borderColor}` : ''}`}
        >
             <div className="flex justify-between items-start mb-2">
                <p className="text-nexus-concrete text-xs uppercase tracking-wider font-bold">{label}</p>
                <div className={`p-2 rounded-lg ${highlight ? 'bg-nexus-orange text-black' : 'bg-nexus-black/10 ' + color}`}>
                    <Icon size={20} />
                </div>
             </div>
             <div>
                <h3 className="text-4xl font-black text-nexus-text">{value}</h3>
             </div>
        </div>
    )
}

// ============================================================================
// COMPOSANT MODAL DYNAMIQUE (POPUP STATS CORRIGÉE TS)
// ============================================================================
function StatDetailsModal({ type, label, color, Icon, onClose }: any) {
    const [listData, setListData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getColorClass = (prefix: string) => {
        const map: any = {
            'blue': `${prefix}-blue-500`,
            'green': `${prefix}-green-500`,
            'orange': `${prefix}-nexus-orange`,
            'purple': `${prefix}-purple-500`,
        };
        return map[color] || `${prefix}-nexus-concrete`;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // CORRECTION TS : On type explicitement le tableau
                let res: any[] = []; 

                // CAS 1 : CLIENTS
                if (type === 'CLIENTS') {
                    res = await adminService.getUsersByRole('CLIENT');
                } 
                // CAS 2 : PROJETS ACTIFS
                else if (type === 'ACTIVE') {
                    const activeProjects = await adminService.getActiveProjects();
                    res = activeProjects.filter((p: any) => p.status === 'IN_PROGRESS');
                } 
                // CAS 3 : PROJETS EN ATTENTE
                else if (type === 'PENDING') {
                     const dashData = await adminService.getDashboard();
                     res = dashData.recentOrders || [];
                }
                // CAS 4 : TOTAL PROJETS
                else if (type === 'TOTAL') {
                    const active = await adminService.getActiveProjects();
                    const dashData = await adminService.getDashboard();
                    // On combine et on dédoublonne
                    const all = [...active, ...(dashData.recentOrders || [])];
                    const uniqueMap = new Map();
                    all.forEach(item => uniqueMap.set(item.id, item));
                    res = Array.from(uniqueMap.values());
                }
                
                setListData(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [type]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300">
            <div className={`bg-nexus-dark border w-full max-w-2xl rounded-3xl p-0 relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${getColorClass('border')}`}>
                
                <div className={`h-24 relative p-6 flex items-center justify-between bg-nexus-black/40 border-b border-white/5`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-nexus-black border border-white/10 ${getColorClass('text')}`}>
                            <Icon size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-nexus-concrete uppercase font-bold tracking-wider">Détails</p>
                            <h2 className="text-2xl font-black text-nexus-text">{label}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-nexus-concrete hover:text-nexus-text transition-colors">
                        <X size={24}/>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 className={`animate-spin mx-auto mb-2 ${getColorClass('text')}`} size={32}/>
                            <p className="text-nexus-concrete text-sm">Chargement des données...</p>
                        </div>
                    ) : listData.length === 0 ? (
                        <div className="text-center py-10 text-nexus-concrete">Aucune donnée disponible.</div>
                    ) : (
                        <div className="space-y-3">
                            {listData.map((item: any) => (
                                <div key={item.id} className="bg-nexus-black p-4 rounded-xl border border-nexus-gray flex items-center justify-between hover:bg-nexus-black/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-nexus-black ${getColorClass('bg')}`}>
                                            {item.firstName ? item.firstName[0] : (item.name ? item.name[0] : '#')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-nexus-text group-hover:text-nexus-text transition-colors">
                                                {item.firstName ? `${item.firstName} ${item.lastName}` : item.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-nexus-concrete">
                                                {item.email && <span className="flex items-center gap-1"><Mail size={10}/> {item.email}</span>}
                                                {item.location && <span className="flex items-center gap-1"><MapPin size={10}/> {item.location}</span>}
                                                {item.status && (
                                                    <span className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] border ${
                                                        item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        item.status === 'IN_PROGRESS' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        'bg-nexus-gray/20 text-nexus-concrete border-nexus-gray'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href={type === 'CLIENTS' ? `/dashboard/admin/users` : `/dashboard/admin/projects/${item.id}`}
                                        className={`p-2 rounded-lg border border-nexus-gray hover:bg-nexus-dark transition-colors ${getColorClass('text')}`}
                                    >
                                        <ChevronRight size={18}/>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-nexus-black/30 border-t border-nexus-gray text-center">
                    <button onClick={onClose} className="text-sm text-nexus-concrete hover:text-nexus-text font-bold">Fermer</button>
                </div>
            </div>
        </div>
    );
}