// components/ParentAssistant.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Bot, X, BellRing, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

// Fonction utilitaire pour décoder le token
const getUserRole = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1])).role;
    } catch { return null; }
};

const ParentAssistant = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [hasAlert, setHasAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        const fetchInsight = async () => {
            const token = Cookies.get('token');
            // On vérifie le rôle ici aussi pour ne pas faire de requête inutile
            if (!token || getUserRole(token) !== 'PARENT') return;

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/parent-assistant/insight`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMessage(res.data.message);
                
                if (res.data.active) {
                    setHasAlert(true);
                    // On ouvre automatiquement si c'est une alerte importante
                    setIsOpen(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (isMounted) fetchInsight();
    }, [isMounted]);

    // --- LOGIQUE D'AFFICHAGE ---
    const publicPages = ['/', '/login', '/register', '/inscription', '/mot-de-passe-oublie'];
    
    // 1. Vérifications de base
    if (!isMounted || publicPages.includes(pathname)) return null;
    
    // 2. Vérification Token et Rôle
    const token = Cookies.get('token');
    if (!token || getUserRole(token) !== 'PARENT') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* FENÊTRE DU MESSAGE */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className={`p-4 text-white flex justify-between items-center ${hasAlert ? 'bg-amber-600' : 'bg-blue-600'}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                {hasAlert ? <BellRing size={20} /> : <ShieldCheck size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-md">Assistant Parental</h3>
                                <p className="text-xs text-white/90">
                                    {hasAlert ? "Point de vigilance" : "Tout va bien"}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
                    </div>

                    {/* CORPS DU MESSAGE AVEC SCROLL (C'est ici la correction) */}
                    <div className="h-80 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {message || "Chargement des informations..."}
                    </div>

                    {/* Footer */}
                    {hasAlert && (
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center">
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-blue-600 text-xs font-bold uppercase tracking-wide hover:underline"
                            >
                                J'ai bien reçu l'information
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* BOUTON FLOTTANT */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center ${
                    hasAlert && !isOpen 
                        ? "bg-amber-500 animate-pulse text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
                
                {/* Badge de notification */}
                {hasAlert && !isOpen && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>
    );
};

export default ParentAssistant;