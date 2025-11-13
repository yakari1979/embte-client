"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Peer, { MediaConnection } from 'peerjs';
import { Send, UserCircle, Power, MicOff, Video, Loader2, MessageSquare, Users as UsersIcon, Paperclip, Link as LinkIcon, ShieldCheck, Mic, VideoOff, PhoneOff, Hand, CheckCircle, XCircle } from 'lucide-react';

import { getSessionStatus, getSessionMessages, getSessionResources, addSessionResource, toggleLiveStatus, toggleChatStatus } from '@/services/api';

// --- TYPES ---
interface ChatMessage { author: string; message: string; authorRole: 'TEACHER' | 'STUDENT'; }
interface Participant { id: string; firstName: string; lastName: string; role: 'TEACHER' | 'STUDENT'; }
interface UserPayload extends Participant { userId: string; }
interface Resource { id: string; name: string; url: string; }
type SidebarTab = 'chat' | 'participants' | 'resources' | null;
interface RoomState {
    participants: Record<string, Participant>;
    activeSpeakers: string[];
    handRaises: string[];
}



// --- MODIFICATION : AJOUT DE PROPS AU VideoPlayer ---
const VideoPlayer: React.FC<{ 
    stream: MediaStream; 
    username: string; 
    isMuted?: boolean; 
    isTeacherView?: boolean;
    isStudentVideo?: boolean;
    onStopInterrogation?: () => void;
}> = ({ stream, username, isMuted, isTeacherView, isStudentVideo, onStopInterrogation }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
    }, [stream]);

    return (
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
            <video ref={videoRef} autoPlay playsInline muted={isMuted} className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm font-semibold">{username}</p>
            {/* AJOUT : Le bouton pour arrêter l'interrogation */}
            {isTeacherView && isStudentVideo && (
                <button 
                    onClick={onStopInterrogation} 
                    className="absolute top-2 right-2 p-2 bg-red-600/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Arrêter l'interrogation"
                >
                    <XCircle size={20} />
                </button>
            )}
        </div>
    );
};


