'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { clientService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  Package, Truck, CheckCircle2, Calendar, MapPin, 
  Box, Loader2, AlertTriangle 
} from 'lucide-react';

export default function ClientLogisticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ deliveries: any[], inventory: any[] }>({ deliveries: [], inventory: [] });
  const container = useRef(null);

  useEffect(() => {
    clientService.getLogistics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      // Colonnes
      gsap.fromTo(".col-anim", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
      // Items de liste
      gsap.fromTo(".list-item", 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="mb-10 col-anim opacity-0">
        <h1 className="text-3xl font-bold text-nexus-text mb-2">Suivi des Matériaux</h1>
        <p className="text-nexus-concrete">
            Consultez les livraisons effectuées et le stock disponible sur votre chantier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLONNE 1 : HISTORIQUE LIVRAISONS (TIMELINE) */}
        <div className="col-anim opacity-0 space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-nexus-gray">
                <div className="p-3 bg-nexus-dark rounded-xl text-green-500 border border-nexus-gray shadow-sm">
                    <Truck size={24}/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-nexus-text">Dernières Livraisons</h2>
                    <p className="text-xs text-nexus-concrete uppercase tracking-wider">Matériel reçu sur site</p>
                </div>
            </div>

            {data.deliveries.length === 0 ? (
                <div className="p-8 bg-nexus-dark border border-nexus-gray rounded-2xl text-center border-dashed">
                    <p className="text-nexus-concrete">Aucune livraison enregistrée pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-0 relative pl-4 border-l-2 border-nexus-gray/30 ml-4">
                    {data.deliveries.map((item, index) => (
                        <div key={item.id} className="list-item opacity-0 relative pl-8 pb-8 last:pb-0">
                            {/* Point sur la ligne */}
                            <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-nexus-black shadow-md"></div>
                            
                            <div className="bg-nexus-dark p-5 rounded-2xl border border-nexus-gray hover:border-green-500/50 transition-colors group shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-nexus-text text-lg">{item.itemName}</h3>
                                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-1">
                                        <CheckCircle2 size={12}/> LIVRÉ
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-nexus-concrete mb-3">
                                    {/* CORRECTION : bg-nexus-gray/20 au lieu de bg-nexus-black pour le contraste Light/Dark */}
                                    <span className="flex items-center gap-1 bg-nexus-gray/20 px-3 py-1.5 rounded-lg">
                                        <Package size={14} className="text-nexus-orange"/> 
                                        {/* CORRECTION : text-nexus-text au lieu de text-white */}
                                        <strong className="text-nexus-text ml-1">{item.quantity} {item.unit}</strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14}/> {new Date(item.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="text-xs text-nexus-concrete flex items-center gap-1 opacity-70">
                                    <MapPin size={12}/> Réceptionné sur le chantier
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* COLONNE 2 : STOCK ACTUEL (GRILLE) */}
        <div className="col-anim opacity-0 space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-nexus-gray">
                <div className="p-3 bg-nexus-dark rounded-xl text-blue-500 border border-nexus-gray shadow-sm">
                    <Box size={24}/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-nexus-text">Stock Disponible</h2>
                    <p className="text-xs text-nexus-concrete uppercase tracking-wider">Inventaire temps réel</p>
                </div>
            </div>

            {data.inventory.length === 0 ? (
                <div className="p-8 bg-nexus-dark border border-nexus-gray rounded-2xl text-center border-dashed">
                    <p className="text-nexus-concrete">Stock vide ou non inventorié.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.inventory.map((item) => (
                        <div key={item.id} className="list-item opacity-0 bg-nexus-dark p-5 rounded-2xl border border-nexus-gray flex flex-col justify-between hover:bg-nexus-gray/10 transition-colors group shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                {/* CORRECTION : bg-nexus-gray/20 pour que l'icône ressorte bien sur les 2 modes */}
                                <div className="p-2 bg-nexus-gray/20 rounded-lg text-nexus-concrete group-hover:text-nexus-text transition-colors">
                                    <Package size={20}/>
                                </div>
                                <span className="text-xs font-bold text-nexus-concrete uppercase tracking-wider bg-nexus-gray/10 px-2 py-1 rounded">
                                    {item.category || "Matériau"}
                                </span>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-bold text-nexus-text mb-1 truncate" title={item.name}>{item.name}</h4>
                                <p className="text-3xl font-black text-nexus-orange">
                                    {item.quantity} <span className="text-sm font-medium text-nexus-concrete">{item.unit}</span>
                                </p>
                                
                                {item.quantity <= item.minThreshold && (
                                    <div className="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold animate-pulse">
                                        <AlertTriangle size={12}/> Stock critique
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}