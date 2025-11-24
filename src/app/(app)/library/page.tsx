// // (app)/library/page.tsx

// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import Cookies from 'js-cookie';
// import Link from 'next/link';
// import Image from 'next/image';
// import { listPublicResources, ExternalResource, ResourceType } from '@/services/api';
// import { Loader2, Search, Video, FileText, Link as LinkIcon, Book, X } from 'lucide-react';
// import useDebounce from '@/hooks/useDebounce'; // Assurez-vous que ce hook existe

// const MATIERES = ["Toutes", "Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];

// const typeConfig: Record<ResourceType, { icon: React.ReactNode, color: string }> = {
//     VIDEO: { icon: <Video />, color: "border-red-500" },
//     PDF: { icon: <FileText />, color: "border-blue-500" },
//     LINK: { icon: <LinkIcon />, color: "border-gray-500" },
//     BOOK: { icon: <Book />, color: "border-green-500" },
// };

// const placeholderByType: Record<ResourceType, string> = {
//     VIDEO: "/assets/placeholder-video.png",
//     PDF: "/assets/placeholder-pdf.png",
//     LINK: "/assets/placeholder-link.png",
//     BOOK: "/assets/placeholder-book.png",
// };

// // --- Sous-composant : Carte de Ressource ---
// const ResourceCard: React.FC<{ resource: ExternalResource }> = ({ resource }) => {
//     const config = typeConfig[resource.type];
//     return (
//         <Link href={`/library/${resource.id}`} className="block group">
//             <div className={`bg-surface rounded-lg shadow-md hover:shadow-xl transition-shadow h-full border-l-4 ${config.color} flex flex-col`}>
//                 <div className="relative h-40">
//                     <Image
//                         src={resource.thumbnailUrl || placeholderByType[resource.type]}
//                         alt={resource.title}
//                         fill
//                         className="object-cover rounded-t-lg"
//                     />
//                 </div>
//                 <div className="p-4 flex flex-col flex-grow">
//                     <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{resource.subject}</p>
//                     <h3 className="font-bold text-text-primary group-hover:text-blue-600 transition-colors mt-1">{resource.title}</h3>
//                     <p className="text-xs text-text-secondary mt-auto pt-2">Source: {resource.source}</p>
//                 </div>
//             </div>
//         </Link>
//     );
// };


// // --- Composant Principal de la Page ---
// const LibraryPage = () => {
//     const [allResources, setAllResources] = useState<ExternalResource[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('Toutes');

//     const debouncedSearchTerm = useDebounce(searchTerm, 300);

//     useEffect(() => {
//         const fetchData = async () => {
//             const token = Cookies.get('token');
//             if (!token) { setLoading(false); return; }
//             try {
//                 const response = await listPublicResources(token);
//                 setAllResources(response.data);
//             } catch (error) { console.error(error); } 
//             finally { setLoading(false); }
//         };
//         fetchData();
//     }, []);

//     const filteredResources = useMemo(() => {
//         return allResources
//             .filter(res => selectedSubject === 'Toutes' || res.subject === selectedSubject)
//             .filter(res => 
//                 debouncedSearchTerm.length < 2 ||
//                 res.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//                 res.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//             );
//     }, [allResources, selectedSubject, debouncedSearchTerm]);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <header className="mb-8">
//                 <h1 className="text-4xl font-bold text-text-primary">Bibliothèque de Ressources</h1>
//                 <p className="text-lg text-text-secondary mt-2">Explorez des vidéos, documents et liens pour approfondir vos connaissances.</p>
//             </header>

//             {/* Barre de Filtres et Recherche */}
//             <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-surface rounded-lg shadow-sm">
//                 <div className="relative flex-grow">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
//                     <input 
//                         type="text"
//                         placeholder="Rechercher une ressource par titre..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="input-field w-full pl-10"
//                     />
//                 </div>
//                 <select 
//                     value={selectedSubject} 
//                     onChange={(e) => setSelectedSubject(e.target.value)}
//                     className="input-field md:w-1/3 lg:w-1/4"
//                 >
//                     {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
//                 </select>
//             </div>

