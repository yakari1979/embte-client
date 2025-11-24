// components/CoachingChat.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Send, Bot, X, ExternalLink, PlayCircle, FileText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Resource {
    id: string;
    title: string;
    type: string;
}

interface Message {
    sender: 'PENI' | 'YOU';
    text: string;
    resources?: Resource[];
}

// --- FONCTION UTILITAIRE POUR DÉCODER LE TOKEN (Sans installer de librairie) ---
const getUserRoleFromToken = (token: string): string | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        return payload.role; // On récupère le rôle (STUDENT, TEACHER, etc.)
    } catch (e) {
        return null;
    }
};

const CoachingChat = () => {
    const pathname = usePathname();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeScenario, setActiveScenario] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const checkCoachingStatus = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        // Vérification supplémentaire de sécurité
        const role = getUserRoleFromToken(token);
        if (role !== 'STUDENT') return; 

        try {
            const res = await axios.get(`${API_URL}/coaching/current-session`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.active) {
                setActiveScenario(true);
                setSessionId(res.data.sessionId);
                setMessages(res.data.messages);
                
                if (res.data.finished) {
                    setFinished(true);
                } else {
                    setIsOpen(true);
                }
            } else {
                setActiveScenario(false);
                setMessages([{
                    sender: 'PENI',
                    text: "Salut ! Je n'ai détecté aucune note critique récente. Continue tes efforts ! 🚀"
                }]);
            }
        } catch (error) {
            console.error("Erreur chargement coaching", error);
        }
    };

    useEffect(() => {
        const publicPages = ['/', '/login', '/register', '/inscription', '/mot-de-passe-oublie'];
        const token = Cookies.get('token');
        
        // On vérifie le rôle AVANT de lancer la requête
        const role = token ? getUserRoleFromToken(token) : null;

        if (isMounted && token && role === 'STUDENT' && !publicPages.includes(pathname)) {
            checkCoachingStatus();
        }
    }, [isMounted, pathname]);

    useEffect(() => {
        if (isOpen) scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !activeScenario || finished) return;

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
                setMessages(prev => [
                    ...prev, 
                    { 
                        sender: 'PENI', 
                        text: res.data.aiAdvice,
                        resources: res.data.resources 
                    }
                ]);
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

    // --- LOGIQUE D'AFFICHAGE ---
    const publicPages = ['/', '/login', '/register', '/inscription', '/mot-de-passe-oublie'];
    
    // 1. Vérifications de base (Montage + Page publique)
    if (!isMounted || publicPages.includes(pathname)) return null;
    
    // 2. Vérification du Token
    const token = Cookies.get('token');
    if (!token) return null;

    // 3. VÉRIFICATION DU RÔLE (La nouveauté)
    // Si l'utilisateur n'est pas un étudiant, on cache le composant
    const role = getUserRoleFromToken(token);
    if (role !== 'STUDENT') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full"><Bot size={20} /></div>
                            <div>
                                <h3 className="font-bold text-md">Coach PENI</h3>
                                <p className="text-xs text-blue-100">
                                    {finished ? "Session terminée" : (activeScenario ? "Analyse en cours..." : "En veille")}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'YOU' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'YOU' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
                                }`}>
                                    <p>{msg.text}</p>
                                </div>

                                {msg.resources && msg.resources.length > 0 && (
                                    <div className="mt-2 space-y-2 w-[90%]">
                                        <p className="text-xs text-gray-500 ml-1 font-medium">Ressources recommandées :</p>
                                        {msg.resources.map(res => (
                                            <button
                                                key={res.id}
                                                onClick={() => router.push(`/library/${res.id}`)} 
                                                className="flex items-center gap-3 w-full p-2 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left group"
                                            >
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-md group-hover:scale-110 transition-transform">
                                                    {res.type === 'VIDEO' ? <PlayCircle size={16}/> : <FileText size={16}/>}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 line-clamp-1 flex-1">
                                                    {res.title}
                                                </span>
                                                <ExternalLink size={12} className="text-gray-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center text-gray-500 text-xs border-t border-gray-100">
                            {finished ? "Discussion archivée. Tu peux la relire à tout moment." : "Aucune action requise."}
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center ${
                    activeScenario && !finished && !isOpen 
                        ? "bg-red-500 animate-pulse text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
                {activeScenario && !finished && !isOpen && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-yellow-400 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>
    );
};

export default CoachingChat;