const ParticipantAvatar: React.FC<{ user: Participant; isHandRaised: boolean; onInterrogate: () => void; isTeacherView: boolean; }> = 
({ user, isHandRaised, onInterrogate, isTeacherView }) => {
    if (!user || !user.firstName || !user.lastName) {
        return null;
    }
    return (
        <div className="flex flex-col items-center text-center w-20 flex-shrink-0">
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-gray-700 border-2 ${isHandRaised ? 'border-yellow-400' : 'border-gray-600'}`}>
                <span className="font-bold text-xl">{user.firstName[0]}{user.lastName[0]}</span>
                {isHandRaised && <div className="absolute -top-1 -right-1 bg-yellow-400 p-1.5 rounded-full shadow-md"><Hand size={14} className="text-black"/></div>}
            </div>
            <p className="text-xs mt-1 truncate w-full">{user.firstName} {user.lastName}</p>
            {isTeacherView && isHandRaised && <button onClick={onInterrogate} className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded mt-1">Interroger</button>}
        </div>
    );
};

const InterrogationPrompt: React.FC<{ onAccept: () => void; onDecline: () => void }> = ({ onAccept, onDecline }) => (
    <div className="absolute top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-20 animate-pulse w-72">
        <p className="font-bold">Le professeur vous interroge.</p>
        <p className="text-sm mb-3">Voulez-vous activer votre caméra et micro ?</p>
        <div className="flex gap-3"><button onClick={onAccept} className="flex-1 bg-green-500 hover:bg-green-600 p-2 rounded-md flex items-center justify-center gap-2"><CheckCircle size={16}/> Accepter</button><button onClick={onDecline} className="flex-1 bg-red-500 hover:bg-red-600 p-2 rounded-md flex items-center justify-center gap-2"><XCircle size={16}/> Refuser</button></div>
    </div>
);

const CallControls: React.FC<{ isMuted: boolean; isVideoOff: boolean; onToggleMute: () => void; onToggleVideo: () => void; onLeaveCall: () => void; onRaiseHand: () => void; isStudent: boolean; }> = 
({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onLeaveCall, onRaiseHand, isStudent }) => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/70 backdrop-blur-sm p-3 rounded-xl flex items-center gap-4 z-10">
        <button onClick={onToggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white`} title={isMuted ? "Activer micro" : "Couper micro"}>{isMuted ? <MicOff size={20} /> : <Mic size={20} />}</button>
        <button onClick={onToggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} text-white`} title={isVideoOff ? "Activer caméra" : "Couper caméra"}>{isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}</button>
        {isStudent && <button onClick={onRaiseHand} className="p-3 rounded-full bg-yellow-500 text-white" title="Lever la main"><Hand size={20} /></button>}
        <button onClick={onLeaveCall} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700" title="Quitter l'appel"><PhoneOff size={20} /></button>
    </div>
);

const ResourcesSection: React.FC<{ resources: Resource[]; sessionId: string; isTeacher: boolean; onNewResource: (newResource: Resource) => void; }> = 
({ resources, sessionId, isTeacher, onNewResource }) => {
    const [name, setName] = useState(''); const [file, setFile] = useState<File | null>(null); const [isAdding, setIsAdding] = useState(false); const [submitting, setSubmitting] = useState(false); const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); };
    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault(); const token = Cookies.get('token'); if (!name.trim() || !file || !token) return; setSubmitting(true);
        try { const response = await addSessionResource(sessionId, { name, file }, token); onNewResource(response.data); setName(''); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; setIsAdding(false);
        } catch (error) { alert("Erreur lors de l'envoi de la ressource."); console.error(error); } finally { setSubmitting(false); }
    };
    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            {isTeacher && (<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">{!isAdding ? ( <button onClick={() => setIsAdding(true)} className="btn-secondary w-full">Ajouter une ressource</button> ) : (<form onSubmit={handleAddResource} className="space-y-2"><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom du fichier" className="input-field" required /><input type="file" ref={fileInputRef} onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required /><div className="flex gap-2 mt-2"><button type="button" onClick={() => setIsAdding(false)} className="btn-secondary w-full">Annuler</button><button type="submit" className="btn-primary w-full" disabled={submitting}>{submitting ? 'Envoi...' : 'Ajouter'}</button></div></form>)}</div>)}
            <ul className="p-4 space-y-3 overflow-y-auto flex-grow">{resources.length > 0 ? resources.map(r => (<li key={r.id}><a href={r.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-background rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><p className="font-semibold text-blue-500 flex items-center gap-2"><LinkIcon size={16}/> {r.name}</p><p className="text-xs text-text-subtle truncate mt-1">{r.url}</p></a></li>)) : <p className="text-center text-text-subtle italic pt-8">Aucune ressource partagée.</p>}</ul>
        </div>
    );
};

const ChatSection: React.FC<{ messages: ChatMessage[]; currentMessage: string; setCurrentMessage: (msg: string) => void; handleSendMessage: (e: React.FormEvent) => void; isChatEnabled: boolean; userFullName: string; }> = 
({ messages, currentMessage, setCurrentMessage, handleSendMessage, isChatEnabled, userFullName }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="flex-grow p-4 overflow-y-auto"><div className="space-y-4">{messages.map((msg, index) => {
                const isTeacherMsg = msg.authorRole === 'TEACHER'; const isMyMsg = msg.author === userFullName;
                return (<div key={index} className={`flex items-start gap-3 ${isMyMsg ? 'justify-end' : ''}`}>{!isMyMsg && (isTeacherMsg ? <ShieldCheck className="h-8 w-8 text-green-500 shrink-0 mt-1" /> : <UserCircle className="h-8 w-8 text-text-subtle shrink-0 mt-1" />)}<div className={`p-3 rounded-lg max-w-xs ${isMyMsg ? 'bg-blue-600 text-white' : isTeacherMsg ? 'bg-green-100 dark:bg-green-900' : 'bg-background'}`}><p className={`font-bold text-xs ${isTeacherMsg ? 'text-green-600 dark:text-green-400' : ''}`}>{msg.author}</p><p className="break-words text-sm">{msg.message}</p></div></div>)
            })}<div ref={messagesEndRef} /></div></div>
            <div className="p-4 bg-background border-t border-gray-200 dark:border-gray-700 flex-shrink-0"><form onSubmit={handleSendMessage} className="flex gap-2"><input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder={isChatEnabled ? "Votre message..." : "Chat désactivé"} className="input-field" disabled={!isChatEnabled} /><button type="submit" className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50" disabled={!isChatEnabled || !currentMessage.trim()}><Send/></button></form></div>
        </div>
    );
};


// =======================================================
//   COMPOSANT PRINCIPAL DE LA PAGE
// =======================================================
const ClassSessionPage = () => {
    // États généraux
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<SidebarTab>('chat');

    // États de la session
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLive, setIsLive] = useState(false);
    const [isChatEnabled, setIsChatEnabled] = useState(true);
    
    // États de la visioconférence
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [streams, setStreams] = useState<Record<string, MediaStream>>({});
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [interrogationRequest, setInterrogationRequest] = useState(false);
    
    const router = useRouter();
    const pathname = usePathname();
    const sessionId = pathname.split('/').pop() || '';
    const callsRef = useRef<Record<string, MediaConnection>>({});



    // // --- EFFET 1 : Initialisation Générale et Socket.IO ---
    // useEffect(() => {
    //     let isMounted = true;
    //     const token = Cookies.get('token');
    //     if (!token) { router.push('/login'); return; }

    //     const decoded = jwtDecode<UserPayload>(token);
    //     decoded.id = decoded.userId;
    //     setCurrentUser(decoded);

    //     // --- DÉBUT DE LA CORRECTION ---
    //     // 1. On récupère l'URL de base de l'API.
    //     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    //     // 2. On crée l'URL pour le socket en retirant le chemin '/api'.
    //     //    'new URL(apiUrl)' crée un objet URL.
    //     //    '.origin' retourne la partie principale (ex: "https://peni-backend-node.onrender.com").
    //     //    Le fallback est pour le cas où l'URL est malformée.
    //     const socketUrl = new URL(apiUrl).origin || "http://localhost:3001";

    //     // 3. On initialise le socket avec l'URL de base correcte.
    //     const newSocket = io(socketUrl, {
    //         transports: ['websocket', 'polling']
    //     });
    //     // --- FIN DE LA CORRECTION ---

    //     setSocket(newSocket);
        
    //     const initializeSession = async () => {
    //         try {
    //             const [statusRes, messagesRes, resourcesRes] = await Promise.all([getSessionStatus(sessionId, token), getSessionMessages(sessionId, token), getSessionResources(sessionId, token)]);
    //             if (isMounted) {
    //                 setIsLive(statusRes.data.isLive);
    //                 setIsChatEnabled(statusRes.data.isChatEnabled);
    //                 setMessages(messagesRes.data);
    //                 setResources(resourcesRes.data);
    //                 newSocket.emit('join_class_chat', { classId: sessionId });
    //             }
    //         } catch (err) {
    //             if (isMounted) setError("Impossible de charger les données de la session.");
    //         } finally {
    //             if (isMounted) setIsLoading(false);
    //         }
    //     };
    //     initializeSession();

    //     newSocket.on('session_status_updated', ({ type, status }) => { if (type === 'live') setIsLive(status); if (type === 'chat') setIsChatEnabled(status); });
    //     newSocket.on('receive_message', (data: ChatMessage) => setMessages(prev => [...prev, data]));
    //     newSocket.on('receive_new_resource', (newResource: Resource) => setResources(prev => [...prev, newResource]));
    //     newSocket.on('room_state_update', (state: RoomState) => setRoomState(state));
    //     newSocket.on('you_are_interrogated', () => setInterrogationRequest(true));

    //     return () => {
    //         isMounted = false; newSocket.disconnect(); Object.values(callsRef.current).forEach(call => call.close());
    //         myStream?.getTracks().forEach(track => track.stop()); peer?.destroy();
    //     };
    // }, [sessionId, router]);

    // // --- EFFET 2 : Démarrage Média et PeerJS (VERSION CORRIGÉE) ---
    // useEffect(() => {
    //     if (!socket || !currentUser) return;
        
    //     let localStream: MediaStream; 
    //     let localPeer: Peer;

    //     const startMediaAndPeer = async () => {
    //         try {
    //             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //             const isTeacher = currentUser.role === 'TEACHER';
    //             localStream.getVideoTracks().forEach(t => t.enabled = isTeacher);
    //             localStream.getAudioTracks().forEach(t => t.enabled = isTeacher);
    //             setIsVideoOff(!isTeacher); 
    //             setIsMuted(!isTeacher);
    //             setMyStream(localStream);

    //             // --- DÉBUT DE LA CORRECTION ---
    //             // 1. On récupère l'URL de l'API et on la parse
    //             const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    //             const url = new URL(apiUrl);

    //             // 2. On prépare la configuration de PeerJS en fonction de l'environnement
    //             let peerConfig;
    //             if (url.protocol === 'https:') {
    //                 // Configuration pour la PRODUCTION (Render)
    //                 peerConfig = {
    //                     host: url.hostname, // ex: 'peni-backend-node.onrender.com'
    //                     port: 443,          // Port standard pour HTTPS/WSS
    //                     path: '/peerjs/myapp',
    //                     secure: true        // Très important pour WSS
    //                 };
    //             } else {
    //                 // Configuration pour le DÉVELOPPEMENT (Local)
    //                 peerConfig = {
    //                     host: 'localhost',
    //                     port: 3001,
    //                     path: '/peerjs/myapp'
    //                 };
    //             }

    //             // 3. On initialise PeerJS avec la configuration dynamique
    //             localPeer = new Peer(currentUser.id, peerConfig);
    //             // --- FIN DE LA CORRECTION ---

    //             setPeer(localPeer);

    //             localPeer.on('open', () => socket.emit('join_class_video', { classId: sessionId, user: currentUser }));
                
    //             localPeer.on('call', (call) => {
    //                 call.answer(localStream);
    //                 call.on('stream', (remoteStream) => setStreams(prev => ({ ...prev, [call.peer]: remoteStream })));
    //                 callsRef.current[call.peer] = call;
    //             });

    //         } catch (err) { 
    //             setError("Accès à la caméra/micro refusé ou impossible."); 
    //         }
    //     };

    //     startMediaAndPeer();
        
    //     return () => { 
    //         localStream?.getTracks().forEach(track => track.stop()); 
    //         localPeer?.destroy(); 
    //     }
    // }, [socket, currentUser, sessionId]); // Les dépendances ne changent pas


     // --- EFFET 1 : Initialisation Générale et Socket.IO (VERSION CORRIGÉE) ---
     useEffect(() => {
        let isMounted = true;
        const token = Cookies.get('token');
        if (!token) { router.push('/login'); return; }

        const decoded = jwtDecode<UserPayload>(token);
        decoded.id = decoded.userId;
        setCurrentUser(decoded);

        // --- DÉBUT DE LA CORRECTION ---
        // 1. On récupère l'URL de base de l'API depuis les variables d'environnement.
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        // 2. On crée l'URL pour le socket en retirant le chemin '/api' ou tout autre chemin.
        //    'new URL(apiUrl).origin' retourne la partie principale (ex: "https://votre-backend.onrender.com").
        //    C'est la méthode la plus fiable pour obtenir le domaine de base.
        const socketUrl = new URL(apiUrl).origin;
        
        console.log("Connexion au serveur de socket sur l'URL :", socketUrl);

        // 3. On initialise le socket avec l'URL de base correcte et on spécifie les transports.
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'] // Important pour la compatibilité sur Render
        });
        // --- FIN DE LA CORRECTION ---

        setSocket(newSocket);
        
        const initializeSession = async () => {
            try {
                // Le reste de votre logique d'initialisation reste inchangé
                const [statusRes, messagesRes, resourcesRes] = await Promise.all([getSessionStatus(sessionId, token), getSessionMessages(sessionId, token), getSessionResources(sessionId, token)]);
                if (isMounted) {
                    setIsLive(statusRes.data.isLive);
                    setIsChatEnabled(statusRes.data.isChatEnabled);
                    setMessages(messagesRes.data);
                    setResources(resourcesRes.data);
                    newSocket.emit('join_class_chat', { classId: sessionId });
                }
            } catch (err) {
                if (isMounted) setError("Impossible de charger les données de la session. Vérifiez la connexion.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        initializeSession();

        // Le reste de votre useEffect est bon
        newSocket.on('connect', () => {
            console.log("Socket.IO connecté avec succès ! ID:", newSocket.id);
        });
        newSocket.on('connect_error', (err) => {
            console.error("Erreur de connexion Socket.IO:", err.message);
            setError("La connexion temps-réel a échoué.");
        });

        newSocket.on('session_status_updated', ({ type, status }) => { if (type === 'live') setIsLive(status); if (type === 'chat') setIsChatEnabled(status); });
        newSocket.on('receive_message', (data: ChatMessage) => setMessages(prev => [...prev, data]));
        newSocket.on('receive_new_resource', (newResource: Resource) => setResources(prev => [...prev, newResource]));
        newSocket.on('room_state_update', (state: RoomState) => setRoomState(state));
        newSocket.on('you_are_interrogated', () => setInterrogationRequest(true));

        return () => {
            isMounted = false; newSocket.disconnect(); Object.values(callsRef.current).forEach(call => call.close());
            myStream?.getTracks().forEach(track => track.stop()); peer?.destroy();
        };
    }, [sessionId, router]); // sessionId et router sont des dépendances stables


    // --- EFFET 2 : Démarrage Média et PeerJS (VERSION CORRIGÉE) ---
    useEffect(() => {
        if (!socket || !currentUser) return;
        
        let localStream: MediaStream; 
        let localPeer: Peer;

        const startMediaAndPeer = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const isTeacher = currentUser.role === 'TEACHER';
                localStream.getVideoTracks().forEach(t => t.enabled = isTeacher);
                localStream.getAudioTracks().forEach(t => t.enabled = isTeacher);
                setIsVideoOff(!isTeacher); 
                setIsMuted(!isTeacher);
                setMyStream(localStream);

                // --- DÉBUT DE LA CORRECTION ---
                // 1. On récupère l'URL de l'API et on la parse
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const url = new URL(apiUrl);

                // 2. On prépare la configuration de PeerJS en fonction de l'environnement
                let peerConfig;
                // Si l'URL est en HTTPS (cas de la production sur Render)
                if (url.protocol === 'https:') {
                    peerConfig = {
                        host: url.hostname, // ex: 'peni-backend-node.onrender.com'
                        port: 443,          // Port standard pour HTTPS/WSS
                        path: '/peerjs/myapp',
                        secure: true        // Très important pour activer WSS
                    };
                } else {
                    // Configuration pour le DÉVELOPPEMENT (Local)
                    peerConfig = {
                        host: 'localhost',
                        port: 3001,
                        path: '/peerjs/myapp'
                    };
                }
                console.log("Configuration de PeerJS :", peerConfig);

                // 3. On initialise PeerJS avec la configuration dynamique
                localPeer = new Peer(currentUser.id, peerConfig);
                // --- FIN DE LA CORRECTION ---

                setPeer(localPeer);

                localPeer.on('open', (id) => {
                    console.log("PeerJS connecté avec l'ID:", id);
                    socket.emit('join_class_video', { classId: sessionId, user: currentUser });
                });

                localPeer.on('error', (err) => {
                    console.error("Erreur PeerJS:", err);
                    setError("La connexion vidéo a échoué.");
                });
                
                localPeer.on('call', (call) => {
                    call.answer(localStream);
                    call.on('stream', (remoteStream) => setStreams(prev => ({ ...prev, [call.peer]: remoteStream })));
                    callsRef.current[call.peer] = call;
                });

            } catch (err) { 
                setError("Accès à la caméra/micro refusé ou impossible."); 
            }
        };

        startMediaAndPeer();
        
        return () => { 
            localStream?.getTracks().forEach(track => track.stop()); 
            localPeer?.destroy(); 
        }
    }, [socket, currentUser, sessionId]); // Les dépendances ne changent pas

    // --- EFFET 3 : Gestion des appels sortants ---
    useEffect(() => {
        if (!peer || !myStream || !roomState || !currentUser) return;
        Object.keys(roomState.participants).forEach(peerId => {
            if (peerId !== currentUser.id && !callsRef.current[peerId]) {
                const call = peer.call(peerId, myStream);
                if (call) {
                    callsRef.current[peerId] = call;
                    call.on('stream', (remoteStream) => setStreams(prev => ({ ...prev, [peerId]: remoteStream })));
                    call.on('close', () => {
                        delete callsRef.current[peerId];
                        setStreams(prev => { const newStreams = { ...prev }; delete newStreams[peerId]; return newStreams; });
                    });
                }
            }
        });
        Object.keys(callsRef.current).forEach(callId => {
            if (!roomState.participants[callId]) { callsRef.current[callId].close(); delete callsRef.current[callId]; }
        });
    }, [roomState, peer, myStream, currentUser]);


    // --- NOUVEL EFFET : Réactivité de l'élève ---
    useEffect(() => {
        // Cet effet garantit que l'élève désactive sa caméra/micro s'il n'est plus un "activeSpeaker"
        if (myStream && currentUser?.role === 'STUDENT' && roomState) {
            const amIAnActiveSpeaker = roomState.activeSpeakers.includes(currentUser.id);
            if (!amIAnActiveSpeaker) {
                myStream.getAudioTracks().forEach(t => { if (t.enabled) { t.enabled = false; setIsMuted(true); } });
                myStream.getVideoTracks().forEach(t => { if (t.enabled) { t.enabled = false; setIsVideoOff(true); } });
            }
        }
    }, [roomState, myStream, currentUser]);
    
    // --- Fonctions de gestion (handlers) ---
    const handleSendMessage = (e: React.FormEvent) => { e.preventDefault(); if (currentMessage.trim() && socket && currentUser) { const msgData = { classId: sessionId, message: currentMessage, author: `${currentUser.firstName} ${currentUser.lastName}`, authorId: currentUser.id, authorRole: currentUser.role }; socket.emit('send_message', msgData); setMessages(p => [...p, msgData]); setCurrentMessage(''); } };
    const handleNewResource = (newResource: Resource) => { setResources(p => [...p, newResource]); socket?.emit('new_resource_added', { classId: sessionId, resource: newResource }); };
    const handleToggleLive = async () => { const token = Cookies.get('token'); if (!token || !socket) return; try { const res = await toggleLiveStatus(sessionId, token); socket.emit('session_status_change', { classId: sessionId, type: 'live', status: res.data.isLive }); } catch (err) { console.error(err); } };
    const handleToggleChat = async () => { const token = Cookies.get('token'); if (!token || !socket) return; try { const res = await toggleChatStatus(sessionId, token); socket.emit('session_status_change', { classId: sessionId, type: 'chat', status: res.data.isChatEnabled }); } catch (err) { console.error(err); } };
    const leaveCall = () => { router.push('/dashboard'); };
    const toggleMute = () => myStream?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; setIsMuted(!t.enabled); });
    const toggleVideo = () => myStream?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); });
    const handleRaiseHand = () => socket?.emit('raise_hand');
    const handleAcceptInterrogation = () => {
        setInterrogationRequest(false);
        myStream?.getAudioTracks().forEach(t => t.enabled = true); myStream?.getVideoTracks().forEach(t => t.enabled = true);
        setIsMuted(false); setIsVideoOff(false);
        socket?.emit('accept_interrogation');
    };
    const handleInterrogate = (studentId: string) => socket?.emit('interrogate_student', studentId);
    // --- AJOUT DE LA NOUVELLE FONCTION ---
    const handleStopInterrogation = (studentId: string) => {
        socket?.emit('stop_interrogation', studentId);
    };

    // --- Logique de rendu ---
    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10" /></div>;
    if (error) return <div className="flex flex-col justify-center items-center h-screen text-center"><p className="text-xl text-red-500 mb-4">{error}</p><button onClick={() => window.location.reload()} className="btn-primary">Réessayer</button></div>;
    if (currentUser?.role === 'STUDENT' && !isLive) return <div className="flex flex-col items-center justify-center h-screen"><h1 className="text-2xl font-bold">Le cours n'a pas commencé.</h1><p>Veuillez attendre que le professeur lance la session.</p></div>;
    
    const userFullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Vous';
    const teacher = roomState ? Object.values(roomState.participants).find(p => p.role === 'TEACHER') : null;
    const teacherStream = teacher?.id === currentUser?.id ? myStream : (teacher ? streams[teacher.id] : null);
    const activeStudentSpeakers = roomState?.activeSpeakers.filter(id => id !== teacher?.id) || [];
    const nonSpeakingParticipants = roomState ? Object.values(roomState.participants).filter(p => !roomState.activeSpeakers.includes(p.id)) : [];
    
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-background text-text-primary">
            {interrogationRequest && <InterrogationPrompt onAccept={handleAcceptInterrogation} onDecline={() => setInterrogationRequest(false)} />}
            
            <div className="flex-grow flex flex-col relative overflow-hidden bg-gray-900">
                <main className="flex-grow p-2 md:p-4 grid grid-cols-4 grid-rows-1 gap-2 md:gap-4">
                    {/* Zone Vidéo Principale */}
                    <div className="relative col-span-4 md:col-span-3 h-full rounded-lg bg-black">
                        {teacher && teacherStream ? (
                            <VideoPlayer stream={teacherStream} username={`${teacher.firstName} ${teacher.lastName}`} isMuted={teacher.id === currentUser?.id} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">En attente du professeur...</div>
                        )}
                    </div>

                    {/* --- MODIFICATION MAJEURE : COLONNE LATÉRALE UNIFIÉE --- */}
                    <div className="hidden md:flex col-span-1 flex-col gap-4 overflow-y-auto">
                        {/* Section pour les élèves qui parlent (vidéos) */}
                        {activeStudentSpeakers.map(id => {
                            const user = roomState?.participants[id];
                            const stream = (id === currentUser?.id) ? myStream : streams[id];
                            if (!user || !stream) return null;
                            return (
                                <div key={id} className="relative aspect-video rounded-lg bg-black flex-shrink-0">
                                    {/* <VideoPlayer stream={stream} username={`${user.firstName} ${user.lastName}`} isMuted={id === currentUser?.id} /> */}
                                    {/* MODIFICATION : On passe les props au VideoPlayer */}
                                    <VideoPlayer 
                                        stream={stream} 
                                        username={`${user.firstName} ${user.lastName}`} 
                                        isMuted={id === currentUser?.id}
                                        isTeacherView={currentUser?.role === 'TEACHER'}
                                        isStudentVideo={true}
                                        onStopInterrogation={() => handleStopInterrogation(id)}
                                    />
                                </div>
                            );
                        })}

                        {/* Section pour les élèves qui ne parlent pas (avatars) */}
                        <div className="border-t border-gray-700 pt-4 mt-auto space-y-2">
                             <h3 className="text-sm font-bold text-gray-400 mb-2 px-1">Participants</h3>
                             <div className="flex flex-wrap gap-3">
                                {nonSpeakingParticipants.map(user => (
                                    <ParticipantAvatar
                                        key={user.id}
                                        user={user}
                                        isHandRaised={roomState?.handRaises.includes(user.id) || false}
                                        onInterrogate={() => handleInterrogate(user.id)}
                                        isTeacherView={currentUser?.role === 'TEACHER'}
                                    />
                                ))}
                                {nonSpeakingParticipants.length === 0 && activeStudentSpeakers.length === 0 && (
                                    <p className="text-xs text-gray-500 italic p-2">Seul le professeur est présent.</p>
                                )}
                             </div>
                        </div>
                    </div>
                </main>
                
                {myStream && <CallControls isMuted={isMuted} isVideoOff={isVideoOff} onToggleMute={toggleMute} onToggleVideo={toggleVideo} onLeaveCall={leaveCall} onRaiseHand={handleRaiseHand} isStudent={currentUser?.role === 'STUDENT'} />}
            </div>

            {/* Barre latérale droite pour Chat, Participants, Ressources */}
            <div className={`w-full md:w-96 flex-shrink-0 bg-surface text-text-primary border-l border-gray-700 flex flex-col absolute md:relative top-0 right-0 h-full transition-transform duration-300 ${activeTab ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:flex`}>
                <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button onClick={() => setActiveTab('chat')} className={`tab-button ${activeTab === 'chat' && 'active'}`}><MessageSquare size={18}/> Chat</button>
                    <button onClick={() => setActiveTab('participants')} className={`tab-button ${activeTab === 'participants' && 'active'}`}><UsersIcon size={18}/> Participants</button>
                    <button onClick={() => setActiveTab('resources')} className={`tab-button ${activeTab === 'resources' && 'active'}`}><Paperclip size={18}/> Ressources</button>
                </div>
                <div className="flex-grow overflow-hidden">
                    {activeTab === 'chat' && <ChatSection messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} isChatEnabled={isChatEnabled} userFullName={userFullName} />}
                    {activeTab === 'participants' && <ul className="p-4 space-y-3 overflow-y-auto h-full">{roomState?.participants && Object.values(roomState.participants).map(p => ( <li key={p.id} className="flex items-center gap-3"><UserCircle className="h-10 w-10 text-gray-400"/><div><p className="font-semibold">{p.firstName} {p.lastName}</p><p className="text-sm text-text-secondary">{p.role === 'TEACHER' ? 'Professeur' : 'Étudiant'}</p></div></li> ))}</ul>}
                    {activeTab === 'resources' && <ResourcesSection resources={resources} sessionId={sessionId} isTeacher={currentUser?.role === 'TEACHER'} onNewResource={handleNewResource} />}
                </div>
                {currentUser?.role === 'TEACHER' && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 flex-shrink-0">
                        <button onClick={handleToggleLive} className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-semibold text-white ${isLive ? 'bg-red-600' : 'bg-green-600'}`}><Power size={18}/><span>{isLive ? 'Terminer' : 'Démarrer'}</span></button>
                        <button onClick={handleToggleChat} className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-semibold text-white ${isChatEnabled ? 'bg-yellow-600' : 'bg-gray-600'}`}><MicOff size={18}/><span>{isChatEnabled ? 'Désactiver' : 'Activer'} Chat</span></button>
                    </div>
                )}
            </div>
            
            {/* Barre de navigation mobile pour la barre latérale */}
            <div className="md:hidden flex bg-surface border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')} className={`tab-button ${activeTab === 'chat' && 'active'}`}><MessageSquare size={20}/></button>
                <button onClick={() => setActiveTab(activeTab === 'participants' ? null : 'participants')} className={`tab-button ${activeTab === 'participants' && 'active'}`}><UsersIcon size={20}/></button>
                <button onClick={() => setActiveTab(activeTab === 'resources' ? null : 'resources')} className={`tab-button ${activeTab === 'resources' && 'active'}`}><Paperclip size={20}/></button>
            </div>
        </div>
    );
};

export default ClassSessionPage;