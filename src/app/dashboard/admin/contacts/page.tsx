'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  MessageSquare, Phone, Mail, Clock, 
  CheckCircle2, AlertCircle, X, ExternalLink, Inbox, Calendar, MapPin
} from 'lucide-react';

export default function AdminContactsPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const container = useRef(null);

  const loadContacts = () => {
    adminService.getAllContacts()
      .then(setContacts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadContacts(); }, []);

  // --- CORRECTION ANIMATION ---
  useLayoutEffect(() => {
    if (loading || contacts.length === 0) return;
    
    const ctx = gsap.context(() => {
      // On utilise .fromTo pour FORCER l'opacité à 1 à la fin
      gsap.fromTo(".msg-card", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, container);
    
    return () => ctx.revert();
  }, [loading, contacts]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black text-nexus-text">Chargement...</div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Centre de Messagerie</h1>
            <p className="text-nexus-concrete">Demandes de contact, réclamations et rendez-vous.</p>
        </div>
        <div className="bg-nexus-dark px-4 py-2 rounded-xl border border-nexus-gray text-nexus-text font-bold flex items-center gap-2 shadow-sm">
            <Inbox size={18} className="text-nexus-orange"/>
            {contacts.filter(c => c.status === 'NEW').length} Non lus
        </div>
      </div>

      {/* Grille des Messages */}
      {contacts.length === 0 ? (
        <div className="text-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl">
            <p className="text-nexus-concrete">Aucun message pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => {
                const isNew = contact.status === 'NEW';

                return (
                    <div 
                        key={contact.id} 
                        onClick={() => setSelectedContact(contact)}
                        // AJOUT DE 'opacity-0' ici pour éviter le flash avant animation
                        className={`msg-card opacity-0 p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between h-[280px] ${
                            isNew 
                            ? 'bg-nexus-dark border-nexus-orange/50 shadow-[0_0_20px_rgba(255,107,0,0.05)] hover:shadow-nexus-orange/20' 
                            : 'bg-nexus-black border-nexus-gray hover:border-nexus-concrete hover:bg-nexus-dark/50'
                        }`}
                    >
                        {/* Indicateur Statut */}
                        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider ${
                            isNew ? 'bg-nexus-orange text-black' : 'bg-nexus-gray text-nexus-concrete'
                        }`}>
                            {isNew ? 'NOUVEAU' : 'TRAITÉ'}
                        </div>

                        <div>
                            {/* Icone Sujet */}
                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${
                                    contact.subject === 'RECLAMATION' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    contact.subject === 'RENDEZ_VOUS' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                    'bg-nexus-gray/20 text-nexus-concrete border border-nexus-gray'
                                }`}>
                                    {contact.subject === 'RECLAMATION' ? <AlertCircle size={20}/> : 
                                     contact.subject === 'RENDEZ_VOUS' ? <Calendar size={20}/> : <MessageSquare size={20}/>}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className={`font-bold text-sm truncate ${isNew ? 'text-nexus-text' : 'text-nexus-text/80'}`}>
                                        {contact.firstName} {contact.lastName}
                                    </h3>
                                    <p className="text-xs text-nexus-concrete flex items-center gap-1">
                                        <Clock size={10}/> {new Date(contact.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Extrait Message */}
                            <p className={`text-sm line-clamp-3 leading-relaxed mb-4 ${isNew ? 'text-nexus-text' : 'text-nexus-concrete'}`}>
                                {contact.message}
                            </p>
                        </div>

                        {/* Footer Carte */}
                        <div className={`flex justify-between items-center pt-4 border-t ${isNew ? 'border-nexus-gray/50' : 'border-nexus-gray/30'}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isNew ? 'text-nexus-text' : 'text-nexus-concrete/70'}`}>
                                {contact.subject}
                            </span>
                            <span className={`text-xs font-bold flex items-center gap-1 ${isNew ? 'text-nexus-orange' : 'text-nexus-concrete group-hover:text-nexus-text transition-colors'}`}>
                                Voir détails <ExternalLink size={12}/>
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      {/* POPUP DÉTAILS */}
      {selectedContact && (
        <ContactDetailsModal 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)} 
            onMarkRead={() => {
                const updatedList = contacts.map(c => 
                    c.id === selectedContact.id ? { ...c, status: 'READ' } : c
                );
                setContacts(updatedList);
                adminService.markContactAsRead(selectedContact.id);
                setSelectedContact(null);
            }}
        />
      )}

    </div>
  );
}

// ... (La fonction ContactDetailsModal reste identique à la version précédente, elle est parfaite)
function ContactDetailsModal({ contact, onClose, onMarkRead }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-2xl rounded-3xl p-0 relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="h-32 bg-gradient-to-r from-nexus-orange via-yellow-600 to-nexus-dark relative p-8 flex items-end">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm">
                        <X size={24}/>
                    </button>
                    <div>
                        <span className="bg-black/40 text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md">
                            {contact.subject}
                        </span>
                        <h2 className="text-3xl font-black text-white mt-2 drop-shadow-md">
                            {contact.firstName} {contact.lastName}
                        </h2>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <a href={`mailto:${contact.email}`} className="bg-nexus-black p-4 rounded-xl border border-nexus-gray flex items-center gap-3 hover:border-nexus-orange transition-colors group">
                            <div className="p-2 bg-nexus-dark rounded-lg text-nexus-concrete group-hover:text-white"><Mail size={20}/></div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-nexus-concrete uppercase font-bold">Email</p>
                                <p className="text-nexus-text text-sm truncate">{contact.email}</p>
                            </div>
                        </a>
                        <a href={`tel:${contact.phone}`} className="bg-nexus-black p-4 rounded-xl border border-nexus-gray flex items-center gap-3 hover:border-nexus-orange transition-colors group">
                            <div className="p-2 bg-nexus-dark rounded-lg text-nexus-concrete group-hover:text-white"><Phone size={20}/></div>
                            <div>
                                <p className="text-xs text-nexus-concrete uppercase font-bold">Téléphone</p>
                                <p className="text-nexus-text text-sm">{contact.phone}</p>
                            </div>
                        </a>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-nexus-concrete text-xs font-bold uppercase mb-3 flex items-center gap-2">
                            <MessageSquare size={14}/> Message complet
                        </h3>
                        <div className="bg-nexus-black p-6 rounded-2xl border border-nexus-gray text-nexus-text leading-relaxed whitespace-pre-wrap">
                            {contact.message}
                        </div>
                        <p className="text-right text-xs text-nexus-concrete mt-2">
                            Envoyé le {new Date(contact.createdAt).toLocaleDateString()} à {new Date(contact.createdAt).toLocaleTimeString()}
                        </p>
                    </div>

                    {(contact.latitude && contact.longitude) ? (
                        <div className="mb-8">
                            <h3 className="text-nexus-concrete text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                <MapPin size={14}/> Localisation GPS
                            </h3>
                            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="text-blue-200 text-sm font-mono">{contact.latitude}, {contact.longitude}</p>
                                    <p className="text-nexus-concrete text-xs mt-1">{contact.location}</p>
                                </div>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${contact.latitude},${contact.longitude}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors"
                                >
                                    Voir sur Maps <ExternalLink size={16}/>
                                </a>
                            </div>
                        </div>
                    ) : (
                        contact.location && (
                            <div className="mb-8">
                                <h3 className="text-nexus-concrete text-xs font-bold uppercase mb-3">Adresse saisie</h3>
                                <p className="text-nexus-text bg-nexus-black p-3 rounded-lg border border-nexus-gray inline-block">
                                    <MapPin size={14} className="inline mr-2 text-nexus-orange"/> {contact.location}
                                </p>
                            </div>
                        )
                    )}

                    {contact.status === 'NEW' && (
                        <div className="mt-4 pt-6 border-t border-nexus-gray flex justify-end">
                            <button 
                                onClick={onMarkRead}
                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-green-900/20"
                            >
                                <CheckCircle2 size={20}/> Marquer comme Traité
                            </button>
                        </div>
                    )}
                    {contact.status === 'READ' && (
                         <div className="mt-4 pt-6 border-t border-nexus-gray flex justify-end text-green-500 font-bold items-center gap-2">
                            <CheckCircle2 size={20}/> Déjà traité / Vu
                         </div>
                    )}

                </div>
            </div>
        </div>
    );
}