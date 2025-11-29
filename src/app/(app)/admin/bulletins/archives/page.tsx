"use client";

import React, { useState, useEffect } from 'react';
import { listClasses, publishBulletins } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { 
    Archive, Send, Users, Edit, Search, 
    GraduationCap, Calendar, ChevronRight, Loader2 
} from 'lucide-react';

export default function ArchivesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const token = Cookies.get('token');
            if (!token) return;
            try {
                const res = await listClasses(token);
                // @ts-ignore
                setClasses(res.data);
            } catch (error) {
                console.error("Erreur chargement classes", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handlePublish = async (classId: string, className: string) => {
        if(!confirm(`Confirmer l'envoi des bulletins pour la classe de ${className} ?\nLes élèves recevront une notification.`)) return;
        
        const token = Cookies.get('token');
        try {
            await publishBulletins(classId, "SEMESTRE_1", token!);
            alert("✅ Bulletins publiés et notifications envoyées !");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur lors de la publication.");
        }
    };

    const handlePublishToParents = async (classId: string, className: string) => {
        if(!confirm(`Confirmer l'envoi des bulletins aux PARENTS de la classe ${className} ?\nIls recevront une notification.`)) return;
        
        const token = Cookies.get('token');
        try {
            // On spécifie target: 'PARENT'
            await publishBulletins(classId, "SEMESTRE_1", token!, 'PARENT');
            alert("✅ Notifications envoyées aux parents !");
        } catch (e) {
            console.error(e);
            alert("❌ Erreur lors de l'envoi.");
        }
    };

    // Filtrer les classes selon la recherche
    const filteredClasses = classes.filter((c: any) => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fonction utilitaire pour récupérer le nombre d'élèves de manière robuste
    const getStudentCount = (c: any) => {
        if (c._count && typeof c._count.students === 'number') return c._count.students;
        if (c.students && Array.isArray(c.students)) return c.students.length;
        return 0;
    };

    return (
        <div className="p-6 md:p-10 bg-[--background] min-h-screen text-text-primary font-sans">
            
            {/* --- EN-TÊTE --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Archive className="text-blue-600"/> Archives Bulletins
                    </h1>
                    <p className="text-text-secondary mt-2 text-sm">
                        Gérez, modifiez et publiez les bulletins semestriels de toutes vos classes.
                    </p>
                </div>

                {/* Barre de recherche */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher une classe..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* --- CONTENU --- */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600 h-10 w-10"/>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="text-center py-20 bg-surface rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-400">Aucune classe trouvée.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredClasses.map((c: any, index: number) => (
                        <div 
                            key={c.id} 
                            className="group bg-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            style={{ animationDelay: `${index * 50}ms` }} // Effet cascade
                        >
                            {/* Header Carte */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary group-hover:text-blue-600 transition-colors">
                                        {c.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                                        <GraduationCap size={14}/> 
                                        <span>{getStudentCount(c)} Élèves inscrits</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md text-[10px] font-bold uppercase tracking-wide">
                                        Semestre 1
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Calendar size={10}/> 2024-25
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                
                                {/* Bouton Voir / Modifier (Principal) */}
                                <Link 
                                    href={`/admin/bulletins?classId=${c.id}`} 
                                    className="block w-full"
                                >
                                    <button className="w-full py-2.5 bg-gray-50 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/20 text-text-primary hover:text-blue-600 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                                        <Edit size={16}/> 
                                        Gérer les Bulletins
                                        <ChevronRight size={14} className="opacity-50 group-hover:translate-x-1 transition-transform"/>
                                    </button>
                                </Link>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Envoyer Élèves */}
                                    <button 
                                        onClick={() => handlePublish(c.id, c.name)}
                                        className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
                                    >
                                        <Send size={14}/> 
                                        <span>Publier (Élèves)</span>
                                    </button>
                                    
                                    {/* Envoyer Parents */}
                                    {/* <button 
                                        className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-purple-500/20 active:scale-95"
                                        onClick={() => alert("Le portail Parents sera bientôt disponible !")}
                                    >
                                        <Users size={14}/> 
                                        <span>Envoyer (Parents)</span>
                                    </button> */}

                                    <button 
                                        onClick={() => handlePublishToParents(c.id, c.name)} // <-- ICI
                                        className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors shadow-lg shadow-purple-500/20 active:scale-95"
                                    >
                                        <Users size={14}/> 
                                        <span>Envoyer (Parents)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}