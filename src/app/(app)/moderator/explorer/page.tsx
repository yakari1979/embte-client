// (app)/moderator/explorer/page.tsx

"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { 
    Search, Loader2, Plus, ExternalLink, CheckCircle, 
    BookOpen, FileText, Globe, Library 
} from 'lucide-react';
import Link from 'next/link';

// --- TYPES ---
interface ExternalResult {
    title: string;
    author?: string;
    url: string;
    source: string;
    type: 'PDF' | 'LINK' | 'BOOK';
    cover?: string; // Pour OpenLibrary
}

const MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie", "Autre"];

// --- COMPOSANT PRINCIPAL ---
export default function ExplorerPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ExternalResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingUrls, setAddingUrls] = useState<string[]>([]); // Pour gérer le loading par carte
    const [addedUrls, setAddedUrls] = useState<string[]>([]); // Pour marquer comme "Ajouté"

    // État local pour stocker la matière choisie pour chaque résultat
    const [selectedSubjects, setSelectedSubjects] = useState<Record<string, string>>({});

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);
        const token = Cookies.get('token');

        try {
            // Appel à ta route backend qui agrège les API externes
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/external-search`, {
                params: { q: query },
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);
        } catch (error) {
            console.error("Erreur recherche:", error);
            alert("Erreur lors de la recherche externe.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (item: ExternalResult) => {
        const token = Cookies.get('token');
        if (!token) return;

        // On récupère la matière choisie ou on met "Autre" par défaut
        const subject = selectedSubjects[item.url] || "Autre";

        setAddingUrls(prev => [...prev, item.url]);

        try {
            // On utilise la route de création standard
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/resources`, {
                title: item.title + (item.author ? ` - ${item.author}` : ''),
                url: item.url,
                type: item.type,
                source: item.source,
                subject: subject,
                description: `Importé depuis ${item.source} via l'Explorateur.`,
                thumbnailUrl: item.cover || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Succès
            setAddedUrls(prev => [...prev, item.url]);

        } catch (error) {
            console.error("Erreur ajout:", error);
            alert("Impossible d'ajouter cette ressource (peut-être existe-t-elle déjà ?)");
        } finally {
            setAddingUrls(prev => prev.filter(u => u !== item.url));
        }
    };

    // Gestion du changement de matière pour une carte spécifique
    const handleSubjectChange = (url: string, subject: string) => {
        setSelectedSubjects(prev => ({ ...prev, [url]: subject }));
    };

    // Fonction pour déterminer la couleur du badge source
    const getSourceStyle = (source: string) => {
        if (source.includes("Gallica")) return "bg-red-100 text-red-700 border-red-200";
        if (source.includes("Open Library")) return "bg-amber-100 text-amber-700 border-amber-200";
        if (source.includes("Wikisource")) return "bg-blue-100 text-blue-700 border-blue-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50/50 dark:bg-gray-950">
            
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Globe className="text-blue-600" size={32} />
                        Explorateur Universel
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Recherchez dans Gallica (BnF), Open Library et Wikisource simultanément.
                    </p>
                </div>
                <Link 
                    href="/moderator/resources" 
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Library size={16}/> Retour à la bibliothèque
                </Link>
            </div>

            {/* Barre de Recherche */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher une œuvre, un auteur, un sujet..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !query.trim()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin"/> : "Lancer la recherche"}
                    </button>
                </form>
            </div>

            {/* Résultats */}
            {loading && (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"/>
                    <p className="text-gray-500">Interrogation des bibliothèques mondiales...</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
                        >
                            <div>
                                {/* Badge Source */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getSourceStyle(item.source)}`}>
                                        {item.source}
                                    </span>
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-gray-400 hover:text-blue-600 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        title="Voir la source originale"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>

                                {/* Titre & Auteur */}
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">
                                    {item.title}
                                </h3>
                                {item.author && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Par {item.author}
                                    </p>
                                )}

                                {/* Type */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                                    {item.type === 'PDF' ? <FileText size={14}/> : <BookOpen size={14}/>}
                                    <span>Format : {item.type}</span>
                                </div>
                            </div>

                            {/* Zone d'Action (Bas de carte) */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                {addedUrls.includes(item.url) ? (
                                    <div className="w-full py-2 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2 font-medium border border-green-100">
                                        <CheckCircle size={18} />
                                        Ajouté !
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        {/* Sélecteur de matière */}
                                        <select 
                                            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                            value={selectedSubjects[item.url] || ""}
                                            onChange={(e) => handleSubjectChange(item.url, e.target.value)}
                                        >
                                            <option value="" disabled>Choisir matière...</option>
                                            <option value="Autre">Autre (Par défaut)</option>
                                            {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>

                                        {/* Bouton Ajouter */}
                                        <button
                                            onClick={() => handleAddResource(item)}
                                            disabled={addingUrls.includes(item.url)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                                            title="Ajouter à la bibliothèque PENI"
                                        >
                                            {addingUrls.includes(item.url) ? <Loader2 className="animate-spin" size={18}/> : <Plus size={20} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>Aucun résultat trouvé pour "{query}". Essayez un autre terme.</p>
                </div>
            )}
        </div>
    );
}