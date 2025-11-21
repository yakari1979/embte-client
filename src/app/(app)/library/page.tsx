// (app)/library/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { listPublicResources, ExternalResource, ResourceType } from '@/services/api';
import { Loader2, Search, Video, FileText, Link as LinkIcon, Book, X } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce'; // Assurez-vous que ce hook existe

const MATIERES = ["Toutes", "Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];

const typeConfig: Record<ResourceType, { icon: React.ReactNode, color: string }> = {
    VIDEO: { icon: <Video />, color: "border-red-500" },
    PDF: { icon: <FileText />, color: "border-blue-500" },
    LINK: { icon: <LinkIcon />, color: "border-gray-500" },
    BOOK: { icon: <Book />, color: "border-green-500" },
};

const placeholderByType: Record<ResourceType, string> = {
    VIDEO: "/assets/placeholder-video.png",
    PDF: "/assets/placeholder-pdf.png",
    LINK: "/assets/placeholder-link.png",
    BOOK: "/assets/placeholder-book.png",
};

// --- Sous-composant : Carte de Ressource ---
const ResourceCard: React.FC<{ resource: ExternalResource }> = ({ resource }) => {
    const config = typeConfig[resource.type];
    return (
        <Link href={`/library/${resource.id}`} className="block group">
            <div className={`bg-surface rounded-lg shadow-md hover:shadow-xl transition-shadow h-full border-l-4 ${config.color} flex flex-col`}>
                <div className="relative h-40">
                    {/* <Image
                        src={resource.thumbnailUrl || `/assets/video1${resource.type.toLowerCase()}.png`} // Ex: /assets/placeholder-video.png
                        alt={resource.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    /> */}

                    <Image
                        src={resource.thumbnailUrl || placeholderByType[resource.type]}
                        alt={resource.title}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{resource.subject}</p>
                    <h3 className="font-bold text-text-primary group-hover:text-blue-600 transition-colors mt-1">{resource.title}</h3>
                    <p className="text-xs text-text-secondary mt-auto pt-2">Source: {resource.source}</p>
                </div>
            </div>
        </Link>
    );
};


// --- Composant Principal de la Page ---
const LibraryPage = () => {
    const [allResources, setAllResources] = useState<ExternalResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('Toutes');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

    const filteredResources = useMemo(() => {
        return allResources
            .filter(res => selectedSubject === 'Toutes' || res.subject === selectedSubject)
            .filter(res => 
                debouncedSearchTerm.length < 2 ||
                res.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                res.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
    }, [allResources, selectedSubject, debouncedSearchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-text-primary">Bibliothèque de Ressources</h1>
                <p className="text-lg text-text-secondary mt-2">Explorez des vidéos, documents et liens pour approfondir vos connaissances.</p>
            </header>

            {/* Barre de Filtres et Recherche */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-surface rounded-lg shadow-sm">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input 
                        type="text"
                        placeholder="Rechercher une ressource par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full pl-10"
                    />
                </div>
                <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="input-field md:w-1/3 lg:w-1/4"
                >
                    {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Grille des Ressources */}
            {loading ? (
                <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 mx-auto text-blue-500"/></div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map(res => <ResourceCard key={res.id} resource={res} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <X className="h-12 w-12 mx-auto text-gray-400"/>
                    <p className="mt-4 font-semibold">Aucune ressource trouvée</p>
                    <p className="text-text-secondary">Essayez d'ajuster vos filtres de recherche.</p>
                </div>
            )}
        </div>
    );
};

export default LibraryPage;