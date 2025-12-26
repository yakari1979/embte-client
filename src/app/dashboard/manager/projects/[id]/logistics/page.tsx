'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { managerService } from '@/services/api';
import { 
    ArrowLeft, Package, ShoppingCart, Plus, CheckCircle, 
    Truck, AlertTriangle, Loader2, X, Box, Ruler, AlertCircle as AlertIcon 
  } from 'lucide-react';
import Link from 'next/link';

export default function LogisticsPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ inventory: any[], requests: any[] }>({ inventory: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadData = () => {
    managerService.getLogistics(id as string)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const handleReceive = async (requestId: string) => {
    if(!confirm("Confirmez-vous la réception de ce matériel sur le chantier ?")) return;
    await managerService.receiveSupply(requestId);
    loadData(); // Rafraichir
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <Link href={`/dashboard/manager/projects/${id}`} className="flex items-center gap-2 text-nexus-concrete hover:text-white mb-4">
                <ArrowLeft size={18}/> Retour au Projet
            </Link>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Logistique & Matériaux</h1>
            <p className="text-nexus-concrete">Gestion des stocks et réapprovisionnement.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-nexus-orange text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
        >
            <ShoppingCart size={20}/> Commander Matériel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. STOCK ACTUEL */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-nexus-text mb-6 flex items-center gap-2">
                <Package className="text-blue-500"/> Stock sur Chantier
            </h2>
            
            {data.inventory.length === 0 ? (
                <p className="text-nexus-concrete italic text-center py-10">Aucun matériel en stock.</p>
            ) : (
                <div className="space-y-3">
                    {data.inventory.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-nexus-black rounded-xl border border-nexus-gray">
                            <div>
                                <h4 className="font-bold text-nexus-text">{item.name}</h4>
                                <p className="text-xs text-nexus-concrete uppercase">{item.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-white">{item.quantity} <span className="text-sm font-normal text-nexus-concrete">{item.unit}</span></p>
                                {item.quantity <= item.minThreshold && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 justify-end font-bold animate-pulse">
                                        <AlertTriangle size={10}/> Stock Faible
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* 2. DEMANDES & LIVRAISONS */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-nexus-text mb-6 flex items-center gap-2">
                <Truck className="text-green-500"/> Suivi Commandes
            </h2>

            {data.requests.length === 0 ? (
                <p className="text-nexus-concrete italic text-center py-10">Aucune commande en cours.</p>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {data.requests.map((req: any) => (
                        <div key={req.id} className="p-4 bg-nexus-black rounded-xl border border-nexus-gray relative overflow-hidden">
                            {/* Statut Badge */}
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-nexus-text">{req.itemName}</h4>
                                <StatusBadge status={req.status} />
                            </div>
                            
                            <div className="flex justify-between items-center text-sm text-nexus-concrete mb-4">
                                <span>Quantité: <strong className="text-white">{req.quantity} {req.unit}</strong></span>
                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Action : Réceptionner */}
                            {req.status === 'ORDERED' && (
                                <button 
                                    onClick={() => handleReceive(req.id)}
                                    className="w-full py-2 bg-green-600/20 text-green-500 border border-green-600/50 rounded-lg font-bold text-sm hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16}/> Confirmer Réception
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>

      {/* MODAL COMMANDE */}
      {showModal && (
        <RequestSupplyModal projectId={id} onClose={() => setShowModal(false)} onSuccess={loadData} />
      )}

    </div>
  );
}

// --- SOUS COMPOSANTS ---

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        ORDERED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
        REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    const labels: any = {
        PENDING: "En attente",
        ORDERED: "En route",
        DELIVERED: "Livré",
        REJECTED: "Refusé",
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

// ============================================================================
// MODAL COMMANDE MATÉRIEL (PREMIUM STYLE)
// ============================================================================
function RequestSupplyModal({ projectId, onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({ itemName: '', quantity: '', unit: 'Sac', urgency: 'MEDIUM', projectId });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managerService.requestSupply(formData);
            onSuccess();
            onClose();
        } catch (e) { alert("Erreur lors de la commande"); } 
        finally { setLoading(false); }
    };

    // Style commun des inputs
    const inputClasses = "w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/60 appearance-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-5 right-5 text-nexus-concrete hover:text-nexus-text p-2 rounded-full hover:bg-white/5 transition-colors">
                    <X size={24}/>
                </button>
                
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-nexus-text mb-2">Commander Matériel</h2>
                    <p className="text-nexus-concrete text-sm">Faites une demande d'approvisionnement pour le chantier.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* NOM DU MATÉRIEL */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Matériel</label>
                        <div className="relative">
                            <Box className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                            <input 
                                required 
                                placeholder="Ex: Ciment 32.5" 
                                className={inputClasses} 
                                onChange={e => setFormData({...formData, itemName: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* QUANTITÉ & UNITÉ */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Quantité</label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                <input 
                                    required 
                                    type="number" 
                                    placeholder="50" 
                                    className={inputClasses} 
                                    onChange={e => setFormData({...formData, quantity: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Unité</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                <select className={inputClasses} onChange={e => setFormData({...formData, unit: e.target.value})}>
                                    <option>Sac</option>
                                    <option>Barre</option>
                                    <option>m3</option>
                                    <option>Camion</option>
                                    <option>Palette</option>
                                    <option>Unité</option>
                                </select>
                                <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
                            </div>
                        </div>
                    </div>

                    {/* URGENCE */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Niveau d'Urgence</label>
                        <div className="relative">
                            <AlertIcon className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                            <select className={inputClasses} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                                <option value="MEDIUM">Normale (48h)</option>
                                <option value="HIGH">Urgente (24h)</option>
                                <option value="CRITICAL">Critique (Arrêt chantier)</option>
                            </select>
                            <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
                        </div>
                    </div>
                    
                    <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl mt-6 hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin"/> : <ShoppingCart size={20}/>}
                        {loading ? "Envoi..." : "Envoyer la commande"}
                    </button>
                </form>
            </div>
        </div>
    );
}