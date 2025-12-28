'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { 
  ArrowLeft, Package, History, AlertTriangle, TrendingDown, 
  User, Calendar, Box, ShieldCheck, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminInventoryPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);

  useEffect(() => {
    adminService.getProjectInventory(id as string)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".audit-card", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
      gsap.fromTo(".log-row", 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.3 }
      );
    }, container);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  // Calculs
  const alerts = data.inventory.filter((i: any) => i.quantity <= i.minThreshold).length;
  const allLogs = data.inventory.flatMap((i: any) => i.logs).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <Link href={`/dashboard/admin/projects/${id}`} className="flex items-center gap-2 text-nexus-concrete hover:text-white mb-4 transition-colors">
                <ArrowLeft size={18}/> Retour au Projet
            </Link>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Audit de Stock : {data.project.name}</h1>
            <p className="text-nexus-concrete">Supervision des mouvements de matériaux et consommables.</p>
        </div>
        
        {alerts > 0 && (
            <div className="px-6 py-3 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertTriangle className="text-red-500" size={24}/>
                <div>
                    <h4 className="text-red-500 font-bold">Attention Requise</h4>
                    <p className="text-xs text-red-300">{alerts} articles en rupture de stock</p>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : ÉTAT DU STOCK */}
        <div className="lg:col-span-2 space-y-6">
            <div className="audit-card bg-nexus-dark border border-nexus-gray rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                    <Package className="text-nexus-orange"/> Inventaire Temps Réel
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.inventory.map((item: any) => {
                        const percent = Math.min(100, Math.round((item.quantity / item.initialQuantity) * 100)) || 0;
                        const isLow = item.quantity <= item.minThreshold;

                        return (
                            <div key={item.id} className={`p-4 rounded-xl border relative overflow-hidden ${isLow ? 'bg-red-900/10 border-red-500/30' : 'bg-nexus-black border-nexus-gray'}`}>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <h4 className="font-bold text-nexus-text">{item.name}</h4>
                                    <span className="text-xs text-nexus-concrete uppercase">{item.category}</span>
                                </div>
                                
                                <div className="flex items-end gap-2 relative z-10 mb-2">
                                    <span className="text-3xl font-black text-white">{item.quantity}</span>
                                    <span className="text-sm text-nexus-concrete mb-1">{item.unit}</span>
                                </div>

                                {/* Jauge */}
                                <div className="w-full h-1.5 bg-nexus-dark rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>

                                {isLow && <AlertTriangle size={80} className="absolute -right-4 -bottom-4 text-red-500/10 rotate-12"/>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* COLONNE DROITE : JOURNAL D'ACTIVITÉ */}
        <div className="audit-card bg-nexus-dark border border-nexus-gray rounded-3xl p-6 h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                <History className="text-blue-500"/> Mouvements Récents
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {allLogs.length === 0 ? (
                    <p className="text-nexus-concrete text-center italic">Aucun mouvement enregistré.</p>
                ) : (
                    allLogs.map((log: any) => (
                        <div key={log.id} className="log-row p-3 rounded-xl bg-nexus-black border border-nexus-gray flex gap-3 relative overflow-hidden group hover:border-nexus-orange/30 transition-colors">
                            <div className={`w-1 shrink-0 rounded-full ${
                                log.action === 'USAGE' ? 'bg-orange-500' : 
                                log.action === 'RESTOCK' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-nexus-text">
                                        {log.action === 'USAGE' ? 'Consommation' : log.action === 'RESTOCK' ? 'Réapprovisionnement' : 'Perte/Vol'}
                                    </p>
                                    <span className="text-[10px] text-nexus-concrete font-mono">
                                        {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                
                                <p className="text-xs text-white mt-1">
                                    <span className="font-bold">{log.quantity}</span> unités
                                </p>
                                
                                {log.note && (
                                    <p className="text-xs text-nexus-concrete mt-1 italic line-clamp-2">"{log.note}"</p>
                                )}

                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-nexus-gray/30">
                                    <User size={10} className="text-nexus-concrete"/>
                                    <span className="text-[10px] text-nexus-concrete uppercase">
                                        {log.user.firstName} {log.user.lastName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
}