//             {/* Grille des Ressources */}
//             {loading ? (
//                 <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 mx-auto text-blue-500"/></div>
//             ) : filteredResources.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {filteredResources.map(res => <ResourceCard key={res.id} resource={res} />)}
//                 </div>
//             ) : (
//                 <div className="text-center py-20">
//                     <X className="h-12 w-12 mx-auto text-gray-400"/>
//                     <p className="mt-4 font-semibold">Aucune ressource trouvée</p>
//                     <p className="text-text-secondary">Essayez d'ajuster vos filtres de recherche.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LibraryPage;


// (app)/library/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { listPublicResources, ExternalResource, ResourceType } from '@/services/api';
import { 
    Loader2, Search, Video, FileText, Link as LinkIcon, Book, 
    X, Filter, SlidersHorizontal, GraduationCap, Layers, Globe 
} from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

// --- CONSTANTES ---
const MATIERES = ["Toutes", "Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie", "Autre"];
const NIVEAUX = ["Tous", "Terminale S", "Terminale L", "Première S", "Première L", "Seconde S", "Seconde L"];

const typeConfig: Record<string, { label: string, icon: React.ReactNode, color: string, bg: string }> = {
    ALL: { label: "Tout", icon: <Layers size={16} />, color: "border-transparent", bg: "bg-gray-100 text-gray-600" },
    VIDEO: { label: "Vidéos", icon: <Video size={16} />, color: "border-red-500", bg: "bg-red-50 text-red-600" },
    PDF: { label: "Documents", icon: <FileText size={16} />, color: "border-blue-500", bg: "bg-blue-50 text-blue-600" },
    LINK: { label: "Liens Web", icon: <LinkIcon size={16} />, color: "border-purple-500", bg: "bg-purple-50 text-purple-600" },
    BOOK: { label: "Livres", icon: <Book size={16} />, color: "border-green-500", bg: "bg-green-50 text-green-600" },
};

// Placeholder par défaut
const placeholderImage = "/assets/placeholder-book.png"; 

