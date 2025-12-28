'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { managerService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { 
  ArrowLeft, Package, Plus, Layers, Hammer, PaintBucket, 
  ArrowDownRight, AlertTriangle, History, CheckCircle2, Loader2, Save
} from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const { id } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState<any>(null); // Contient l'item à modifier

  const loadData = () => {
    managerService.getFullInventory(id as string)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".stock-card", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, [loading, items]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  // Séparation Consommables / Équipements
  const consumables = items.filter(i => i.type === 'CONSUMABLE');
  const equipments = items.filter(i => i.type === 'EQUIPMENT');

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
            <Link href={`/dashboard/manager/projects/${id}`} className="flex items-center gap-2 text-nexus-concrete hover:text-nexus-text mb-4 transition-colors">
                <ArrowLeft size={18}/> Retour au Projet
            </Link>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Smart Stock</h1>
            <p className="text-nexus-concrete">Suivi précis des consommations et du matériel.</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-nexus-dark border border-nexus-gray text-nexus-text px-6 py-3 rounded-xl font-bold hover:bg-nexus-gray/20 transition-all"
        >
            <Plus size={20}/> Nouveau Matériel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE 1 & 2 : CONSOMMABLES (Visuel Jauge) */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <PaintBucket className="text-nexus-orange" size={24}/>
                <h2 className="text-xl font-bold text-nexus-text">Consommables</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {consumables.length === 0 ? (
                    <div className="col-span-2 p-10 bg-nexus-dark border border-nexus-gray border-dashed rounded-2xl text-center text-nexus-concrete">
                        Aucun matériau enregistré. Ajoutez du ciment, du sable...
                    </div>
                ) : (
                    consumables.map((item) => (
                        <StockCard 
                            key={item.id} 
                            item={item} 
                            onDeclare={() => setShowUsageModal(item)} 
                        />
                    ))
                )}
            </div>

            <div className="flex items-center gap-3 mb-2 mt-10">
                <Hammer className="text-blue-500" size={24}/>
                <h2 className="text-xl font-bold text-nexus-text">Outillage & Équipement</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipments.map((item) => (
                    <StockCard 
                        key={item.id} 
                        item={item} 
                        isEquipment 
                        onDeclare={() => setShowUsageModal(item)} 
                    />
                ))}
            </div>
        </div>

        {/* COLONNE 3 : HISTORIQUE LIVE */}
        <div className="bg-nexus-dark border border-nexus-gray rounded-3xl p-6 h-fit sticky top-32">
            <h3 className="text-lg font-bold text-nexus-text mb-6 flex items-center gap-2">
                <History className="text-nexus-concrete"/> Journal de bord
            </h3>
            <div className="space-y-6 relative pl-4 border-l border-nexus-gray/30">
                {items.flatMap(i => i.logs).sort((a:any,b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map((log: any) => (
                    <div key={log.id} className="relative pl-6">
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-nexus-dark ${
                            log.action === 'USAGE' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <p className="text-sm font-bold text-nexus-text">
                            {log.action === 'USAGE' ? 'Utilisation' : 'Ajout'} de <span className="text-white">{log.quantity}</span>
                        </p>
                        <p className="text-xs text-nexus-concrete mt-1 italic">"{log.note || 'Aucune note'}"</p>
                        <p className="text-[10px] text-nexus-concrete uppercase mt-2">
                            {new Date(log.date).toLocaleDateString()} • {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* MODALS */}
      {showAddModal && (
        <AddItemModal projectId={id} onClose={() => setShowAddModal(false)} onSuccess={loadData} />
      )}
      
      {showUsageModal && (
        <DeclareUsageModal item={showUsageModal} onClose={() => setShowUsageModal(null)} onSuccess={loadData} />
      )}

    </div>
  );
}

// ============================================================================
// COMPOSANT CARTE STOCK (INTELLIGENTE)
// ============================================================================
function StockCard({ item, onDeclare, isEquipment }: any) {
    // Calcul pourcentage restant
    const percent = Math.min(100, Math.round((item.quantity / item.initialQuantity) * 100)) || 0;
    const isLow = item.quantity <= item.minThreshold;

    return (
        <div className={`stock-card bg-nexus-dark border rounded-2xl p-6 relative overflow-hidden group ${isLow ? 'border-red-500/50 shadow-red-900/10' : 'border-nexus-gray hover:border-nexus-orange/30'}`}>
            
            {/* Barre de fond (Jauge visuelle) */}
            <div className="absolute bottom-0 left-0 h-1 bg-nexus-black w-full">
                <div 
                    className={`h-full transition-all duration-1000 ${
                        percent < 20 ? 'bg-red-500' : percent < 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-nexus-text text-lg">{item.name}</h3>
                    <span className="text-xs text-nexus-concrete uppercase tracking-wider">{item.category}</span>
                </div>
                <div className={`text-2xl font-black ${isLow ? 'text-red-500' : 'text-white'}`}>
                    {item.quantity} <span className="text-sm font-normal text-nexus-concrete">{item.unit}</span>
                </div>
            </div>

            <div className="flex justify-between items-end mt-4">
                <div className="text-xs text-nexus-concrete">
                    Initial: <strong className="text-nexus-text">{item.initialQuantity}</strong>
                </div>
                
                <button 
                    onClick={onDeclare}
                    className="flex items-center gap-2 bg-nexus-black border border-nexus-gray px-4 py-2 rounded-lg text-sm font-bold text-nexus-text hover:bg-nexus-orange hover:text-black hover:border-nexus-orange transition-all"
                >
                    <ArrowDownRight size={16}/> {isEquipment ? "Mvmt" : "Utiliser"}
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// MODAL 1 : AJOUTER MATÉRIEL (SETUP)
// ============================================================================
function AddItemModal({ projectId, onClose, onSuccess }: any) {
    const [form, setForm] = useState({ name: '', category: 'Gros Œuvre', quantity: '', unit: 'Sac', type: 'CONSUMABLE', minThreshold: '5', projectId });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managerService.addItem(form);
            onSuccess();
            onClose();
        } catch (e) { alert("Erreur"); } finally { setLoading(false); }
    };

    const inputClass = "w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3 text-nexus-text outline-none focus:border-nexus-orange transition-colors";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-md rounded-3xl p-8">
                <h2 className="text-xl font-bold text-nexus-text mb-6">Ajouter au Stock</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-nexus-concrete uppercase">Nom</label>
                        <input required placeholder="Ex: Ciment 32.5" className={inputClass} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Type</label>
                            <select className={inputClass} onChange={e => setForm({...form, type: e.target.value})}>
                                <option value="CONSUMABLE">Consommable</option>
                                <option value="EQUIPMENT">Équipement</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Catégorie</label>
                            <select className={inputClass} onChange={e => setForm({...form, category: e.target.value})}>
                                <option>Gros Œuvre</option>
                                <option>Plomberie</option>
                                <option>Électricité</option>
                                <option>Outillage</option>
                                <option>Peinture</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Quantité Initiale</label>
                            <input required type="number" className={inputClass} onChange={e => setForm({...form, quantity: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Unité</label>
                            <select className={inputClass} onChange={e => setForm({...form, unit: e.target.value})}>
                                <option>Sac</option>
                                <option>Barre</option>
                                <option>m3</option>
                                <option>Unité</option>
                                <option>Kg</option>
                                <option>Litre</option>
                            </select>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-3 rounded-xl mt-4">
                        {loading ? "..." : "Ajouter au stock"}
                    </button>
                    <button type="button" onClick={onClose} className="w-full text-nexus-concrete text-sm mt-2 hover:text-white">Annuler</button>
                </form>
            </div>
        </div>
    );
}

// ============================================================================
// MODAL 2 : DÉCLARER UTILISATION (TRACKING)
// ============================================================================
function DeclareUsageModal({ item, onClose, onSuccess }: any) {
    const [form, setForm] = useState({ itemId: item.id, quantity: '', action: 'USAGE', note: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managerService.recordUsage(form);
            onSuccess();
            onClose();
        } catch (e: any) { alert("Erreur: " + (e.response?.data?.message || "Inconnue")); } 
        finally { setLoading(false); }
    };

    const inputClass = "w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3 text-nexus-text outline-none focus:border-nexus-orange transition-colors";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-md rounded-3xl p-8">
                <h2 className="text-xl font-bold text-nexus-text mb-2">Mouvement de Stock</h2>
                <p className="text-nexus-concrete text-sm mb-6">Article : <strong>{item.name}</strong> (Reste: {item.quantity})</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="text-xs font-bold text-nexus-concrete uppercase">Type d'action</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <button type="button" onClick={() => setForm({...form, action: 'USAGE'})} className={`py-2 rounded-lg text-sm font-bold border ${form.action === 'USAGE' ? 'bg-nexus-orange text-black border-nexus-orange' : 'border-nexus-gray text-nexus-concrete'}`}>
                                Utilisation
                            </button>
                            <button type="button" onClick={() => setForm({...form, action: 'RESTOCK'})} className={`py-2 rounded-lg text-sm font-bold border ${form.action === 'RESTOCK' ? 'bg-green-500 text-black border-green-500' : 'border-nexus-gray text-nexus-concrete'}`}>
                                Ajout / Retour
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-nexus-concrete uppercase">Quantité ({item.unit})</label>
                        <input required type="number" className={inputClass} placeholder="Ex: 5" onChange={e => setForm({...form, quantity: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-nexus-concrete uppercase">Note / Justification</label>
                        <textarea required rows={3} className={inputClass} placeholder="Ex: Coulage poteaux RDC..." onChange={e => setForm({...form, note: e.target.value})} />
                    </div>

                    <button disabled={loading} className="w-full bg-nexus-text text-nexus-black font-bold py-3 rounded-xl mt-4 hover:bg-white transition-colors">
                        {loading ? "Enregistrement..." : "Valider le mouvement"}
                    </button>
                    <button type="button" onClick={onClose} className="w-full text-nexus-concrete text-sm mt-2 hover:text-white">Annuler</button>
                </form>
            </div>
        </div>
    );
}