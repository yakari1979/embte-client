'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  Package, ShoppingCart, CheckCircle2, XCircle, Truck, 
  AlertTriangle, Clock, MapPin, Loader2, Archive, X, AlertOctagon
} from 'lucide-react';

export default function AdminLogisticsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'TODO' | 'HISTORY'>('TODO');
  const container = useRef(null);

  // État pour la Modal de Confirmation
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null; status: string | null }>({
    isOpen: false,
    id: null,
    status: null
  });
  const [processing, setProcessing] = useState(false);

  const loadData = () => {
    adminService.getAllLogistics()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Animation
  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".supply-card", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [loading, filter, requests]);

  // 1. Ouvre la modal au lieu de faire l'action directe
  const openConfirmation = (id: string, status: string) => {
    setConfirmModal({ isOpen: true, id, status });
  };

  // 2. Exécute l'action quand l'utilisateur confirme dans la modal
  const handleConfirmAction = async () => {
    if (!confirmModal.id || !confirmModal.status) return;
    
    setProcessing(true);
    try {
      await adminService.updateSupplyStatus(confirmModal.id, confirmModal.status);
      loadData(); // Rafraichir
      setConfirmModal({ isOpen: false, id: null, status: null }); // Fermer
    } catch (e) {
      alert("Erreur lors de l'action");
    } finally {
      setProcessing(false);
    }
  };

  const displayedRequests = requests.filter((r) => {
    if (filter === 'TODO') return r.status === 'PENDING';
    return r.status !== 'PENDING';
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-nexus-text mb-1">Centrale d'Achat</h1>
            <p className="text-nexus-concrete">Gestion des approvisionnements et commandes fournisseurs.</p>
        </div>
        
        <div className="flex bg-nexus-dark p-1 rounded-xl border border-nexus-gray">
            <button 
                onClick={() => setFilter('TODO')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${filter === 'TODO' ? 'bg-nexus-orange text-black shadow-lg' : 'text-nexus-concrete hover:text-nexus-text'}`}
            >
                <ShoppingCart size={18}/> À Traiter
                <span className="bg-nexus-black/20 px-2 rounded-full text-xs ml-1">
                    {requests.filter(r => r.status === 'PENDING').length}
                </span>
            </button>
            <button 
                onClick={() => setFilter('HISTORY')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${filter === 'HISTORY' ? 'bg-nexus-orange text-black shadow-lg' : 'text-nexus-concrete hover:text-nexus-text'}`}
            >
                <Archive size={18}/> Historique
            </button>
        </div>
      </div>

      {/* LISTE */}
      {displayedRequests.length === 0 ? (
        <div className="text-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl border-dashed">
            <Package size={48} className="text-nexus-concrete opacity-50 mx-auto mb-4"/>
            <p className="text-nexus-concrete">Aucune demande dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRequests.map((req) => (
                <div 
                    key={req.id} 
                    className={`supply-card opacity-0 p-6 rounded-2xl border flex flex-col justify-between h-full ${
                        req.urgency === 'CRITICAL' && req.status === 'PENDING'
                        ? 'bg-gradient-to-br from-red-900/20 to-nexus-dark border-red-500/50 shadow-red-900/10 shadow-lg'
                        : 'bg-nexus-dark border-nexus-gray'
                    }`}
                >
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                                {req.status === 'PENDING' ? 'En attente' : req.status === 'ORDERED' ? 'Commandé' : req.status === 'DELIVERED' ? 'Livré' : 'Refusé'}
                            </span>
                            {req.urgency === 'CRITICAL' && (
                                <span className="flex items-center gap-1 text-xs font-bold text-red-500 animate-pulse">
                                    <AlertTriangle size={14}/> URGENT
                                </span>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-nexus-text mb-1">{req.itemName}</h3>
                        <p className="text-xl text-nexus-orange font-mono mb-4">
                            {req.quantity} <span className="text-sm text-nexus-concrete">{req.unit}</span>
                        </p>

                        <div className="space-y-2 text-sm text-nexus-concrete border-t border-nexus-gray/50 pt-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-nexus-text"/> 
                                <span className="text-nexus-text font-medium">{req.project.name}</span>
                            </div>
                            <div className="flex items-center gap-2 pl-6 text-xs opacity-70">
                                {req.project.location}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Clock size={14}/> Demandé le {new Date(req.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {req.status === 'PENDING' ? (
                        <div className="flex gap-3 mt-6 pt-4 border-t border-nexus-gray/50">
                            <button 
                                onClick={() => openConfirmation(req.id, 'REJECTED')}
                                className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-colors text-sm"
                            >
                                Refuser
                            </button>
                            <button 
                                onClick={() => openConfirmation(req.id, 'ORDERED')}
                                className="flex-1 py-2.5 rounded-xl bg-nexus-orange text-black font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm shadow-lg"
                            >
                                <Truck size={16}/> Commander
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 pt-4 border-t border-nexus-gray/50 text-center">
                             {req.status === 'ORDERED' && <p className="text-blue-400 text-sm font-bold flex items-center justify-center gap-2"><Truck size={16}/> En transit</p>}
                             {req.status === 'DELIVERED' && <p className="text-green-500 text-sm font-bold flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Reçu sur chantier</p>}
                             {req.status === 'REJECTED' && <p className="text-red-500 text-sm font-bold flex items-center justify-center gap-2"><XCircle size={16}/> Demande refusée</p>}
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}

      {/* --- MODAL CONFIRMATION (NOUVEAU) --- */}
      {confirmModal.isOpen && (
        <ConfirmationModal 
            status={confirmModal.status} 
            onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
            onConfirm={handleConfirmAction}
            processing={processing}
        />
      )}

    </div>
  );
}

// ============================================================================
// COMPOSANT MODAL CONFIRMATION
// ============================================================================
function ConfirmationModal({ status, onClose, onConfirm, processing }: any) {
    const isOrder = status === 'ORDERED';
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-sm rounded-3xl p-6 relative shadow-2xl text-center">
                
                {/* Icône Animée */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isOrder ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                    {isOrder ? <Truck size={40} className="animate-pulse"/> : <AlertOctagon size={40}/>}
                </div>

                <h3 className="text-2xl font-bold text-nexus-text mb-2">
                    {isOrder ? "Valider la Commande ?" : "Refuser la Demande ?"}
                </h3>
                
                <p className="text-nexus-concrete text-sm mb-8">
                    {isOrder 
                        ? "Cette action notifiera le manager que le matériel est en route."
                        : "Le manager sera notifié que sa demande a été rejetée."
                    }
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 py-3 rounded-xl border border-nexus-gray text-nexus-concrete hover:text-white font-bold transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={processing}
                        className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50 ${
                            isOrder ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                        }`}
                    >
                        {processing ? <Loader2 className="animate-spin" size={20}/> : (isOrder ? "Confirmer" : "Refuser")}
                    </button>
                </div>

            </div>
        </div>
    );
}

// Helpers
const getStatusStyle = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'ORDERED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-nexus-gray text-nexus-concrete border-nexus-gray';
    }
};