// --- SOUS-COMPOSANT : CARTE RESSOURCE ---
const ResourceCard: React.FC<{ resource: ExternalResource }> = ({ resource }) => {
    const typeInfo = typeConfig[resource.type] || typeConfig.ALL;

    // Fonction pour déterminer l'image à afficher (Youtube ou Placeholder)
    const getImageSrc = () => {
        if (resource.thumbnailUrl) return resource.thumbnailUrl;
        // Fallback simple si pas d'image
        return `https://ui-avatars.com/api/?name=${resource.type}&background=random&size=400`;
    };

    return (
        <Link href={`/library/${resource.id}`} className="block group h-full">
            <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                {/* Image */}
                <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <Image
                        src={getImageSrc()}
                        alt={resource.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge Type */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm ${typeInfo.bg}`}>
                        {typeInfo.icon}
                        {typeInfo.label}
                    </div>
                    {/* Badge Premium (Si applicable) */}
                    {resource.isPremium && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold bg-yellow-400 text-yellow-900 shadow-sm flex items-center gap-1">
                            💎 Inclus
                        </div>
                    )}
                </div>

                {/* Contenu */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Matière */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                            {resource.subject}
                        </span>
                    </div>

                    {/* Titre */}
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                    </h3>

                    {/* Source */}
                    <div className="mt-auto pt-3 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700">
                        <Globe size={12} className="text-gray-400"/>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {resource.source}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- COMPOSANT PRINCIPAL ---
const LibraryPage = () => {
    const [allResources, setAllResources] = useState<ExternalResource[]>([]);
    const [loading, setLoading] = useState(true);
    
    // États des filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('Toutes');
    const [selectedType, setSelectedType] = useState('ALL');
    const [selectedSource, setSelectedSource] = useState('Toutes');
    const [selectedLevel, setSelectedLevel] = useState('Tous');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Chargement initial
    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) { setLoading(false); return; }
            try {
                const response = await listPublicResources(token);
                setAllResources(response.data);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    // Extraction dynamique des sources disponibles
    const availableSources = useMemo(() => {
        const sources = new Set(allResources.map(r => r.source));
        return ["Toutes", ...Array.from(sources)].sort();
    }, [allResources]);

    // Logique de Filtrage
    const filteredResources = useMemo(() => {
        return allResources.filter(res => {
            // 1. Recherche Texte
            const matchesSearch = debouncedSearchTerm === '' || 
                res.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                (res.description && res.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

            // 2. Matière
            const matchesSubject = selectedSubject === 'Toutes' || res.subject === selectedSubject;

            // 3. Type
            const matchesType = selectedType === 'ALL' || res.type === selectedType;

            // 4. Source
            const matchesSource = selectedSource === 'Toutes' || res.source === selectedSource;

            // 5. Niveau (Détection intelligente dans le texte)
            let matchesLevel = true;
            if (selectedLevel !== 'Tous') {
                const textToScan = (res.title + " " + (res.description || "")).toLowerCase();
                const searchLevel = selectedLevel.toLowerCase();
                
                // Logique floue pour "Terminale" vs "Tle"
                if (searchLevel.includes("terminale")) {
                    matchesLevel = textToScan.includes("terminale") || textToScan.includes("tle") || textToScan.includes("bac");
                } else if (searchLevel.includes("première")) {
                    matchesLevel = textToScan.includes("première") || textToScan.includes("premiere") || textToScan.includes("1ère") || textToScan.includes("1ere");
                } else if (searchLevel.includes("seconde")) {
                    matchesLevel = textToScan.includes("seconde") || textToScan.includes("2nde") || textToScan.includes("2nd");
                }
                
                // Si c'est S ou L, on vérifie aussi la lettre
                if (matchesLevel && (searchLevel.endsWith(" s") || searchLevel.endsWith(" l"))) {
                    const letter = searchLevel.slice(-1);
                    matchesLevel = textToScan.includes(` ${letter}`) || textToScan.includes(`-${letter}`);
                }
            }

            return matchesSearch && matchesSubject && matchesType && matchesSource && matchesLevel;
        });
    }, [allResources, debouncedSearchTerm, selectedSubject, selectedType, selectedSource, selectedLevel]);

    // Reset des filtres
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSubject('Toutes');
        setSelectedType('ALL');
        setSelectedSource('Toutes');
        setSelectedLevel('Tous');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            
            {/* Header */}
            <div className="bg-surface dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-text-primary">Bibliothèque Numérique</h1>
                    <p className="text-text-secondary mt-2 max-w-2xl">
                        Accédez à des milliers de ressources pédagogiques (cours, vidéos, exercices) centralisées pour votre réussite.
                    </p>
                    
                    {/* Barre de Recherche Principale */}
                    <div className="mt-6 relative max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                            placeholder="Rechercher un cours, un auteur, un sujet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- SIDEBAR FILTRES (Desktop) --- */}
                    <aside className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-surface dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <SlidersHorizontal size={18}/> Filtres
                                </h2>
                                <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">
                                    Réinitialiser
                                </button>
                            </div>

                            {/* Filtre TYPE */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Type de contenu</label>
                                <div className="space-y-2">
                                    {['ALL', 'VIDEO', 'PDF', 'BOOK', 'LINK'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                selectedType === type 
                                                    ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300' 
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {typeConfig[type].icon}
                                            {typeConfig[type].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtre MATIÈRE */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Matière</label>
                                <select 
                                    value={selectedSubject} 
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500"
                                >
                                    {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            {/* Filtre NIVEAU */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Niveau / Classe</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <select 
                                        value={selectedLevel} 
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="w-full pl-9 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500"
                                    >
                                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Filtre SOURCE */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Source</label>
                                <select 
                                    value={selectedSource} 
                                    onChange={(e) => setSelectedSource(e.target.value)}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500"
                                >
                                    {availableSources.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* --- CONTENU PRINCIPAL --- */}
                    <main className="flex-1">
                        
                        {/* Header Résultats & Toggle Mobile */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {loading ? "Chargement..." : `${filteredResources.length} ressource${filteredResources.length > 1 ? 's' : ''} trouvée${filteredResources.length > 1 ? 's' : ''}`}
                            </h2>
                            
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium shadow-sm"
                            >
                                <Filter size={16} /> Filtres
                            </button>
                        </div>

                        {/* Grille des Ressources */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4"/>
                                <p className="text-gray-500">Recherche dans la bibliothèque...</p>
                            </div>
                        ) : filteredResources.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredResources.map(res => (
                                    <ResourceCard key={res.id} resource={res} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
                                <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-10 w-10 text-gray-400"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun résultat trouvé</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Nous n'avons trouvé aucune ressource correspondant à vos critères. <br/>
                                    Essayez de changer de matière ou de type de contenu.
                                </p>
                                <button 
                                    onClick={resetFilters}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Effacer tous les filtres
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LibraryPage;