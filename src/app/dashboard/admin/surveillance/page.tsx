'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { monitoringService } from '@/services/api';
import { 
  ShieldAlert, Smartphone, Wifi, MapPin, Clock, User, Globe, Search, Filter 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';

const ContactMap = dynamic(() => import('@/components/ContactMap'), { ssr: false });

export default function SurveillancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]); // Pour la recherche
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Texte de recherche
  const container = useRef(null);

  // 1. Chargement des données
  useEffect(() => {
    monitoringService.getLogs().then((data) => {
      // FILTRE AUTOMATIQUE : On retire les ADMINS de la liste brute
      const nonAdminLogs = data.filter((log: any) => log.user.role !== 'ADMIN');
      setLogs(nonAdminLogs);
      setFilteredLogs(nonAdminLogs);
    }).finally(() => setLoading(false));
  }, []);

  // 2. Moteur de Recherche Intelligent
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    
    const results = logs.filter((log) => {
        // Recherche dans le Nom/Prénom
        const nameMatch = log.user.firstName.toLowerCase().includes(lowerQuery) || 
                          log.user.lastName.toLowerCase().includes(lowerQuery);
        
        // Recherche dans le Rôle (ex: taper "Ouvrier")
        const roleMatch = log.user.role.toLowerCase().includes(lowerQuery);

        // Recherche Technique (OS, Réseau, IP)
        const techMatch = (log.os && log.os.toLowerCase().includes(lowerQuery)) ||
                          (log.networkType && log.networkType.toLowerCase().includes(lowerQuery)) ||
                          (log.ipAddress && log.ipAddress.includes(lowerQuery));

        return nameMatch || roleMatch || techMatch;
    });

    setFilteredLogs(results);
  }, [searchQuery, logs]);

  // 3. Animation de la liste (se lance quand le filtre change)
  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".log-item", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [filteredLogs, loading]);

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-nexus-dark rounded-xl border border-red-500/30 text-red-500 animate-pulse shadow-lg shadow-red-900/10">
                <ShieldAlert size={32}/>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-nexus-text">Centre de Surveillance</h1>
                <p className="text-nexus-concrete">Suivi temps réel des connexions terrain.</p>
            </div>
        </div>

        {/* BARRE DE RECHERCHE INTELLIGENTE */}
        <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3.5 text-nexus-concrete group-focus-within:text-nexus-orange transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher (Nom, 4G, iPhone, IP...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-nexus-dark border border-nexus-gray rounded-xl pl-12 pr-4 py-3 text-nexus-text focus:border-nexus-orange outline-none transition-all shadow-sm focus:shadow-lg focus:shadow-nexus-orange/10"
            />
            {searchQuery && (
                <span className="absolute right-4 top-3.5 text-xs text-nexus-concrete font-bold bg-nexus-black px-2 py-0.5 rounded">
                    {filteredLogs.length}
                </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTE DES CONNEXIONS (FILTRÉE) */}
        <div className="lg:col-span-2 bg-nexus-dark border border-nexus-gray rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col h-[650px]">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                <Clock size={18} className="text-nexus-orange"/> Historique des sessions
            </h3>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-20 text-nexus-concrete border border-dashed border-nexus-gray rounded-xl">
                        Aucune activité trouvée pour cette recherche.
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div 
                            key={log.id} 
                            onClick={() => setSelectedLog(log)}
                            className={`log-item p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                                selectedLog?.id === log.id 
                                ? 'bg-nexus-orange/10 border-nexus-orange shadow-md' 
                                : 'bg-nexus-black border-nexus-gray hover:bg-nexus-gray/10 hover:border-nexus-concrete'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar Initiale */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shadow-inner ${
                                    log.user.role === 'MANAGER' ? 'bg-blue-500' : 'bg-nexus-orange'
                                }`}>
                                    {log.user.firstName[0]}
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-nexus-text text-sm group-hover:text-white transition-colors">
                                        {log.user.firstName} {log.user.lastName} 
                                        <span className="text-[10px] font-normal text-nexus-concrete ml-2 uppercase tracking-wide border border-nexus-gray px-1.5 py-0.5 rounded bg-nexus-black">
                                            {log.user.role}
                                        </span>
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-nexus-concrete mt-1.5">
                                        <span className="flex items-center gap-1" title="Appareil"><Smartphone size={10}/> {log.os || "Inconnu"}</span>
                                        <span className={`flex items-center gap-1 font-bold ${log.networkType === '4g' ? 'text-green-500' : ''}`} title="Réseau">
                                            <Wifi size={10}/> {log.networkType || "Wifi"}
                                        </span>
                                        {log.ipAddress && (
                                            <span className="flex items-center gap-1 hidden sm:flex" title="Adresse IP"><Globe size={10}/> {log.ipAddress}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-nexus-text font-mono font-bold">{new Date(log.connectedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <p className="text-[10px] text-nexus-concrete">{new Date(log.connectedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* DÉTAILS & CARTE */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6 shadow-xl sticky top-32 h-fit">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500"/> Détails Localisation
            </h3>
            
            {selectedLog ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Carte */}
                    <div className="h-48 w-full rounded-2xl overflow-hidden border border-nexus-gray relative shadow-inner">
                        {selectedLog.latitude ? (
                            <ContactMap userLat={selectedLog.latitude} userLng={selectedLog.longitude} />
                        ) : (
                            <div className="w-full h-full bg-nexus-black flex flex-col items-center justify-center text-nexus-concrete text-xs gap-2">
                                <Globe size={24} className="opacity-20"/>
                                <span>Pas de données GPS</span>
                            </div>
                        )}
                    </div>

                    {/* Infos Techniques */}
                    <div className="space-y-3 bg-nexus-black p-4 rounded-xl border border-nexus-gray">
                        <InfoRow label="Appareil" value={selectedLog.deviceModel} icon={Smartphone} />
                        <InfoRow label="Navigateur" value={selectedLog.browser} icon={Globe} />
                        <InfoRow label="Connexion" value={selectedLog.networkType} icon={Wifi} highlight={selectedLog.networkType === '4g'} />
                        <InfoRow label="IP Publique" value={selectedLog.ipAddress} icon={Globe} />
                        <InfoRow 
                            label="Coordonnées" 
                            value={selectedLog.latitude ? `${selectedLog.latitude.toFixed(5)}, ${selectedLog.longitude.toFixed(5)}` : "Non détecté"} 
                            icon={MapPin} 
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-nexus-concrete italic flex flex-col items-center justify-center h-48 border border-dashed border-nexus-gray rounded-2xl">
                    <User size={32} className="opacity-20 mb-2"/>
                    <p className="text-sm">Sélectionnez une session pour<br/>voir la localisation exacte.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

const InfoRow = ({ label, value, icon: Icon, highlight }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-nexus-gray/30 last:border-0">
        <span className="text-xs text-nexus-concrete flex items-center gap-2">
            <Icon size={14} className="text-nexus-orange"/> {label}
        </span>
        <span className={`text-sm font-bold ${highlight ? 'text-green-500' : 'text-nexus-text'}`}>
            {value || "Inconnu"}
        </span>
    </div>
);