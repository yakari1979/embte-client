// components/CoachingChat.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Send, Bot, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Message {
    sender: 'PENI' | 'YOU';
    text: string;
}

const CoachingChat = () => {
    // --- 1. DÉCLARATION DE TOUS LES HOOKS EN PREMIER (OBLIGATOIRE) ---
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // States
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeScenario, setActiveScenario] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);

    // Effect pour l'hydratation
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fonction de vérification (définie ici pour être utilisée dans le useEffect)
    const checkCoachingStatus = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await axios.get(`${API_URL}/coaching/current-session`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.active) {
                setActiveScenario(true);
                setSessionId(res.data.sessionId);
                setMessages(res.data.messages);
                if (!finished) setIsOpen(true); 
            } else {
                setActiveScenario(false);
                setMessages([{
                    sender: 'PENI',
                    text: "Salut ! Je n'ai détecté aucune note critique récemment. Continue tes efforts, je reste en veille ! 🚀"
                }]);
            }
        } catch (error) {
            console.error("Erreur chargement coaching", error);
        }
    };

    // Effect pour charger les données
    // On ajoute une sécurité : ne pas charger si on est sur une page publique
    useEffect(() => {
        const publicPages = ['/', '/login', '/register', '/inscription', '/mot-de-passe-oublie'];
        const token = Cookies.get('token');
        
        if (isMounted && token && !publicPages.includes(pathname)) {
            checkCoachingStatus();
        }
    }, [isMounted, pathname]); // Se relance si on change de page

    // Effect pour le scroll
    useEffect(() => {
        if (isOpen) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!activeScenario) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'YOU', text: userMsg }]);
        setLoading(true);

        const token = Cookies.get('token');

        try {
            const res = await axios.post(`${API_URL}/coaching/reply`, {
                sessionId,
                response: userMsg
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.finished) {
                setMessages(prev => [...prev, { sender: 'PENI', text: res.data.aiAdvice }]);
                setFinished(true);
            } else {
                const refresh = await axios.get(`${API_URL}/coaching/current-session`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(refresh.data.messages);
            }

        } catch (error) {
            console.error("Erreur envoi", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. LOGIQUE D'AFFICHAGE CONDITIONNEL (À LA FIN SEULEMENT) ---
    const publicPages = ['/', '/login', '/register', '/inscription', '/mot-de-passe-oublie'];
    
    // Si pas monté, ou page publique, ou pas de token -> ON NE REND RIEN
    if (!isMounted || publicPages.includes(pathname)) {
        return null;
    }
    
    // On vérifie le token ici aussi pour l'affichage (au cas où)
    const token = Cookies.get('token');
    if (!token) return null;

    // --- 3. RENDU DU COMPOSANT ---
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-md">Coach PENI</h3>
                                <p className="text-xs text-blue-100">
                                    {activeScenario ? "Analyse en cours..." : "En veille"}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'YOU' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'YOU' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    {activeScenario && !finished ? (
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Écris ta réponse..."
                                className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center text-gray-500 text-xs">
                            {finished ? "Session terminée." : "Aucune action requise."}
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center ${
                    activeScenario && !isOpen 
                        ? "bg-red-500 animate-pulse text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
                {activeScenario && !isOpen && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-yellow-400 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>
    );
};

export default CoachingChat;